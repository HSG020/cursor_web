"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Crown, Zap, Building, Star, ArrowRight } from "lucide-react"

interface PricingPlan {
  name: string
  price: string
  period: string
  description: string
  features: string[]
  popular?: boolean
  enterprise?: boolean
  buttonText: string
  buttonVariant: "default" | "outline" | "secondary"
}

const pricingPlans: PricingPlan[] = [
  {
    name: "免费版",
    price: "¥0",
    period: "/月",
    description: "适合个人用户和轻度使用",
    features: [
      "每月 60 分钟转录时长",
      "支持 10+ 种语言",
      "基础说话人识别",
      "标准音质处理",
      "文本导出功能",
      "社区支持"
    ],
    buttonText: "立即开始",
    buttonVariant: "outline"
  },
  {
    name: "专业版",
    price: "¥99",
    period: "/月",
    description: "适合专业用户和小团队",
    features: [
      "每月 500 分钟转录时长",
      "支持 50+ 种语言",
      "高精度说话人识别",
      "高级噪音过滤",
      "实时翻译功能",
      "多格式导出",
      "优先技术支持",
      "API 接口访问"
    ],
    popular: true,
    buttonText: "选择专业版",
    buttonVariant: "default"
  },
  {
    name: "企业版",
    price: "定制",
    period: "价格",
    description: "适合大型企业和机构",
    features: [
      "无限转录时长",
      "全语言支持",
      "企业级安全保障",
      "私有化部署选项",
      "定制化功能开发",
      "专属客户经理",
      "SLA 服务保障",
      "24/7 技术支持"
    ],
    enterprise: true,
    buttonText: "联系销售",
    buttonVariant: "secondary"
  }
]

export function PricingSection() {
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
            <Crown className="h-4 w-4 text-blue-600" />
            <span className="text-blue-700 dark:text-blue-300 text-sm font-medium">灵活的价格方案</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-900 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent">
            选择适合您的方案
          </h2>
          
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            从免费试用到企业级解决方案，我们为不同规模的用户提供最合适的价格方案
          </p>
        </motion.div>

        {/* 价格卡片 */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <Card className={`h-full border-0 shadow-xl backdrop-blur-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
                plan.popular 
                  ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white scale-105' 
                  : plan.enterprise
                  ? 'bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20'
                  : 'bg-white/80 dark:bg-slate-800/80'
              }`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-yellow-400 text-yellow-900 px-4 py-1 text-sm font-semibold">
                      <Star className="h-3 w-3 mr-1" />
                      最受欢迎
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-8">
                  <div className="mb-4">
                    {plan.enterprise ? (
                      <Building className={`h-12 w-12 mx-auto ${plan.popular ? 'text-yellow-300' : 'text-purple-600'}`} />
                    ) : plan.popular ? (
                      <Zap className="h-12 w-12 mx-auto text-yellow-300" />
                    ) : (
                      <Crown className="h-12 w-12 mx-auto text-blue-600" />
                    )}
                  </div>
                  
                  <h3 className={`text-2xl font-bold mb-2 ${plan.popular ? 'text-white' : ''}`}>
                    {plan.name}
                  </h3>
                  
                  <div className="mb-4">
                    <span className={`text-4xl font-bold ${plan.popular ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                      {plan.price}
                    </span>
                    <span className={`text-lg ${plan.popular ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'}`}>
                      {plan.period}
                    </span>
                  </div>
                  
                  <p className={`${plan.popular ? 'text-blue-100' : 'text-slate-600 dark:text-slate-300'}`}>
                    {plan.description}
                  </p>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <Check className={`h-5 w-5 mt-0.5 flex-shrink-0 ${
                          plan.popular ? 'text-green-300' : 'text-green-600'
                        }`} />
                        <span className={`${plan.popular ? 'text-blue-50' : 'text-slate-700 dark:text-slate-300'}`}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button
                    className={`w-full py-3 text-lg font-semibold rounded-xl transition-all duration-300 group ${
                      plan.popular
                        ? 'bg-white text-blue-600 hover:bg-blue-50 shadow-lg hover:shadow-xl'
                        : plan.enterprise
                        ? 'bg-purple-600 text-white hover:bg-purple-700'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                    variant={plan.buttonVariant}
                  >
                    {plan.buttonText}
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* 底部信息 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
              所有方案都包含
            </h3>
            <div className="grid md:grid-cols-4 gap-6 text-sm text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                <span>数据安全保障</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                <span>定期功能更新</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                <span>多平台支持</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                <span>随时取消订阅</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
} 