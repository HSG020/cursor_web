import Replicate from "replicate";
import { getAudioDuration, shouldSplitAudio, splitAudioFile } from "./audio-utils";

export interface TranscriptSegment {
  id?: number;
  seek?: number;
  end?: number;
  text: string;
  speaker: string;
  startTime: number;
}

export interface TranscriptionResult {
  transcript: TranscriptSegment[];
  detectedLanguage?: string;
  wasSplit?: boolean;
  totalSegments?: number;
}

// 支持的文件类型
const SUPPORTED_AUDIO_TYPES = [
  'audio/mpeg',
  'audio/mp3',
  'audio/wav',
  'audio/webm',
  'audio/ogg'
];

// 最大文件大小（50MB）
const MAX_FILE_SIZE = 50 * 1024 * 1024;

// 示例音频URL - 用于演示
const DEMO_AUDIO_URL = "https://replicate.delivery/mgxm/e5159b1b-508a-4be4-b892-e1eb47850bdc/OSR_uk_000_0050_8k.wav";

// Whisper模型ID
const WHISPER_MODEL_ID = "soykertje/whisper:20de0792d38812ce94a0ba8e699b3416cbdc75486ed660db12deeb1b28f35bb6";

/**
 * 验证音频文件
 */
function validateAudioFile(file: File): void {
  if (!SUPPORTED_AUDIO_TYPES.includes(file.type)) {
    throw new Error(`不支持的文件类型: ${file.type}。支持的类型: ${SUPPORTED_AUDIO_TYPES.join(', ')}`);
  }
  
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`文件太大。最大支持: ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
  }
}

/**
 * 处理Whisper API返回的结果，将其转换为应用程序可用的格式
 */
function processWhisperResult(result: any): TranscriptSegment[] {
  console.log("API返回结果:", result);
  
  if (!result) {
    throw new Error("API返回空结果");
  }
  
  if (result.segments && Array.isArray(result.segments)) {
    return result.segments.map((segment: any, index: number) => {
      const speakerNumber = (index % 3) + 1;
      return {
        id: segment.id || index,
        seek: segment.seek || 0,
        end: segment.end || 0,
        text: segment.text || "",
        speaker: `Speaker ${speakerNumber}`,
        startTime: segment.seek || 0
      };
    });
  }
  
  return [];
}

// 模拟转录结果 - 用于演示目的
const mockTranscriptData: TranscriptSegment[] = [
  {
    speaker: "Speaker 1",
    text: "Welcome everyone to our quarterly review meeting. Today we'll be discussing the progress made in the last quarter and our goals for the upcoming one.",
    startTime: 0,
    id: 0,
    seek: 0,
    end: 10
  },
  {
    speaker: "Speaker 1",
    text: "Before we dive into the details, I'd like to thank everyone for their hard work and dedication during these challenging times.",
    startTime: 11.5,
    id: 1,
    seek: 11.5,
    end: 20
  },
  {
    speaker: "Speaker 2",
    text: "Thanks for the introduction. I'd like to start by presenting our financial results from Q2. Overall, we've seen a 15% increase in revenue compared to the previous quarter.",
    startTime: 22.3,
    id: 2,
    seek: 22.3,
    end: 30
  },
  {
    speaker: "Speaker 2",
    text: "This growth is primarily attributed to the successful launch of our new product line and expanded market reach in the APAC region.",
    startTime: 34.7,
    id: 3,
    seek: 34.7,
    end: 40
  },
  {
    speaker: "Speaker 3",
    text: "That's impressive. How are we doing compared to our annual targets?",
    startTime: 46.2,
    id: 4,
    seek: 46.2,
    end: 50
  }
];

/**
 * 将文件转换为base64
 */
async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        // 移除 data:audio/mp3;base64, 前缀
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      } else {
        reject(new Error('Failed to convert file to base64'));
      }
    };
    reader.onerror = error => reject(error);
  });
}

/**
 * 转录单个音频片段（带重试机制）
 */
async function transcribeSegment(audioBlob: Blob, language: string, segmentIndex: number, maxRetries: number = 2): Promise<TranscriptSegment[]> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      console.log(`开始转录片段 ${segmentIndex + 1}${attempt > 0 ? ` (重试 ${attempt})` : ''}`);
      
      const formData = new FormData();
      formData.append('file', audioBlob, `segment_${segmentIndex}.wav`);
      formData.append('language', language);

      const res = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      console.log(`📡 片段${segmentIndex + 1} API响应状态:`, res.status, res.statusText);

      if (!res.ok) {
        let errorMessage = `HTTP ${res.status}: ${res.statusText}`;
        
        // 安全地尝试解析错误响应
        try {
          const contentType = res.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const errorData = await res.json();
            errorMessage = errorData.error || errorMessage;
          } else {
            const textError = await res.text();
            console.log('📡 非JSON错误响应:', textError);
            errorMessage = textError || errorMessage;
          }
        } catch (parseError) {
          console.warn('无法解析错误响应:', parseError);
        }
        
        throw new Error(errorMessage);
      }

      let data;
      try {
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          data = await res.json();
        } else {
          const responseText = await res.text();
          console.error('📡 API返回非JSON响应:', responseText);
          throw new Error('API返回的不是JSON格式，可能是服务器错误');
        }
      } catch (parseError) {
        console.error('解析API响应失败:', parseError);
        throw new Error('API响应格式错误，无法解析JSON');
      }

      console.log(`✅ 片段 ${segmentIndex + 1} 转录成功`);
      
      return data.transcript;

    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.error(`❌ 片段 ${segmentIndex + 1} 转录失败 (尝试 ${attempt + 1}/${maxRetries + 1}):`, lastError.message);
      
      // 如果不是最后一次尝试，等待后重试
      if (attempt < maxRetries) {
        const delay = Math.min(1000 * Math.pow(2, attempt), 5000); // 指数退避，最大5秒
        console.log(`⏱️ 等待 ${delay}ms 后重试...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  // 所有重试都失败了
  throw new Error(`片段 ${segmentIndex + 1} 转录失败 (已重试 ${maxRetries} 次): ${lastError?.message}`);
}

