import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Replicate from 'replicate';

export const runtime = 'nodejs';

const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;

// 使用你提供的正确的OpenAI Whisper模型ID
const WHISPER_MODEL_ID = "openai/whisper:8099696689d249cf8b122d833c36ac3f75505c666a395ca40ef26f68e7d3d16e";

export async function POST(req: NextRequest) {
  try {
    console.log('📡 收到转录请求');
    console.log('📡 Content-Type:', req.headers.get('content-type'));
    
    // 检查用户认证状态
    const session = await getServerSession(authOptions);
    let isLoggedIn = !!(session && session.user?.id);
    
    console.log('👤 用户认证状态:', isLoggedIn ? `已登录: ${session.user.email}` : '未登录');
    
    // 尝试获取formData，添加错误处理
    let formData;
    try {
      formData = await req.formData();
    } catch (formError: any) {
      console.error('❌ FormData解析失败:', formError);
      return NextResponse.json({ 
        error: '文件上传格式错误，请重新选择文件',
        suggestion: '请确保选择的是有效的音频文件',
        timestamp: new Date().toISOString()
      }, { status: 400 });
    }

    const file = formData.get('file') as File;
    const language = formData.get('language') as string;
    const outputLang = formData.get('outputLang') as string || language;
    const guestUsageCount = formData.get('guestUsageCount') as string || '0';

    if (!file) {
      return NextResponse.json({ error: '没有找到文件' }, { status: 400 });
    }
    if (!file.type.startsWith('audio/')) {
      return NextResponse.json({ error: '只接受音频文件' }, { status: 400 });
    }
    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json({ error: '文件太大，最大支持50MB' }, { status: 400 });
    }

    // Vercel平台限制检查
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ 
        error: '文件大小超过Vercel平台限制（5MB）',
        suggestion: '请使用以下方案之一：\n1. 将音频文件压缩到5MB以下\n2. 分割音频文件为多个小片段\n3. 考虑使用其他部署平台（如Netlify、Railway等）',
        platform: 'vercel',
        maxSize: '5MB',
        currentSize: `${(file.size / 1024 / 1024).toFixed(2)}MB`
      }, { status: 413 });
    }

    // 配额检查逻辑 - 暂时移除所有限制，完全免费开放
    console.log('🎉 免费模式：跳过所有配额检查');
    
    // 注释掉原有的配额检查代码
    /*
    if (isLoggedIn) {
      // 已登录用户：检查数据库配额
      try {
        const user = await prisma.user.findUnique({
          where: { id: session.user.id },
          include: { subscription: true }
        });

        if (!user || !user.subscription) {
          return NextResponse.json({ 
            error: '用户订阅信息不存在，请联系客服'
          }, { status: 400 });
        }

        // 获取本月使用量
        const currentMonth = new Date();
        currentMonth.setDate(1);
        currentMonth.setHours(0, 0, 0, 0);

        const monthlyUsage = await prisma.usageRecord.aggregate({
          where: {
            userId: session.user.id,
            date: {
              gte: currentMonth
            }
          },
          _sum: {
            amount: true
          }
        });

        const usedMinutes = monthlyUsage._sum.amount || 0;
        
        // 根据计划检查配额
        let maxMinutes = 10; // 免费版默认10分钟
        if (user.subscription.planType === "professional") {
          maxMinutes = 500; // 专业版500分钟
        } else if (user.subscription.planType === "enterprise") {
          maxMinutes = 2000; // 企业版2000分钟
        }

        const remainingMinutes = maxMinutes - usedMinutes;
        
        // 估算音频时长（简单估算：文件大小MB * 8 / 比特率的近似值）
        const estimatedDurationMinutes = (file.size / (1024 * 1024)) * 2; // 粗略估算
        
        if (remainingMinutes < estimatedDurationMinutes) {
          return NextResponse.json({ 
            error: `当前计划配额不足。剩余：${remainingMinutes.toFixed(1)}分钟，需要：${estimatedDurationMinutes.toFixed(1)}分钟`,
            quota: {
              used: usedMinutes,
              total: maxMinutes,
              remaining: remainingMinutes,
              planType: user.subscription.planType
            },
            needsUpgrade: true
          }, { status: 403 });
        }

        console.log(`✅ 已登录用户配额检查通过：已用 ${usedMinutes}/${maxMinutes} 分钟`);
      } catch (dbError) {
        console.error('❌ 数据库查询失败:', dbError);
        // 继续处理，不因为数据库问题阻止转录
      }
    } else {
      // 未登录用户：检查客户端传来的使用次数
      const currentUsageCount = parseInt(guestUsageCount) || 0;
      const maxGuestUsage = 5; // 未登录用户最多5次
      
      if (currentUsageCount >= maxGuestUsage) {
        return NextResponse.json({ 
          error: `免费体验次数已用完（${maxGuestUsage}次）`,
          suggestion: '注册登录后可获得10次免费使用机会',
          needsAuth: true,
          guestLimitReached: true,
          maxGuestUsage,
          currentUsage: currentUsageCount
        }, { status: 403 });
      }
      
      console.log(`✅ 未登录用户配额检查通过：已用 ${currentUsageCount}/${maxGuestUsage} 次`);
    }
    */

    // 在数据库中创建转录记录（如果用户已登录）
    let transcriptionRecord;
    if (isLoggedIn) {
      try {
        transcriptionRecord = await prisma.transcription.create({
          data: {
            userId: session.user.id,
            fileName: file.name,
            fileSize: file.size,
            duration: 0, // 将在转录完成后更新
            language: language === 'auto' ? 'auto' : language,
            outputLang: outputLang,
            status: 'processing'
          }
        });
        console.log('📝 创建转录记录:', transcriptionRecord.id);
      } catch (dbError) {
        console.error('❌ 创建转录记录失败:', dbError);
        // 继续处理，不因为数据库问题阻止转录
      }
    }

    // 检查是否有有效的API Token
    if (!REPLICATE_API_TOKEN || REPLICATE_API_TOKEN === 'YOUR_TOKEN_HERE' || REPLICATE_API_TOKEN.length < 10) {
      console.log('⚠️ 没有有效的Replicate API Token，使用演示模式');
      
      // 返回演示数据，让用户可以看到界面效果
      const demoSegments = [
        {
          speaker: 'Speaker 1',
          text: '欢迎使用VoiceScribe语音转文字平台！',
          startTime: 0,
          id: 0,
          seek: 0,
          end: 3.2
        },
        {
          speaker: 'Speaker 1', 
          text: '这是一个演示转录结果，展示应用的界面和功能。',
          startTime: 3.5,
          id: 1,
          seek: 3.5,
          end: 7.8
        },
        {
          speaker: 'Speaker 2',
          text: '要使用真实转录功能，请配置有效的Replicate API Token。',
          startTime: 8.0,
          id: 2,
          seek: 8.0,
          end: 12.5
        },
        {
          speaker: 'Speaker 1',
          text: `您上传的文件是：${file.name}，大小：${(file.size / 1024 / 1024).toFixed(2)}MB`,
          startTime: 13.0,
          id: 3,
          seek: 13.0,
          end: 17.0
        }
      ];

      // 更新转录记录（演示模式）
      if (transcriptionRecord) {
        try {
          await prisma.transcription.update({
            where: { id: transcriptionRecord.id },
            data: {
              status: 'completed',
              transcript: JSON.stringify(demoSegments),
              duration: 17.0
            }
          });

          // 记录使用量（演示模式按0.5分钟计算）
          await prisma.usageRecord.create({
            data: {
              userId: session.user.id,
              type: 'transcription',
              amount: 0.5
            }
          });
        } catch (updateError) {
          console.error('❌ 更新转录记录失败:', updateError);
        }
      }
      
      return NextResponse.json({ 
        transcript: demoSegments,
        detectedLanguage: language === 'auto' ? 'zh' : language,
        isDemoMode: true,
        transcriptionId: transcriptionRecord?.id,
        instructions: [
          '🎯 这是演示模式，展示应用界面和功能',
          '🔑 要使用真实转录，请获取Replicate API Token：',
          '   1. 访问 https://replicate.com/account/api-tokens',
          '   2. 注册/登录账号并创建新的API Token',
          '   3. 在Vercel项目设置中添加环境变量 REPLICATE_API_TOKEN',
          '   4. 重新部署即可使用真实转录功能'
        ]
      });
    }

    console.log('==== 转录请求开始 ====');
    console.log('文件信息:', { fileName: file.name, fileSize: file.size, fileType: file.type });
    console.log('语言设置:', language);
    console.log('API Token状态:', REPLICATE_API_TOKEN ? `已配置 (${REPLICATE_API_TOKEN.substring(0, 8)}...)` : '未配置');

    // 检查文件大小并给出建议
    const fileSizeMB = file.size / (1024 * 1024);
    console.log('文件大小:', fileSizeMB.toFixed(2), 'MB');
    
    if (fileSizeMB > 20) {
      console.log('⚠️ 大文件警告: 文件较大，可能影响转录完整性');
    }

    // 创建Replicate实例
    let replicate;
    try {
      replicate = new Replicate({ auth: REPLICATE_API_TOKEN });
    } catch (authError) {
      console.error('❌ Replicate认证失败:', authError);
      
      // 更新转录状态为失败
      if (transcriptionRecord) {
        await prisma.transcription.update({
          where: { id: transcriptionRecord.id },
          data: { status: 'failed' }
        });
      }
      
      return NextResponse.json({ 
        error: 'API认证失败，请检查REPLICATE_API_TOKEN是否正确配置',
        needsApiToken: true
      }, { status: 401 });
    }

    // 准备音频数据
    const arrayBuffer = await file.arrayBuffer();
    const base64Audio = Buffer.from(arrayBuffer).toString('base64');

    // 根据OpenAI Whisper API格式构建输入参数
    const input: Record<string, any> = {
      audio: `data:${file.type};base64,${base64Audio}`,
    };
    
    // 添加语言参数（如果指定）
    if (language && language !== 'auto') {
      input.language = language;
      console.log('✅ 使用指定语言:', language);
    } else {
      console.log('✅ 使用自动检测');
    }

    console.log('发送API请求...');
    
    // 调用OpenAI Whisper API with timeout
    let output;
    try {
      // 缩短超时时间到2分钟，避免Vercel函数超时
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('API请求超时（120秒）')), 120000); // 2分钟超时
      });

      const apiPromise = replicate.run(WHISPER_MODEL_ID, { input });
      
      output = await Promise.race([apiPromise, timeoutPromise]);
      
      console.log('✅ API调用成功');
    } catch (apiError: any) {
      console.error('❌ API调用失败:', apiError);
      
      // 更新转录状态为失败
      if (transcriptionRecord) {
        await prisma.transcription.update({
          where: { id: transcriptionRecord.id },
          data: { status: 'failed' }
        });
      }
      
      // 处理不同类型的API错误
      if (apiError.message?.includes('timeout') || apiError.message?.includes('API请求超时')) {
        return NextResponse.json({ 
          error: '转录处理超时（2分钟限制）',
          suggestion: '请尝试以下解决方案：\n1. 使用更短的音频文件（建议3分钟以内）\n2. 压缩音频文件质量\n3. 稍后重试',
          timeout: true
        }, { status: 408 });
      }
      
      if (apiError.message?.includes('Unauthorized') || apiError.status === 401) {
        return NextResponse.json({ 
          error: 'API Token无效或已过期，请更新REPLICATE_API_TOKEN',
          needsApiToken: true
        }, { status: 401 });
      }
      
      if (apiError.message?.includes('Rate limit')) {
        return NextResponse.json({ 
          error: '请求频率过高，请等待几分钟后重试'
        }, { status: 429 });
      }
      
      if (apiError.message?.includes('Invalid input')) {
        return NextResponse.json({ 
          error: '音频文件格式不支持，请使用MP3、WAV等常见格式'
        }, { status: 400 });
      }
      
      // 通用错误处理
      return NextResponse.json({ 
        error: `转录服务暂时不可用: ${apiError.message || '未知错误'}`,
        suggestion: '请稍后重试，或联系技术支持',
        details: apiError.message
      }, { status: 500 });
    }

    console.log('==== API返回数据类型检查 ====');
    console.log('output类型:', typeof output);
    console.log('output是否为空:', !output);
    console.log('output结构:', output);

    if (!output) {
      console.error('❌ API返回空数据');
      
      if (transcriptionRecord) {
        await prisma.transcription.update({
          where: { id: transcriptionRecord.id },
          data: { status: 'failed' }
        });
      }
      
      return NextResponse.json({ 
        error: '转录处理失败，未获得有效结果',
        suggestion: '请检查音频文件质量或稍后重试'
      }, { status: 500 });
    }

    // 处理转录结果并保存到数据库
    const segments = Array.isArray(output.segments) ? output.segments.map((segment: any, index: number) => {
      // 为每个segment添加speaker字段
      const speakerNumber = (index % 3) + 1; // 简单的说话人分配逻辑
      return {
        ...segment,
        speaker: `Speaker ${speakerNumber}`,
        startTime: segment.start || 0
      };
    }) : [];
    const detectedLanguage = output.detected_language || language;
    const totalDuration = segments.length > 0 ? segments[segments.length - 1].end : 0;

    console.log('🔍 检查翻译需求:');
    console.log('检测到的语言:', detectedLanguage);
    console.log('期望输出语言:', outputLang);
    console.log('是否需要翻译:', detectedLanguage !== outputLang);

    // 标准化语言代码
    const standardizeLanguageCode = (lang: string): string => {
      const languageMapping: { [key: string]: string } = {
        'chinese': 'zh',
        'english': 'en',
        'japanese': 'ja',
        'korean': 'ko',
        'spanish': 'es',
        'french': 'fr',
        'german': 'de',
        'russian': 'ru',
        'arabic': 'ar',
        'hindi': 'hi',
        'portuguese': 'pt',
        'italian': 'it',
        'thai': 'th',
        'vietnamese': 'vi'
      };
      return languageMapping[lang.toLowerCase()] || lang;
    };

    const standardDetectedLang = standardizeLanguageCode(detectedLanguage);
    const standardOutputLang = standardizeLanguageCode(outputLang);

    console.log('🔄 标准化后的语言代码:');
    console.log('检测语言:', `${detectedLanguage} -> ${standardDetectedLang}`);
    console.log('输出语言:', `${outputLang} -> ${standardOutputLang}`);

    // 原文转录始终保持检测到的原始语言，不进行翻译
    // 翻译功能由前端TranscriptDisplay组件处理
    let finalSegments = segments;
    console.log('ℹ️ 保持原文转录的原始语言，翻译由前端处理');

    // 更新转录记录
    if (transcriptionRecord) {
      try {
        await prisma.transcription.update({
          where: { id: transcriptionRecord.id },
          data: {
            status: 'completed',
            transcript: JSON.stringify(finalSegments),
            duration: totalDuration
          }
        });

        // 记录使用量
        await prisma.usageRecord.create({
          data: {
            userId: session.user.id,
            type: 'transcription',
            amount: totalDuration / 60 // 转换为分钟
          }
        });

        console.log('✅ 转录记录更新成功');
      } catch (updateError) {
        console.error('❌ 更新转录记录失败:', updateError);
      }
    }

    return NextResponse.json({
      transcript: finalSegments,
      detectedLanguage,
      transcriptionId: transcriptionRecord?.id,
      duration: totalDuration,
      isLoggedIn: isLoggedIn
    });

  } catch (error: any) {
    console.error('❌ 转录处理失败:', error);
    return NextResponse.json({ 
      error: '转录处理失败',
      details: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 