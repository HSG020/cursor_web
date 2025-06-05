"use client"

import { motion } from "framer-motion"
import { Clock, DollarSign, Users, Shield, Zap, Target, TrendingUp, CheckCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface Benefit {
  icon: React.ComponentType<any>
  title: string
  description: string
  metrics: string
  details: string[]
}

const benefits: Benefit[] = [
  {
    icon: Clock,
    title: "节省时间成本",
    description: "自动化转录，告别手动输入",
    metrics: "节省 90% 时间",
    details: [
      "1小时音频仅需15分钟处理",
      "自动化流程无需人工干预",
      "批量处理多个文件",
      "24/7 不间断服务"
    ]
  },
  {
    icon: DollarSign,
    title: "降低人力成本",
    description: "替代传统人工转录服务",
    metrics: "成本降低 80%",
    details: [
      "无需雇佣专业转录员",
      "按需付费，灵活计费",
      "减少人工错误成本",
      "提高投资回报率"
    ]
  },
  {
    icon: Target,
    title: "提升准确性",
    description: "AI算法确保高精度转录",
    metrics: "准确率 95%+",
    details: [
      "先进的语音识别技术",
      "智能纠错和优化",
      "专业术语识别",
      "多语言精准识别"
    ]
  },
  {
    icon: Users,
    title: "智能说话人识别",
    description: "自动区分不同发言人",
    metrics: "识别率 90%+",
    details: [
      "自动分离多个说话人",
      "声纹特征识别",
      "会议记录更清晰",
      "采访整理更高效"
    ]
  },
  {
    icon: Zap,
    title: "实时处理能力",
    description: "快速响应，即时获得结果",
    metrics: "处理速度 4x",
    details: [
      "云端并行处理",
      "智能负载均衡",
      "实时进度反馈",
      "秒级响应时间"
    ]
  },
  {
    icon: Shield,
    title: "数据安全保障",
    description: "企业级安全，隐私保护",
    metrics: "安全等级 A+",
    details: [
      "端到端加密传输",
      "数据自动销毁",
      "合规认证保障",
      "隐私保护承诺"
    ]
  }
]

const problemSolutions = [
  {
    problem: "手动转录耗时费力",
    solution: "AI自动化处理，效率提升10倍",
    icon: "⏰"
  },
  {
    problem: "人工转录成本高昂",
    solution: "按需付费，成本降低80%",
    icon: "💰"
  },
  {
    problem: "转录质量不稳定",
    solution: "AI算法保证95%+准确率",
    icon: "🎯"
  },
  {
    problem: "多语言处理困难",
    solution: "支持50+语言智能识别",
    icon: "🌍"
  }
]

export function BenefitsSection() {
  return (
    <section className="py-20 px-4 bg-white dark:bg-slate-900">
      <div className="container mx-auto max-w-7xl">
        {/* 标题区域 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 px-4 py-2 rounded-full mb-6">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <span className="text-green-700 dark:text-green-300 text-sm font-medium">核心优势</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-900 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent">
            为什么选择 VoiceScribe
          </h2>
          
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            我们不仅提供语音转文字服务，更为您的业务带来实质性的价值提升
          </p>
        </motion.div>

        {/* 问题解决方案对比 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h3 className="text-2xl font-bold text-center text-slate-900 dark:text-white mb-12">
            我们解决的核心问题
          </h3>
          
          <div className="grid md:grid-cols-2 gap-8">
            {problemSolutions.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-r from-red-50 to-green-50 dark:from-red-900/20 dark:to-green-900/20 rounded-2xl p-6 border border-slate-200 dark:border-slate-700"
              >
                <div className="flex items-center gap-4">
                  <div className="text-3xl">{item.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-red-600 dark:text-red-400 font-medium">问题:</span>
                      <span className="text-slate-700 dark:text-slate-300">{item.problem}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-green-600 dark:text-green-400 font-medium">解决:</span>
                      <span className="text-slate-700 dark:text-slate-300 font-medium">{item.solution}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 核心优势展示 */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-0 shadow-xl bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 hover:shadow-2xl transition-all duration-300 group">
                <CardContent className="p-8">
                  {/* 图标和指标 */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <benefit.icon className="h-7 w-7 text-white" />
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {benefit.metrics}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        性能提升
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                    {benefit.title}
                  </h3>
                  
                  <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                    {benefit.description}
                  </p>
                  
                  {/* 详细优势列表 */}
                  <ul className="space-y-3">
                    {benefit.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-start gap-3">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-slate-600 dark:text-slate-300">
                          {detail}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* 数据统计 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 md:p-12 text-white"
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">用数据说话</h3>
            <p className="text-blue-100 text-lg">
              超过 10,000+ 用户的信任选择
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { number: "10,000+", label: "活跃用户", icon: "👥" },
              { number: "1,000,000+", label: "处理时长", icon: "⏱️" },
              { number: "95%+", label: "准确率", icon: "🎯" },
              { number: "24/7", label: "服务时间", icon: "🔄" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6"
              >
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-3xl font-bold mb-2">{stat.number}</div>
                <div className="text-blue-100">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
} 