/**
 * 合并多个音频片段的转录结果
 */
function mergeTranscriptSegments(segmentResults: TranscriptSegment[][], segmentDuration: number = 300): TranscriptSegment[] {
  const mergedSegments: TranscriptSegment[] = [];
  let globalId = 0;

  segmentResults.forEach((segments, segmentIndex) => {
    const timeOffset = segmentIndex * segmentDuration;
    
    segments.forEach((segment) => {
      mergedSegments.push({
        ...segment,
        id: globalId++,
        startTime: segment.startTime + timeOffset,
        seek: segment.seek ? segment.seek + timeOffset : timeOffset,
        end: segment.end ? segment.end + timeOffset : timeOffset + 10
      });
    });
  });

  return mergedSegments;
}

/**
 * 获取未登录用户的使用次数 - 免费模式，不再限制
 */
function getGuestUsageCount(): number {
  // 免费模式：返回0，不再跟踪使用次数
  return 0;
}

/**
 * 增加未登录用户的使用次数 - 免费模式，不再限制
 */
function incrementGuestUsageCount(): number {
  // 免费模式：不再增加使用次数
  return 0;
}

/**
 * 前端通过 API 路由调用服务端转录
 */
export async function transcribeAudio(file: File, language: string, outputLang?: string): Promise<TranscriptionResult> {
  try {
    console.log('📝 执行直接转录（免费模式）...');
    console.log('🔤 输入语言:', language);
    console.log('🌐 输出语言:', outputLang);
    
    // 免费模式：不再检查使用次数
    console.log('🎉 免费模式：跳过使用次数检查');
    
    // 直接转录，不分割
    let lastError: Error | null = null;
    const maxRetries = 2;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        console.log(`开始转录${attempt > 0 ? ` (重试 ${attempt})` : ''}`);
        
        const formData = new FormData();
        formData.append('file', file);
        formData.append('language', language);
        // 添加输出语言参数
        if (outputLang) {
          formData.append('outputLang', outputLang);
          console.log('📤 发送输出语言参数:', outputLang);
        }
        // 免费模式：不再发送使用次数
        formData.append('guestUsageCount', '0');

        const res = await fetch('/api/transcribe', {
          method: 'POST',
          body: formData,
        });

        console.log('📡 API响应状态:', res.status, res.statusText);
        console.log('📡 响应Content-Type:', res.headers.get('content-type'));

        if (!res.ok) {
          let errorMessage = `HTTP ${res.status}: ${res.statusText}`;
          let errorData: any = {};
          
          // 安全地尝试解析错误响应
          try {
            const contentType = res.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
              errorData = await res.json();
              errorMessage = errorData.error || errorMessage;
            } else {
              const textError = await res.text();
              console.log('📡 非JSON错误响应:', textError);
              errorMessage = textError || errorMessage;
            }
          } catch (parseError) {
            console.warn('无法解析错误响应:', parseError);
          }
          
          throw new Error(errorMessage);
        }

        let data;
        try {
          const contentType = res.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            data = await res.json();
          } else {
            const responseText = await res.text();
            console.error('📡 API返回非JSON响应:', responseText);
            throw new Error('API返回的不是JSON格式，可能是服务器错误');
          }
        } catch (parseError) {
          console.error('解析API响应失败:', parseError);
          throw new Error('API响应格式错误，无法解析JSON');
        }

        console.log('✅ 转录成功，segments数量:', data.transcript?.length || 0);
        console.log('🌐 检测到的语言:', data.detectedLanguage);
        
        // 免费模式：不再更新使用次数
        console.log('🎉 免费模式：无需更新使用次数');
        
        return {
          transcript: data.transcript || [],
          detectedLanguage: data.detectedLanguage,
          wasSplit: false
        };

      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        console.error(`❌ 转录失败 (尝试 ${attempt + 1}/${maxRetries + 1}):`, lastError.message);
        
        // 如果不是最后一次尝试，等待后重试
        if (attempt < maxRetries) {
          const delay = Math.min(1000 * Math.pow(2, attempt), 5000);
          console.log(`⏱️ 等待 ${delay}ms 后重试...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    // 所有重试都失败了
    throw new Error(`转录失败 (已重试 ${maxRetries} 次): ${lastError?.message}`);

  } catch (error) {
    console.error('💥 转录过程中出错:', error);
    
    // 提供更友好的错误信息
    if (error instanceof Error) {
      if (error.message.includes('Prediction interrupted')) {
        throw new Error('转录服务暂时不可用，请稍后重试');
      } else if (error.message.includes('无法读取音频元数据')) {
        throw new Error('音频文件格式不支持或文件损坏');
      } else if (error.message.includes('JSON')) {
        throw new Error('服务器响应格式错误，请稍后重试或联系技术支持');
      } else {
        throw error;
      }
    }
    
    throw new Error('转录过程中发生未知错误');
  }
}

/**
 * 获取未登录用户剩余使用次数 - 免费模式，返回无限
 */
export function getGuestRemainingUsage(): { used: number; remaining: number; total: number } {
  // 免费模式：返回无限使用
  return { used: 0, remaining: 999999, total: 999999 };
} 