"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AudioUploader } from "@/components/transcription/audio-uploader"
import { LanguageSelector } from "@/components/transcription/language-selector"
import { TranscriptDisplay } from "@/components/transcription/transcript-display"
import { CTASection } from "@/components/landing/cta-section"
import { PricingSection } from "@/components/landing/pricing-section"
import { FAQSection } from "@/components/landing/faq-section"
import { HowItWorksSection } from "@/components/landing/how-it-works-section"
import { BenefitsSection } from "@/components/landing/benefits-section"
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
  Sparkles,
  Info
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useLanguage } from "@/lib/language-context"
import { transcribeAudio, TranscriptSegment, getGuestRemainingUsage } from "@/lib/transcription-service"
import { LANGUAGES, OUTPUT_LANGUAGES } from "@/lib/language-options"
import { HeroSection } from '@/components/landing/hero-section';
import { ScenarioDemo } from '@/components/landing/scenario-demo';
import { RealUseCases } from '@/components/landing/real-use-cases';
import { TrustTestimonials } from '@/components/landing/trust-testimonials';
import { ConversionPricing } from '@/components/landing/conversion-pricing';
import { ConversionFAQ } from '@/components/landing/conversion-faq';
import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { Label } from "@/components/ui/label"

// 类型定义
interface Segment {
  speaker: string
  text: string
  startTime: number
  id?: number
  seek?: number
  end?: number
}

