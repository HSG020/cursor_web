"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Mic, 
  Users, 
  Globe, 
  FileText, 
  Clock, 
  TrendingUp,
  Play,
  ArrowRight
} from "lucide-react"

const useCases = [
  {
    id: 1,
    title: "记者采访稿整理",
    description: "3小时采访，5分钟成稿",
    scenario: "新闻媒体 · 内容创作",
    features: ["自动分离问答", "情绪标签", "关键词提取"],
    result: "节省90%整理时间",
    color: "from-blue-500 to-cyan-500",
    icon: Mic,
    demo: "【记者】：请问您对这次政策有什么看法？\n【专家】：我认为这是一个积极的信号，将会带来...\n\n🏷️ 关键词：政策、积极、信号\n😊 情绪：积极、专业"
  },
  {
    id: 2,
    title: "外企双语会议记录",
    description: "中英文实时对照，无缝沟通",
    scenario: "跨国企业 · 国际会议",
    features: ["实时翻译", "多人识别", "会议纪要"],
    result: "提升80%沟通效率",
    color: "from-green-500 to-emerald-500",
    icon: Globe,
    demo: "【张总】：我们需要加快项目进度\n【Zhang】：We need to accelerate the project progress\n\n【John】：I agree, let's discuss the timeline\n【约翰】：我同意，让我们讨论一下时间表"
  },
  {
    id: 3,
    title: "客户服务录音分析",
    description: "情绪分析+问题摘要+改进建议",
    scenario: "客服中心 · 质量管控",
    features: ["情绪识别", "问题分类", "满意度评分"],
    result: "客户满意度提升25%",
    color: "from-purple-500 to-pink-500",
    icon: Users,
    demo: "【客户】：我的订单还没到，很着急 😟\n【客服】：非常抱歉，我立即为您查询 😊\n\n📊 情绪分析：客户焦虑→满意\n⭐ 服务评分：4.5/5\n💡 改进建议：主动通知物流状态"
  }
]

export function RealUseCases() {
  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-slate-900 dark:text-white">真实场景</span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              真实效果
            </span>
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            不是功能演示，而是真实工作场景中的实际应用效果
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {useCases.map((useCase, index) => (
            <motion.div
              key={useCase.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group overflow-hidden h-full">
                <CardContent className="p-0 h-full flex flex-col">
                  {/* 头部 */}
                  <div className={`bg-gradient-to-r ${useCase.color} p-6 text-white relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                    <div className="relative z-10">
                      <useCase.icon className="h-8 w-8 mb-4" />
                      <h3 className="text-xl font-bold mb-2">{useCase.title}</h3>
                      <p className="text-white/90 text-sm">{useCase.scenario}</p>
                    </div>
                  </div>

                  {/* 内容 */}
                  <div className="p-6 flex-1 flex flex-col">
                    <p className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                      {useCase.description}
                    </p>

                    {/* 功能特性 */}
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">核心功能</h4>
                      <div className="flex flex-wrap gap-2">
                        {useCase.features.map((feature, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full text-xs font-medium"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* 演示结果 */}
                    <div className="mb-6 flex-1">
                      <h4 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">效果演示</h4>
                      <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 text-sm text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">
                        {useCase.demo}
                      </div>
                    </div>

                    {/* 效果指标 */}
                    <div className="mb-6">
                      <div className={`bg-gradient-to-r ${useCase.color} bg-opacity-10 rounded-lg p-4 text-center`}>
                        <TrendingUp className="h-6 w-6 mx-auto mb-2 text-green-600" />
                        <p className="font-bold text-slate-900 dark:text-white">{useCase.result}</p>
                      </div>
                    </div>

                    {/* 操作按钮 */}
                    <div className="flex gap-3">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 group-hover:border-blue-500 transition-colors"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        观看演示
                      </Button>
                      <Button 
                        size="sm" 
                        className={`flex-1 bg-gradient-to-r ${useCase.color} hover:opacity-90`}
                      >
                        立即试用
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* 底部CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-8 border border-blue-200/50 dark:border-blue-800/50">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              还有更多应用场景等你发现
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              法律录音整理、医疗病历记录、教育课程转录、播客字幕生成...
            </p>
            <Button 
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <FileText className="h-5 w-5 mr-2" />
              免费试用，发现更多可能
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
} 