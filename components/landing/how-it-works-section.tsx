"use client"

import { motion } from "framer-motion"
import { Upload, Settings, Zap, Download, ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface Step {
  number: number
  title: string
  description: string
  icon: React.ComponentType<any>
  details: string[]
}

const steps: Step[] = [
  {
    number: 1,
    title: "上传音频文件",
    description: "支持多种格式，拖拽即可上传",
    icon: Upload,
    details: [
      "支持 MP3、WAV、M4A 等格式",
      "最大支持 2GB 文件大小",
      "拖拽或点击选择文件",
      "自动检测音频质量"
    ]
  },
  {
    number: 2,
    title: "选择语言设置",
    description: "智能检测或手动选择语言",
    icon: Settings,
    details: [
      "自动检测音频语言",
      "支持 50+ 种语言",
      "选择输出翻译语言",
      "调整转录精度设置"
    ]
  },
  {
    number: 3,
    title: "AI 智能处理",
    description: "先进算法进行语音识别",
    icon: Zap,
    details: [
      "高精度语音识别",
      "智能说话人分离",
      "噪音过滤处理",
      "实时进度显示"
    ]
  },
  {
    number: 4,
    title: "获取转录结果",
    description: "多格式导出，便于使用",
    icon: Download,
    details: [
      "文本格式导出",
      "时间戳标记",
      "说话人标识",
      "支持多种导出格式"
    ]
  }
]

export function HowItWorksSection() {
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      <div className="container mx-auto max-w-7xl">
        {/* 标题区域 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 px-4 py-2 rounded-full mb-6">
            <Zap className="h-4 w-4 text-blue-600" />
            <span className="text-blue-700 dark:text-blue-300 text-sm font-medium">简单易用</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-900 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent">
            如何使用 VoiceScribe
          </h2>
          
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            只需四个简单步骤，即可获得高质量的语音转文字结果
          </p>
        </motion.div>

        {/* 步骤展示 */}
        <div className="grid lg:grid-cols-4 gap-8 mb-16">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <Card className="h-full border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg hover:shadow-2xl transition-all duration-300 group">
                <CardContent className="p-8 text-center">
                  {/* 步骤编号 */}
                  <div className="relative mb-6">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <step.icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {step.number}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                    {step.title}
                  </h3>
                  
                  <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                    {step.description}
                  </p>
                  
                  {/* 详细功能列表 */}
                  <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
                    {step.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0"></div>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              
              {/* 连接箭头 */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <ArrowRight className="h-8 w-8 text-blue-400" />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* 使用场景 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">
            适用场景
          </h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "会议记录",
                description: "自动转录会议内容，识别不同发言人",
                emoji: "🏢"
              },
              {
                title: "采访整理",
                description: "快速将采访录音转为文字稿",
                emoji: "🎤"
              },
              {
                title: "学习笔记",
                description: "将课程录音转为可搜索的文字笔记",
                emoji: "📚"
              },
              {
                title: "内容创作",
                description: "将语音想法快速转为文字内容",
                emoji: "✍️"
              },
              {
                title: "客服记录",
                description: "自动记录客服通话内容",
                emoji: "📞"
              },
              {
                title: "多语言翻译",
                description: "跨语言沟通的实时转录翻译",
                emoji: "🌍"
              }
            ].map((scenario, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:shadow-lg transition-all duration-300"
              >
                <div className="text-3xl mb-3">{scenario.emoji}</div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                  {scenario.title}
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {scenario.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
} 