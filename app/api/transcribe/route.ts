import { NextRequest, NextResponse } from 'next/server';
import Replicate from 'replicate';

export const runtime = 'nodejs';

const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;

// 使用你提供的正确的OpenAI Whisper模型ID
const WHISPER_MODEL_ID = "openai/whisper:8099696689d249cf8b122d833c36ac3f75505c666a395ca40ef26f68e7d3d16e";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
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
          '   3. 更新 .env.local 文件中的 REPLICATE_API_TOKEN',
          '   4. 重启应用即可使用真实转录功能'
        ]
      });
    }

    console.log('==== 转录请求开始 ====');
    console.log('文件信息:', { fileName: file.name, fileSize: file.size, fileType: file.type });
    console.log('语言设置:', language);

    // 检查文件大小并给出建议
    const fileSizeMB = file.size / (1024 * 1024);
    console.log('文件大小:', fileSizeMB.toFixed(2), 'MB');
    
    if (fileSizeMB > 20) {
      console.log('⚠️ 大文件警告: 文件较大，可能影响转录完整性');
      console.log('建议: 使用音频压缩或分割文件以获得更好的效果');
    }

    const arrayBuffer = await file.arrayBuffer();
    const base64Audio = Buffer.from(arrayBuffer).toString('base64');
    const replicate = new Replicate({ auth: REPLICATE_API_TOKEN });

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

    // 估算音频时长（粗略估算）
    const estimatedDurationSeconds = file.size / (44100 * 2 * 2); // 假设44.1kHz, 16bit, stereo
    console.log('估算音频时长:', estimatedDurationSeconds.toFixed(1), '秒');
    
    console.log('发送给OpenAI Whisper的input参数:', { 
      hasAudio: !!input.audio, 
      audioPrefix: input.audio?.substring(0, 50),
      language: input.language || '自动检测',
      estimatedDuration: estimatedDurationSeconds.toFixed(1) + 's'
    });

    // 调用OpenAI Whisper API
    const output = await replicate.run(WHISPER_MODEL_ID, { input });

    console.log('==== OpenAI Whisper API 原始输出 ====');
    console.log('输出类型:', typeof output);
    console.log('完整输出:', JSON.stringify(output, null, 2));

    // 处理输出格式 - 根据你的示例，输出应该有segments数组
    let segments = [];
    let detectedLanguage = 'en';
    
    if ((output as any)?.segments && Array.isArray((output as any).segments)) {
      console.log('✅ 检测到segments数组，长度:', (output as any).segments.length);
      
      // 处理segments数据
      const rawSegments = (output as any).segments;
      console.log('原始segments信息:', rawSegments.map((seg: any) => ({
        id: seg.id,
        start: seg.start,
        end: seg.end,
        textLength: seg.text?.length || 0
      })));
      
      segments = rawSegments.map((seg: any, index: number) => ({
        speaker: `Speaker ${(index % 3) + 1}`,
        text: seg.text || '',
        startTime: seg.start || seg.seek || 0,
        id: seg.id || index,
        seek: seg.start || seg.seek || 0,
        end: seg.end || 0
      })).filter((seg: any) => seg.text.trim().length > 0); // 过滤空文本
      
      if (segments.length > 0) {
        const allText = segments.map((s: any) => s.text).join(' ');
        console.log('过滤后的segments数量:', segments.length);
        console.log('最后一个segment:', segments[segments.length - 1]);
        console.log('所有转录文本长度:', allText.length);
        
        // 检查音频时长vs转录覆盖时长
        const lastSegment = segments[segments.length - 1];
        const totalTranscribedTime = lastSegment.end || lastSegment.startTime;
        console.log('转录覆盖的总时长:', totalTranscribedTime, '秒');
        
        // 检查是否可能有音频截断
        const completionRatio = totalTranscribedTime / estimatedDurationSeconds;
        console.log('转录完整度:', (completionRatio * 100).toFixed(1) + '%');
        
        if (completionRatio < 0.8) {
          console.log('⚠️ 警告：转录可能不完整！');
          console.log('预估音频时长:', estimatedDurationSeconds.toFixed(1), '秒');
          console.log('实际转录时长:', totalTranscribedTime, '秒');
          console.log('可能原因：1. 音频质量问题 2. API处理限制 3. 文件格式问题');
        }
        
        // 简单的语言检测
        const chineseChars = (allText.match(/[\u4e00-\u9fff]/g) || []).length;
        const totalChars = allText.length;
        const chineseRatio = totalChars > 0 ? chineseChars / totalChars : 0;
        
        detectedLanguage = chineseRatio > 0.3 ? 'zh' : 'en';
        console.log('检测到的语言:', detectedLanguage);
        console.log('中文字符比例:', (chineseRatio * 100).toFixed(1) + '%');
      } else {
        console.log('⚠️ 警告：过滤后没有有效的segments');
      }
    } else {
      console.log('❌ 未检测到segments数组');
      console.log('API返回的完整结构:', Object.keys(output as any || {}));
      
      // 尝试其他可能的格式
      if (typeof output === 'string') {
        console.log('尝试使用字符串格式');
        segments = [{
          speaker: 'Speaker 1',
          text: output,
          startTime: 0,
          id: 0,
          seek: 0,
          end: 0
        }];
      } else if ((output as any)?.text) {
        console.log('尝试使用text字段');
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

    console.log('==== 最终结果 ====');
    console.log('segments数量:', segments.length);
    console.log('最终语言:', detectedLanguage);
    
    if (segments.length === 0) {
      console.log('❌ 错误：没有生成任何转录结果');
      throw new Error('转录未产生任何结果，请检查音频文件质量或稍后重试');
    }
    
    console.log('==== 转录请求结束 ====');

    return NextResponse.json({ 
      transcript: segments,
      detectedLanguage: detectedLanguage
    });
  } catch (e: any) {
    console.error('❌ 转录API错误:', e);
    
    // 提供更友好的错误信息
    let errorMessage = '转录失败';
    
    if (e.message) {
      if (e.message.includes('Unauthorized') || e.message.includes('401')) {
        errorMessage = 'API Token无效或已过期，请更新REPLICATE_API_TOKEN';
      } else if (e.message.includes('Prediction interrupted')) {
        errorMessage = '转录服务暂时不可用，请稍后重试';
      } else if (e.message.includes('转录超时')) {
        errorMessage = '音频处理超时，建议使用较短的音频文件或分割音频';
      } else if (e.message.includes('Invalid input')) {
        errorMessage = '音频文件格式不支持，请使用 MP3、WAV 等常见格式';
      } else if (e.message.includes('File too large')) {
        errorMessage = '文件太大，请使用小于50MB的音频文件';
      } else if (e.message.includes('Rate limit')) {
        errorMessage = '请求频率过高，请稍后重试';
      } else {
        errorMessage = e.message;
      }
    }
    
    console.error('返回错误信息:', errorMessage);
    return NextResponse.json({ 
      error: errorMessage,
      needsApiToken: errorMessage.includes('API Token')
    }, { status: 500 });
  }
} 