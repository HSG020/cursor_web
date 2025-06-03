import { NextRequest, NextResponse } from 'next/server';
import Replicate from 'replicate';

export const runtime = 'nodejs';

const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;

// 使用你提供的正确的OpenAI Whisper模型ID
const WHISPER_MODEL_ID = "openai/whisper:8099696689d249cf8b122d833c36ac3f75505c666a395ca40ef26f68e7d3d16e";

export async function POST(req: NextRequest) {
  try {
    console.log('📡 收到转录请求');
    console.log('📡 Content-Type:', req.headers.get('content-type'));
    
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

    if (!file) {
      return NextResponse.json({ error: '没有找到文件' }, { status: 400 });
    }
    if (!file.type.startsWith('audio/')) {
      return NextResponse.json({ error: '只接受音频文件' }, { status: 400 });
    }
    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json({ error: '文件太大，最大支持50MB' }, { status: 400 });
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
      
      return NextResponse.json({ 
        transcript: demoSegments,
        detectedLanguage: language === 'auto' ? 'zh' : language,
        isDemoMode: true,
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
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('API请求超时')), 300000); // 5分钟超时
      });

      const apiPromise = replicate.run(WHISPER_MODEL_ID, { input });
      
      output = await Promise.race([apiPromise, timeoutPromise]);
    } catch (apiError: any) {
      console.error('❌ API调用失败:', apiError);
      
      // 处理不同类型的API错误
      if (apiError.message?.includes('timeout') || apiError.message?.includes('API请求超时')) {
        return NextResponse.json({ 
          error: '转录处理超时，请尝试使用较短的音频文件或稍后重试',
          suggestion: '建议：将音频文件分割成5分钟以内的片段'
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
        suggestion: '请稍后重试，或联系技术支持'
      }, { status: 500 });
    }

    console.log('==== API响应处理 ====');
    console.log('输出类型:', typeof output);
    
    // 处理输出格式
    let segments = [];
    let detectedLanguage = 'en';
    
    if ((output as any)?.segments && Array.isArray((output as any).segments)) {
      console.log('✅ 检测到segments数组，长度:', (output as any).segments.length);
      
      const rawSegments = (output as any).segments;
      
      segments = rawSegments.map((seg: any, index: number) => ({
        speaker: `Speaker ${(index % 3) + 1}`,
        text: seg.text || '',
        startTime: seg.start || seg.seek || 0,
        id: seg.id || index,
        seek: seg.start || seg.seek || 0,
        end: seg.end || 0
      })).filter((seg: any) => seg.text.trim().length > 0);
      
      if (segments.length > 0) {
        const allText = segments.map((s: any) => s.text).join(' ');
        console.log('过滤后的segments数量:', segments.length);
        
        // 简单的语言检测
        const chineseChars = (allText.match(/[\u4e00-\u9fff]/g) || []).length;
        const totalChars = allText.length;
        const chineseRatio = totalChars > 0 ? chineseChars / totalChars : 0;
        
        detectedLanguage = chineseRatio > 0.3 ? 'zh' : 'en';
        console.log('检测到的语言:', detectedLanguage);
      } else {
        console.log('⚠️ 警告：过滤后没有有效的segments');
      }
    } else {
      console.log('❌ 未检测到segments数组，尝试其他格式...');
      
      // 尝试其他可能的格式
      if (typeof output === 'string') {
        segments = [{
          speaker: 'Speaker 1',
          text: output,
          startTime: 0,
          id: 0,
          seek: 0,
          end: 0
        }];
      } else if ((output as any)?.text) {
        segments = [{
          speaker: 'Speaker 1',
          text: (output as any).text,
          startTime: 0,
          id: 0,
          seek: 0,
          end: 0
        }];
      }
    }

    if (segments.length === 0) {
      console.log('❌ 错误：没有生成任何转录结果');
      return NextResponse.json({ 
        error: '转录未产生任何结果',
        suggestion: '请检查音频文件质量，确保包含可识别的语音内容'
      }, { status: 422 });
    }
    
    console.log('==== 转录成功完成 ====');
    console.log('segments数量:', segments.length);
    console.log('最终语言:', detectedLanguage);

    return NextResponse.json({ 
      transcript: segments,
      detectedLanguage: detectedLanguage
    });
  } catch (e: any) {
    console.error('❌ 转录处理错误:', e);
    
    // 确保返回JSON格式的错误响应
    const errorMessage = e.message || '转录处理失败';
    
    return NextResponse.json({ 
      error: errorMessage,
      timestamp: new Date().toISOString(),
      suggestion: '请检查音频文件格式和网络连接，然后重试'
    }, { status: 500 });
  }
} 