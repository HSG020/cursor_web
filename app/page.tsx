"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AudioUploader } from "@/components/transcription/audio-uploader"
import { LanguageSelector } from "@/components/transcription/language-selector"
import { TranscriptDisplay } from "@/components/transcription/transcript-display"
import { 
  Braces, 
  Upload,
  Settings,
  Brain,
  Mic,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  Users,
  Zap,
  Crown,
  Globe,
  Shield,
  Sparkles
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useLanguage } from "@/lib/language-context"
import { transcribeAudio, TranscriptSegment } from "@/lib/transcription-service"
import { LANGUAGES, OUTPUT_LANGUAGES } from "@/lib/language-options"

// 类型定义
interface Segment {
  speaker: string
  text: string
  startTime: number
  id?: number
  seek?: number
  end?: number
}

export default function Home() {
  const [audioLang, setAudioLang] = useState('auto')
  const [outputLang, setOutputLang] = useState('en')
  const { language } = useLanguage()
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [stage, setStage] = useState<"idle" | "uploading" | "processing" | "analyzing" | "transcribing" | "complete">("idle")
  const [transcript, setTranscript] = useState<Segment[]>([])
  const [error, setError] = useState<string | null>(null)
  const [transcriptLang, setTranscriptLang] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [splitInfo, setSplitInfo] = useState<{wasSplit: boolean, totalSegments?: number} | null>(null)
  
  // 添加selectedFile状态来跟踪当前选择的文件
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  
  // 添加演示模式状态
  const [isDemoMode, setIsDemoMode] = useState(false)
  const [demoInstructions, setDemoInstructions] = useState<string[]>([])

  // Web Speech API 支持检测
  const [webSpeechSupported, setWebSpeechSupported] = useState(false)
  const [isListening, setIsListening] = useState(false)

  useEffect(() => {
    // 检查浏览器是否支持Web Speech API
    const isSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window
    setWebSpeechSupported(isSupported)
  }, [])

  // Web Speech API 录音功能
  const startListening = async () => {
    if (!webSpeechSupported) {
      setError('您的浏览器不支持语音识别功能')
      return
    }

    try {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition
      const recognition = new SpeechRecognition()
      
      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = language === 'auto' ? 'zh-CN' : language

      setIsListening(true)
      setTranscript([])
      setError('')

      let finalTranscript = ''
      let interimTranscript = ''

      recognition.onresult = (event) => {
        finalTranscript = ''
        interimTranscript = ''

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += transcript
          } else {
            interimTranscript += transcript
          }
        }

        // 更新结果
        const segments: Segment[] = []
        if (finalTranscript) {
          segments.push({
            speaker: 'Speaker 1',
            text: finalTranscript,
            startTime: 0,
            id: 0,
            seek: 0,
            end: 0
          })
        }
        if (interimTranscript) {
          segments.push({
            speaker: 'Speaker 1',
            text: `[正在识别] ${interimTranscript}`,
            startTime: 0,
            id: 1,
            seek: 0,
            end: 0
          })
        }
        setTranscript(segments)
      }

      recognition.onerror = (event) => {
        console.error('语音识别错误:', event.error)
        setError(`语音识别错误: ${event.error}`)
        setIsListening(false)
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognition.start()
    } catch (error) {
      console.error('启动语音识别失败:', error)
      setError('启动语音识别失败')
      setIsListening(false)
    }
  }

  const stopListening = () => {
    setIsListening(false)
    // 语音识别会自动停止
  }

  // 修复：文件选择处理函数
  const handleFileSelected = (file: File) => {
    console.log('✅ 文件已选择:', file.name, file.size)
    setSelectedFile(file)
    setError(null)
    // 立即开始转录
    handleTranscribe(file)
  }

  // 修复：转录处理函数
  const handleTranscribe = async (file?: File) => {
    const audioFile = file || selectedFile
    
    if (!audioFile) {
      setError('请选择音频文件')
      return
    }

    console.log('🎵 开始转录文件:', audioFile.name)
    setProcessing(true)
    setError(null)
    setTranscript([])
    setIsStreaming(false)
    setSplitInfo(null)
    setTranscriptLang('')
    setStage("uploading")
    setProgress(0)

    try {
      // 模拟进度更新
      setStage("uploading")
      await simulateProgress(0, 20, 1000)
      
      setStage("processing")
      await simulateProgress(20, 40, 1000)
      
      setStage("analyzing")
      await simulateProgress(40, 60, 1000)
      
      setStage("transcribing")
      await simulateProgress(60, 90, 1000)

      // 创建FormData并发送到API
      const formData = new FormData()
      formData.append('file', audioFile)
      formData.append('language', audioLang)

      // 添加调试日志
      console.log('📤 准备发送请求:')
      console.log('  - 文件名:', audioFile.name)
      console.log('  - 文件大小:', audioFile.size)
      console.log('  - 文件类型:', audioFile.type)
      console.log('  - 语言设置:', audioLang)
      console.log('  - FormData entries:')
      for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`    ${key}: File(${value.name}, ${value.size} bytes, ${value.type})`)
        } else {
          console.log(`    ${key}: ${value}`)
        }
      }

      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
        // 不要手动设置Content-Type，让浏览器自动设置multipart/form-data边界
      })

      console.log('📡 API响应状态:', response.status, response.statusText)
      console.log('📡 响应Content-Type:', response.headers.get('content-type'))

      let result;
      try {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          result = await response.json();
        } else {
          const responseText = await response.text();
          console.error('📡 API返回非JSON响应:', responseText);
          throw new Error('服务器返回的不是JSON格式，可能是内部错误');
        }
      } catch (parseError) {
        console.error('解析API响应失败:', parseError);
        throw new Error('API响应格式错误，无法解析');
      }

      if (!response.ok) {
        throw new Error(result.error || '转录失败')
      }

      setTranscript(result.transcript || [])
      setTranscriptLang(result.detectedLanguage || audioLang)
      setIsDemoMode(result.isDemoMode || false)
      setDemoInstructions(result.instructions || [])
      setProgress(100)
      setStage("complete")
      setIsStreaming(false)
      
      console.log('✅ 转录完成:', result.transcript?.length || 0, '个片段')
    } catch (error) {
      console.error("❌ 转录错误:", error)
      
      // 改进错误处理
      let errorMessage = "转录过程中发生未知错误";
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        errorMessage = "网络连接失败，请检查网络连接并重试";
      } else if (error instanceof Error) {
        if (error.message.includes('Failed to fetch')) {
          errorMessage = "服务器连接失败，可能是网络问题或服务器繁忙，请稍后重试";
        } else if (error.message.includes('timeout') || error.message.includes('超时')) {
          errorMessage = "转录处理超时，请尝试使用更短的音频文件";
        } else {
          errorMessage = error.message;
        }
      }
      
      setError(errorMessage)
      setStage("idle")
      setProgress(0)
    } finally {
      setProcessing(false)
    }
  }

  const simulateProgress = async (start: number, end: number, duration: number) => {
    const steps = 20
    const increment = (end - start) / steps
    const stepDuration = duration / steps

    for (let i = 0; i <= steps; i++) {
      setProgress(start + increment * i)
      await new Promise(resolve => setTimeout(resolve, stepDuration))
    }
  }

  const getStageText = () => {
    switch (stage) {
      case "uploading": return "上传音频文件中..."
      case "processing": return "预处理音频文件..."
      case "analyzing": return "分析音频特征..."
      case "transcribing": return "AI转录进行中..."
      case "complete": return "转录完成！"
      default: return ""
    }
  }

  const getStageIcon = () => {
    switch (stage) {
      case "uploading": return <Upload className="h-5 w-5 animate-pulse" />
      case "processing": return <Settings className="h-5 w-5 animate-spin" />
      case "analyzing": return <Brain className="h-5 w-5 animate-pulse" />
      case "transcribing": return <Mic className="h-5 w-5 animate-pulse" />
      case "complete": return <CheckCircle className="h-5 w-5 text-green-500" />
      default: return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      <div className="container mx-auto px-2 sm:px-4 pb-8 max-w-[1600px]">
        {/* Hero Section */}
        <section className="mb-12 text-center pt-8 pb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <div className="inline-flex p-4 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-2xl mb-8 backdrop-blur-sm border border-white/20">
              <svg width="48" height="48" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-12 w-12">
                <defs>
                  <linearGradient id="heroGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{stopColor:'#3B82F6', stopOpacity:1}} />
                    <stop offset="100%" style={{stopColor:'#6366F1', stopOpacity:1}} />
                  </linearGradient>
                </defs>
                <circle cx="16" cy="16" r="15" fill="url(#heroGradient)" stroke="#E5E7EB" strokeWidth="1"/>
                <path d="M16 6c-2.2 0-4 1.8-4 4v6c0 2.2 1.8 4 4 4s4-1.8 4-4v-6c0-2.2-1.8-4-4-4z" fill="white"/>
                <path d="M24 14v2c0 4.4-3.6 8-8 8s-8-3.6-8-8v-2h2v2c0 3.3 2.7 6 6 6s6-2.7 6-6v-2h2z" fill="white"/>
                <rect x="15" y="24" width="2" height="4" fill="white"/>
                <rect x="11" y="26" width="10" height="2" fill="white"/>
              </svg>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-900 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent">
              VoiceScribe
            </h1>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed font-medium">
              专业级AI语音转文字平台 · 支持多语言实时翻译 · 智能说话人识别
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-3">
              Professional AI Speech-to-Text Platform with Real-time Translation
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-wrap gap-6 justify-center max-w-2xl mx-auto"
          >
            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
              <Braces className="h-5 w-5 text-blue-600" />
              <span className="font-medium">支持50+语言</span>
            </div>
            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
              <Users className="h-5 w-5 text-indigo-600" />
              <span className="font-medium">智能说话人识别</span>
            </div>
            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
              <Zap className="h-5 w-5 text-violet-600" />
              <span className="font-medium">实时AI翻译</span>
            </div>
          </motion.div>
        </section>

        {/* Main Content - 使用三栏等宽布局 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid lg:grid-cols-3 gap-6"
        >
          {/* 第一栏：上传区域 */}
          <div className="space-y-6 flex flex-col">
            <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg flex-1 min-h-[520px] flex flex-col">
              <CardContent className="p-6 flex-1 flex flex-col">
                <AudioUploader 
                  onFileSelected={handleFileSelected}
                  isProcessing={processing}
                />
                
                {/* Progress Section */}
                {processing && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-700 dark:to-slate-600 rounded-2xl border border-blue-200/50 dark:border-slate-500/50"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      {getStageIcon()}
                      <span className="text-lg font-semibold text-slate-700 dark:text-slate-200">
                        {getStageText()}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full shadow-lg"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
                      {Math.round(progress)}% 完成
                    </p>
                  </motion.div>
                )}

                {/* Error Display */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl"
                  >
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-red-500" />
                      <span className="text-red-700 dark:text-red-300 font-medium">
                        {error}
                      </span>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* 第二栏：设置区域 */}
          <div className="space-y-6 flex flex-col">
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg overflow-hidden flex-1 min-h-[260px] flex flex-col">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Settings className="h-6 w-6" />
                  转录设置
                </h3>
                <p className="text-blue-100 mt-1">Transcription Settings</p>
              </div>
              <CardContent className="p-6 space-y-6 flex-1 flex flex-col justify-between">
                <div className="space-y-6">
                  <LanguageSelector
                    value={audioLang}
                    onChange={setAudioLang}
                    label="音频语言 Audio Language"
                    langMode="zh"
                    options={LANGUAGES}
                  />
                  
                  <LanguageSelector
                    value={outputLang}
                    onChange={setOutputLang}
                    label="输出语言 Output Language"
                    langMode="zh"
                    options={OUTPUT_LANGUAGES}
                  />
                </div>
                
                {/* 额外信息区域，自动填充剩余空间 */}
                <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>自动检测语言可提高转录精度</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-sm mt-2">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                    <span>支持实时语言切换和翻译</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tips Section */}
            <Card className="border-0 shadow-xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 backdrop-blur-lg flex-1 min-h-[260px] flex flex-col">
              <CardContent className="p-6 flex-1 flex flex-col">
                <h3 className="font-bold text-amber-800 dark:text-amber-200 mb-4 flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  专业提示 Pro Tips
                </h3>
                <ul className="space-y-3 text-sm text-amber-700 dark:text-amber-300 flex-1">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 mt-0.5 text-green-600" />
                    使用高质量录音设备获得最佳转录效果
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 mt-0.5 text-green-600" />
                    确保音频清晰，减少背景噪音干扰
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 mt-0.5 text-green-600" />
                    正确选择音频语言可显著提高准确性
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 mt-0.5 text-green-600" />
                    支持多说话人自动识别和分离
                  </li>
                  <li className="flex items-start gap-2">
                    <Sparkles className="h-4 w-4 mt-0.5 text-violet-600" />
                    <span className="font-medium">长音频自动智能分割处理</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* 第三栏：功能展示 */}
          <div className="space-y-6 flex flex-col">
            <Card className="border-0 shadow-xl bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 backdrop-blur-lg flex-1 min-h-[520px] flex flex-col">
              <CardContent className="p-6 h-full flex flex-col">
                <h3 className="font-bold text-violet-800 dark:text-violet-200 mb-6 flex items-center gap-2">
                  <Crown className="h-5 w-5" />
                  高级功能 Premium Features
                </h3>
                <div className="grid grid-cols-2 gap-4 flex-1">
                  <div className="text-center p-4 bg-white/50 dark:bg-slate-700/50 rounded-lg flex flex-col items-center justify-center">
                    <Brain className="h-8 w-8 mx-auto text-blue-600 mb-2" />
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">AI智能分析</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">智能内容分析</p>
                  </div>
                  <div className="text-center p-4 bg-white/50 dark:bg-slate-700/50 rounded-lg flex flex-col items-center justify-center">
                    <Globe className="h-8 w-8 mx-auto text-green-600 mb-2" />
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">多语言支持</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">50+种语言</p>
                  </div>
                  <div className="text-center p-4 bg-white/50 dark:bg-slate-700/50 rounded-lg flex flex-col items-center justify-center">
                    <Zap className="h-8 w-8 mx-auto text-yellow-600 mb-2" />
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">实时处理</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">毫秒级响应</p>
                  </div>
                  <div className="text-center p-4 bg-white/50 dark:bg-slate-700/50 rounded-lg flex flex-col items-center justify-center">
                    <Shield className="h-8 w-8 mx-auto text-purple-600 mb-2" />
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">数据安全</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">端到端加密</p>
                  </div>
                </div>
                
                {/* 额外的功能介绍 */}
                <div className="mt-6 pt-4 border-t border-violet-200/50 dark:border-violet-700/50">
                  <div className="flex items-center gap-2 text-violet-700 dark:text-violet-300 mb-3">
                    <Sparkles className="h-4 w-4" />
                    <span className="text-sm font-medium">专业特性</span>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-violet-500 rounded-full"></div>
                      高精度说话人分离技术
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-violet-500 rounded-full"></div>
                      长音频智能分割处理
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-violet-500 rounded-full"></div>
                      专业级噪音过滤算法
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Transcript Display - 全宽度显示在下方 */}
        <div className="mt-8">
          <TranscriptDisplay 
            transcript={transcript}
            visible={transcript.length > 0}
            outputLang={outputLang}
            transcriptLang={transcriptLang}
            isStreaming={isStreaming}
            splitInfo={splitInfo}
            isDemoMode={isDemoMode}
            demoInstructions={demoInstructions}
          />
        </div>
      </div>
    </div>
  )
}