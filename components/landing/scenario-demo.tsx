"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Upload, 
  Mic, 
  FileAudio, 
  Settings, 
  Zap, 
  CheckCircle,
  ArrowRight,
  Globe,
  Volume2,
  BarChart3
} from "lucide-react"
import { AudioUploader } from "@/components/transcription/audio-uploader"

export function ScenarioDemo() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [detectedLanguage, setDetectedLanguage] = useState("")
  const [showLanguagePrompt, setShowLanguagePrompt] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const steps = [
    {
      id: 0,
      title: "选择音频文件",
      description: "拖拽或点击上传",
      icon: Upload,
      color: "from-blue-500 to-cyan-500"
    },
    {
      id: 1,
      title: "智能音波分析",
      description: "AI正在分析音频特征",
      icon: BarChart3,
      color: "from-purple-500 to-pink-500"
    },
    {
      id: 2,
      title: "语言自动识别",
      description: "检测音频语言类型",
      icon: Globe,
      color: "from-green-500 to-emerald-500"
    },
    {
      id: 3,
      title: "转录设置确认",
      description: "优化转录参数",
      icon: Settings,
      color: "from-orange-500 to-red-500"
    },
    {
      id: 4,
      title: "AI转录完成",
      description: "3秒生成完整文稿",
      icon: CheckCircle,
      color: "from-green-500 to-emerald-500"
    }
  ]

  const handleFileUpload = async (file: File) => {
    setIsUploading(true)
    setCurrentStep(1)
    
    // 模拟上传和处理过程
    for (let i = 0; i <= 100; i += 10) {
      setUploadProgress(i)
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    
    // 模拟语言检测
    setTimeout(() => {
      setCurrentStep(2)
      setDetectedLanguage("中文")
      setShowLanguagePrompt(true)
    }, 500)
  }

  const handleLanguageConfirm = () => {
    setShowLanguagePrompt(false)
    setCurrentStep(3)
    
    // 自动跳转到设置
    setTimeout(() => {
      setCurrentStep(4)
      setIsUploading(false)
    }, 1500)
  }

  const resetDemo = () => {
    setCurrentStep(0)
    setIsUploading(false)
    setUploadProgress(0)
    setDetectedLanguage("")
    setShowLanguagePrompt(false)
  }

  return (
    <section id="upload" className="py-20 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              上传即转录
            </span>
            <br />
            <span className="text-slate-900 dark:text-white">
              智能识别，自动优化
            </span>
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            拖拽音频文件，AI自动识别语言并跳转设置，无需手动操作
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* 左侧：交互演示 */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <Card className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-800 dark:to-slate-700 border-0 shadow-2xl overflow-hidden">
              <CardContent className="p-8">
                {/* 步骤指示器 */}
                <div className="flex justify-between mb-8">
                  {steps.map((step, index) => (
                    <div
                      key={step.id}
                      className={`flex flex-col items-center ${
                        index <= currentStep ? 'opacity-100' : 'opacity-30'
                      } transition-all duration-500`}
                    >
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                        index === currentStep 
                          ? `bg-gradient-to-r ${step.color} text-white shadow-lg scale-110` 
                          : index < currentStep
                          ? 'bg-green-500 text-white'
                          : 'bg-slate-200 dark:bg-slate-600 text-slate-400'
                      } transition-all duration-500`}>
                        <step.icon className="h-5 w-5" />
                      </div>
                      <span className="text-xs text-center font-medium text-slate-600 dark:text-slate-400">
                        {step.title}
                      </span>
                    </div>
                  ))}
                </div>

                {/* 主要交互区域 */}
                <div className="relative min-h-[300px] flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    {currentStep === 0 && (
                      <motion.div
                        key="upload"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="w-full"
                      >
                        <div className="border-2 border-dashed border-blue-300 dark:border-blue-600 rounded-xl p-8 text-center bg-blue-50/50 dark:bg-blue-900/20 hover:bg-blue-100/50 dark:hover:bg-blue-900/30 transition-all duration-300 cursor-pointer group">
                          <Upload className="h-16 w-16 mx-auto text-blue-500 mb-4 group-hover:scale-110 transition-transform" />
                          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                            拖拽音频文件到这里
                          </h3>
                          <p className="text-slate-600 dark:text-slate-400 mb-4">
                            支持 MP3, WAV, M4A 等格式，最大 50MB
                          </p>
                          <Button 
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                            onClick={() => {
                              // 模拟文件选择
                              const mockFile = new File([''], 'demo.mp3', { type: 'audio/mp3' })
                              handleFileUpload(mockFile)
                            }}
                          >
                            <FileAudio className="h-4 w-4 mr-2" />
                            选择文件演示
                          </Button>
                        </div>
                      </motion.div>
                    )}

                    {currentStep === 1 && (
                      <motion.div
                        key="analyzing"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="w-full text-center"
                      >
                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                          <BarChart3 className="h-10 w-10 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                          智能音波分析中...
                        </h3>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 mb-4">
                          <motion.div
                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                        <p className="text-slate-600 dark:text-slate-400">
                          AI正在分析音频特征和质量...
                        </p>
                      </motion.div>
                    )}

                    {currentStep === 2 && (
                      <motion.div
                        key="language"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="w-full text-center"
                      >
                        <div className="bg-gradient-to-r from-green-500 to-emerald-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                          <Globe className="h-10 w-10 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                          语言识别完成！
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 mb-6">
                          检测到音频语言：<span className="font-semibold text-green-600">{detectedLanguage}</span>
                        </p>
                        
                        {showLanguagePrompt && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6"
                          >
                            <p className="text-green-800 dark:text-green-200 mb-4">
                              🎯 识别为 {detectedLanguage} 语言，是否切换到最佳设置？
                            </p>
                            <Button 
                              onClick={handleLanguageConfirm}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              确认并继续
                            </Button>
                          </motion.div>
                        )}
                      </motion.div>
                    )}

                    {currentStep === 3 && (
                      <motion.div
                        key="settings"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="w-full text-center"
                      >
                        <div className="bg-gradient-to-r from-orange-500 to-red-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 animate-spin">
                          <Settings className="h-10 w-10 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                          自动优化转录设置...
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400">
                          根据音频特征调整最佳参数
                        </p>
                      </motion.div>
                    )}

                    {currentStep === 4 && (
                      <motion.div
                        key="complete"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="w-full text-center"
                      >
                        <div className="bg-gradient-to-r from-green-500 to-emerald-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                          <CheckCircle className="h-10 w-10 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                          转录完成！
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 mb-6">
                          🚀 仅用时 3.2 秒，生成完整文稿
                        </p>
                        <Button 
                          onClick={resetDemo}
                          variant="outline"
                          className="mr-4"
                        >
                          重新演示
                        </Button>
                        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                          查看结果
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* 右侧：特性说明 */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
                智能化上传体验
              </h3>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
                不只是文件上传，而是智能的转录助手
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                    自动跳转设置
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400">
                    上传完成后自动跳转到识别设置模块，无需用户手动寻找
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                    动态音波进度
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400">
                    不是枯燥的loading圈，而是生动的音波动画展示处理进度
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Globe className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                    智能语言提示
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400">
                    自动识别语言后弹窗询问："识别为X语言，是否切换？"
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-blue-200/50 dark:border-blue-800/50">
              <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                💡 为什么这样设计？
              </h4>
              <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                <li>• 减少用户认知负担，自动引导操作流程</li>
                <li>• 视觉反馈丰富，让等待变成期待</li>
                <li>• 智能化程度高，体现AI产品的专业性</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
} 