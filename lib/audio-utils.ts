/**
 * 音频处理工具函数
 */

// 获取音频文件的时长
export function getAudioDuration(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    audio.onloadedmetadata = () => {
      resolve(audio.duration);
    };
    audio.onerror = reject;
    audio.src = URL.createObjectURL(file);
  });
}

// 将音频文件分割为较小的片段
export async function splitAudioFile(file: File, segmentDuration: number = 300): Promise<Blob[]> {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  
  try {
    // 将文件转换为ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    
    // 解码音频数据
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    
    const sampleRate = audioBuffer.sampleRate;
    const totalDuration = audioBuffer.duration;
    const segmentSamples = segmentDuration * sampleRate;
    
    const segments: Blob[] = [];
    
    for (let start = 0; start < audioBuffer.length; start += segmentSamples) {
      const end = Math.min(start + segmentSamples, audioBuffer.length);
      const segmentLength = end - start;
      
      // 创建新的音频缓冲区用于片段
      const segmentBuffer = audioContext.createBuffer(
        audioBuffer.numberOfChannels,
        segmentLength,
        sampleRate
      );
      
      // 复制音频数据到片段缓冲区
      for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
        const sourceData = audioBuffer.getChannelData(channel);
        const segmentData = segmentBuffer.getChannelData(channel);
        
        for (let i = 0; i < segmentLength; i++) {
          segmentData[i] = sourceData[start + i];
        }
      }
      
      // 将音频缓冲区转换为WAV格式的Blob
      const blob = await audioBufferToWav(segmentBuffer);
      segments.push(blob);
    }
    
    return segments;
  } finally {
    audioContext.close();
  }
}

// 将AudioBuffer转换为WAV格式的Blob
function audioBufferToWav(audioBuffer: AudioBuffer): Promise<Blob> {
  return new Promise((resolve) => {
    const numberOfChannels = audioBuffer.numberOfChannels;
    const sampleRate = audioBuffer.sampleRate;
    const format = 1; // PCM
    const bitDepth = 16;
    
    const bytesPerSample = bitDepth / 8;
    const blockAlign = numberOfChannels * bytesPerSample;
    const byteRate = sampleRate * blockAlign;
    const dataSize = audioBuffer.length * blockAlign;
    const bufferSize = 44 + dataSize;
    
    const arrayBuffer = new ArrayBuffer(bufferSize);
    const view = new DataView(arrayBuffer);
    
    // WAV文件头
    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };
    
    writeString(0, 'RIFF');
    view.setUint32(4, bufferSize - 8, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true); // fmt chunk size
    view.setUint16(20, format, true);
    view.setUint16(22, numberOfChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, byteRate, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bitDepth, true);
    writeString(36, 'data');
    view.setUint32(40, dataSize, true);
    
    // 写入音频数据
    let offset = 44;
    for (let i = 0; i < audioBuffer.length; i++) {
      for (let channel = 0; channel < numberOfChannels; channel++) {
        const sample = Math.max(-1, Math.min(1, audioBuffer.getChannelData(channel)[i]));
        const intSample = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
        view.setInt16(offset, intSample, true);
        offset += 2;
      }
    }
    
    resolve(new Blob([arrayBuffer], { type: 'audio/wav' }));
  });
}

// 格式化时间显示
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

// 检查是否需要分割音频
export function shouldSplitAudio(duration: number, maxDuration: number = 360): boolean {
  return duration > maxDuration; // 默认6分钟以上需要分割
}

/**
 * 压缩音频文件到指定大小
 * @param file 原始音频文件
 * @param maxSizeMB 最大大小（MB）
 * @param quality 压缩质量 (0.1-1.0)
 * @returns 压缩后的文件
 */
export async function compressAudioFile(file: File, maxSizeMB: number = 5, quality: number = 0.7): Promise<File> {
  const maxSize = maxSizeMB * 1024 * 1024;
  
  if (file.size <= maxSize) {
    return file;
  }

  return new Promise((resolve, reject) => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const fileReader = new FileReader();
    
    fileReader.onload = async (e) => {
      try {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        
        // 计算压缩比率
        const compressionRatio = Math.sqrt(maxSize / file.size);
        const newSampleRate = Math.floor(audioBuffer.sampleRate * compressionRatio);
        
        // 创建新的音频缓冲区
        const offlineContext = new OfflineAudioContext(
          audioBuffer.numberOfChannels,
          Math.floor(audioBuffer.length * compressionRatio),
          newSampleRate
        );
        
        const source = offlineContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(offlineContext.destination);
        source.start();
        
        const compressedBuffer = await offlineContext.startRendering();
        
        // 转换为 WAV 格式
        const wav = await audioBufferToWav(compressedBuffer);
        const compressedFile = new File([wav], `compressed_${file.name}`, { type: 'audio/wav' });
        
        resolve(compressedFile);
      } catch (error) {
        reject(error);
      }
    };
    
    fileReader.onerror = reject;
    fileReader.readAsArrayBuffer(file);
  });
} 