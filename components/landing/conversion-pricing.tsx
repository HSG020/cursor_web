"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Check, 
  X, 
  Crown, 
  Zap, 
  Users, 
  Star,
  Gift,
  TrendingUp,
  Clock,
  Shield
} from "lucide-react"

const plans = [
  {
    id: "free",
    name: "免费体验版",
    price: "¥0",
    period: "/月",
    description: "适合个人用户试用",
    buyingReason: "零成本体验AI转录魔法",
    popular: false,
    color: "from-slate-500 to-slate-600",
    icon: Users,
    features: [
      { name: "每月10分钟转录", included: true },
      { name: "基础语音识别", included: true },
      { name: "中英文支持", included: true },
      { name: "标准音质处理", included: true },
      { name: "说话人识别", included: false },
      { name: "实时翻译", included: false },
      { name: "批量处理", included: false },
      { name: "API接口", included: false },
      { name: "优先客服", included: false }
    ],
    cta: "免费开始",
    highlight: "立即体验"
  },
  {
    id: "professional",
    name: "专业版",
    price: "¥99",
    period: "/月",
    originalPrice: "¥199",
    description: "适合专业人士和小团队",
    buyingReason: "每天节省3小时，月薪提升30%",
    popular: true,
    color: "from-blue-500 to-purple-600",
    icon: Zap,
    features: [
      { name: "每月500分钟转录", included: true },
      { name: "高精度AI识别", included: true },
      { name: "50+语言支持", included: true },
      { name: "专业音质处理", included: true },
      { name: "智能说话人识别", included: true },
      { name: "实时双语翻译", included: true },
      { name: "批量文件处理", included: true },
      { name: "API接口调用", included: false },
      { name: "优先客服支持", included: true }
    ],
    cta: "立即升级",
    highlight: "最受欢迎",
    savings: "年付8折，相当于免费用2.4个月"
  },
  {
    id: "enterprise",
    name: "企业定制版",
    price: "定制",
    period: "报价",
    description: "适合大型企业和机构",
    buyingReason: "团队效率翻倍，ROI超过300%",
    popular: false,
    color: "from-purple-500 to-pink-600",
    icon: Crown,
    features: [
      { name: "无限转录时长", included: true },
      { name: "企业级AI引擎", included: true },
      { name: "全语言支持", included: true },
      { name: "专业音质处理", included: true },
      { name: "高级说话人识别", included: true },
      { name: "实时多语翻译", included: true },
      { name: "企业级批量处理", included: true },
      { name: "完整API接口", included: true },
      { name: "专属客服经理", included: true }
    ],
    cta: "联系销售",
    highlight: "企业首选",
    savings: "支持私有化部署，数据100%安全"
  }
]

const incentives = [
  {
    icon: Gift,
    title: "新用户专享",
    description: "注册即送20分钟免费额度",
    color: "text-green-600"
  },
  {
    icon: TrendingUp,
    title: "年付优惠",
    description: "年付享8折，相当于免费用2.4个月",
    color: "text-blue-600"
  },
  {
    icon: Users,
    title: "邀请返利",
    description: "邀请好友注册，双方各得50分钟",
    color: "text-purple-600"
  },
  {
    icon: Shield,
    title: "无风险试用",
    description: "7天无理由退款，满意再付费",
    color: "text-orange-600"
  }
]

export function ConversionPricing() {
  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4">
        {/* 标题 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-slate-900 dark:text-white">选择适合的</span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              成功方案
            </span>
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-8">
            不只是功能对比，更是投资回报率的选择
          </p>
          
          {/* 决策诱因 */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {incentives.map((incentive, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-xl p-4 border border-white/20"
              >
                <incentive.icon className={`h-6 w-6 ${incentive.color} mx-auto mb-2`} />
                <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-1">
                  {incentive.title}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {incentive.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 定价表格 */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 text-sm font-semibold">
                    <Star className="h-3 w-3 mr-1" />
                    {plan.highlight}
                  </Badge>
                </div>
              )}
              
              <Card className={`bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group overflow-hidden h-full ${
                plan.popular ? 'ring-2 ring-blue-500 scale-105' : ''
              }`}>
                <CardContent className="p-0 h-full flex flex-col">
                  {/* 头部 */}
                  <div className={`bg-gradient-to-r ${plan.color} p-6 text-white relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                    <div className="relative z-10">
                      <plan.icon className="h-8 w-8 mb-4" />
                      <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                      <p className="text-white/90 text-sm mb-4">{plan.description}</p>
                      
                      {/* 价格 */}
                      <div className="flex items-baseline gap-2 mb-2">
                        {plan.originalPrice && (
                          <span className="text-white/60 line-through text-lg">
                            {plan.originalPrice}
                          </span>
                        )}
                        <span className="text-3xl font-bold">{plan.price}</span>
                        <span className="text-white/80">{plan.period}</span>
                      </div>
                      
                      {/* 购买理由 */}
                      <div className="bg-white/20 rounded-lg p-3 mt-4">
                        <p className="text-sm font-medium">💡 {plan.buyingReason}</p>
                      </div>
                    </div>
                  </div>

                  {/* 功能列表 */}
                  <div className="p-6 flex-1 flex flex-col">
                    <ul className="space-y-3 mb-6 flex-1">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-3">
                          {feature.included ? (
                            <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                          ) : (
                            <X className="h-4 w-4 text-slate-300 dark:text-slate-600 flex-shrink-0" />
                          )}
                          <span className={`text-sm ${
                            feature.included 
                              ? 'text-slate-700 dark:text-slate-300' 
                              : 'text-slate-400 dark:text-slate-600'
                          }`}>
                            {feature.name}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {/* 额外优惠信息 */}
                    {plan.savings && (
                      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 mb-6">
                        <p className="text-sm text-green-700 dark:text-green-300 font-medium">
                          🎁 {plan.savings}
                        </p>
                      </div>
                    )}

                    {/* CTA按钮 */}
                    <Button 
                      className={`w-full ${
                        plan.popular 
                          ? `bg-gradient-to-r ${plan.color} hover:opacity-90 text-white` 
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-600'
                      } font-semibold py-3`}
                    >
                      {plan.cta}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* 横向对比表格 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-xl"
        >
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 text-center">
            详细功能对比
          </h3>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-4 px-4 font-semibold text-slate-900 dark:text-white">
                    功能特性
                  </th>
                  {plans.map((plan) => (
                    <th key={plan.id} className="text-center py-4 px-4 font-semibold text-slate-900 dark:text-white">
                      {plan.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {plans[0].features.map((feature, idx) => (
                  <tr key={idx} className="border-b border-slate-100 dark:border-slate-800">
                    <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                      {feature.name}
                    </td>
                    {plans.map((plan) => (
                      <td key={plan.id} className="py-3 px-4 text-center">
                        {plan.features[idx].included ? (
                          <Check className="h-5 w-5 text-green-500 mx-auto" />
                        ) : (
                          <X className="h-5 w-5 text-slate-300 dark:text-slate-600 mx-auto" />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* 底部保障 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-2xl p-8 border border-green-200/50 dark:border-green-800/50">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              🛡️ 无风险承诺
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              7天无理由退款 · 数据安全保障 · 24/7技术支持
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-500" />
                SSL加密传输
              </span>
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-500" />
                99.9%服务可用性
              </span>
              <span className="flex items-center gap-2">
                <Users className="h-4 w-4 text-purple-500" />
                专业客服团队
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
} 