export default function HomePage() {
  const { data: session, status } = useSession()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [transcript, setTranscript] = useState<Segment[]>([])
  const [inputLang, setInputLang] = useState("auto")
  const [outputLang, setOutputLang] = useState("zh")
  const [detectedLanguage, setDetectedLanguage] = useState<string>("auto")
  const [error, setError] = useState<string | null>(null)
  const [processingStage, setProcessingStage] = useState<string>("")
  const [guestUsage, setGuestUsage] = useState({ used: 0, remaining: 999999, total: 999999 })

  // 语言状态更新函数
  const handleInputLangChange = (newLang: string) => {
    console.log('🌐 主页: 输入语言变更:', inputLang, '->', newLang)
    setInputLang(newLang)
  }

  const handleOutputLangChange = (newLang: string) => {
    console.log('🌐 主页: 输出语言变更:', outputLang, '->', newLang)
    setOutputLang(newLang)
  }

  // 免费模式：不再需要更新使用次数显示
  useEffect(() => {
    console.log('🎉 免费模式：无需跟踪使用次数');
  }, [session, status])

  const handleFileSelected = async (file: File) => {
    setSelectedFile(file)
    setIsProcessing(true)
    setError(null)
    setTranscript([])
    setProcessingStage("上传文件中...")

    try {
      setProcessingStage("AI 分析中...")
      // 始终使用自动检测进行转录，翻译使用用户选择的输出语言
      const result = await transcribeAudio(file, "auto", outputLang)
      setTranscript(result.transcript)
      setDetectedLanguage(result.detectedLanguage || "auto")
      setProcessingStage("转录完成！")
    } catch (error: any) {
      console.error("转录失败:", error)
      setError(error.message || "转录处理失败")
    } finally {
      setIsProcessing(false)
      setProcessingStage("")
    }
  }

  const resetTranscription = () => {
    setSelectedFile(null)
    setTranscript([])
    setError(null)
    setIsProcessing(false)
    setProcessingStage("")
  }

  return (
    <div className="min-h-screen">
      {/* 震撼首屏 - 一屏打爆 */}
      <HeroSection />
      
      {/* 动态场景演示 */}
      <ScenarioDemo />
      
      {/* 真实使用场景 */}
      <RealUseCases />
      
      {/* 用户故事见证 */}
      <TrustTestimonials />
      
      {/* 转化型定价 */}
      <ConversionPricing />
      
      {/* 转化型FAQ */}
      <ConversionFAQ />
      
      {/* 实际工作区域 - 真正的音频转录功能 */}
      <section id="workspace" className="py-32 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-8">
              <span className="text-slate-900 dark:text-white">立即开始</span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                专业转录
              </span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-8">
              上传音频文件，体验AI转录的强大能力
            </p>
            
            {/* 使用次数显示 */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="max-w-md mx-auto"
            >
              {!session ? (
                <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200/50 dark:border-green-800/50">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="text-base font-medium text-slate-700 dark:text-slate-300">
                          完全免费
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-green-600">
                          无限使用
                        </div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">
                          免费开放
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-green-200/50 dark:border-green-800/50">
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                        🎉 现在完全免费！注册登录可保存转录历史
                      </p>
                      <div className="flex gap-3">
                        <Button size="sm" variant="outline" asChild className="flex-1">
                          <Link href="/auth/signin">登录</Link>
                        </Button>
                        <Button size="sm" asChild className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600">
                          <Link href="/auth/signup">注册</Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200/50 dark:border-green-800/50">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="text-base font-medium text-slate-700 dark:text-slate-300">
                          已登录用户
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-green-600">
                          无限使用
                        </div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">
                          完全免费
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </motion.div>

          <div className="max-w-7xl mx-auto">
            {/* 文件上传区域 - 全宽度 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border-0 shadow-xl">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                    <Upload className="h-6 w-6" />
                    上传音频
                  </h3>
                  <AudioUploader
                    onFileSelected={handleFileSelected}
                    isProcessing={isProcessing}
                  />
                </CardContent>
              </Card>
            </motion.div>

            {/* 语言设置区域 - 全宽度 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border-0 shadow-xl">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                    <Settings className="h-6 w-6" />
                    转录设置
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">输入语言</Label>
                      <div className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                        <span>自动检测</span>
                        <span className="text-xs text-muted-foreground">AI智能识别</span>
                      </div>
                    </div>
                    <LanguageSelector
                      value={outputLang}
                      onChange={handleOutputLangChange}
                      disabled={isProcessing}
                      label="输出语言"
                      options={[
                        { value: "zh", label: "中文简体", labelEn: "Chinese Simplified" },
                        { value: "zh-tw", label: "中文繁体", labelEn: "Chinese Traditional" },
                        { value: "en", label: "英文", labelEn: "English" },
                        { value: "ja", label: "日文", labelEn: "Japanese" },
                        { value: "ko", label: "韩文", labelEn: "Korean" }
                      ]}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* 转录结果区域 - 全宽度 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border-0 shadow-xl">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                    <Brain className="h-6 w-6" />
                    转录结果
                  </h3>
                  
                  {isProcessing && (
                    <div className="text-center py-12">
                      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                      <p className="text-lg text-slate-600 dark:text-slate-300">{processingStage}</p>
                    </div>
                  )}

                  {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 mb-6">
                      <div className="flex items-center gap-3 text-red-800 dark:text-red-200">
                        <AlertCircle className="h-6 w-6" />
                        <span className="text-lg">转录失败：{error}</span>
                      </div>
                    </div>
                  )}

                  {transcript.length > 0 && (
                    <TranscriptDisplay 
                      transcript={transcript}
                      visible={true}
                      outputLang={outputLang}
                      transcriptLang={detectedLanguage}
                      isStreaming={isProcessing}
                      splitInfo={null}
                      isDemoMode={false}
                      demoInstructions={[]}
                    />
                  )}

                  {!isProcessing && !error && transcript.length === 0 && (
                    <div className="text-center py-16 text-slate-500 dark:text-slate-400">
                      <Mic className="h-16 w-16 mx-auto mb-6 opacity-50" />
                      <p className="text-xl">上传音频文件开始转录</p>
                    </div>
                  )}

                  {/* 重置按钮 */}
                  {transcript.length > 0 && !isProcessing && (
                    <div className="mt-8 text-center">
                      <Button 
                        variant="outline" 
                        onClick={resetTranscription}
                        className="gap-2 px-8 py-3 text-lg"
                      >
                        <Upload className="h-5 w-5" />
                        上传新文件
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* 最终转化CTA */}
      <CTASection />
    </div>
  );
}