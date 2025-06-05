"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  ChevronDown, 
  ChevronUp, 
  MessageCircle, 
  Phone, 
  Mail,
  CheckCircle,
  ArrowRight,
  Heart,
  Shield,
  Zap
} from "lucide-react"

const faqCategories = [
  {
    id: "concerns",
    title: "担心和顾虑",
    icon: Heart,
    color: "from-red-500 to-pink-500",
    questions: [
      {
        id: 1,
        question: "我担心听不懂四川话怎么办？",
        answer: "VoiceScribe 专门针对中国方言进行了深度优化！我们的AI模型训练了包括四川话、东北话、广东话等在内的主要方言数据。即使是浓重的地方口音，识别准确率也能达到 85% 以上。",
        action: "立即上传一段四川话音频免费测试",
        actionLink: "#workspace"
      },
      {
        id: 2,
        question: "万一转录错误太多，影响我的工作怎么办？",
        answer: "我们提供 7 天无理由退款保障！如果转录准确率不满意，全额退款。另外，我们有专业的人工校对服务，重要文档可以申请人工复核，确保 99.9% 准确率。",
        action: "查看准确率保障政策",
        actionLink: "#guarantee"
      },
      {
        id: 3,
        question: "我的录音内容很机密，数据安全吗？",
        answer: "绝对安全！我们采用银行级 SSL 加密传输，数据存储在阿里云安全服务器，通过了 ISO 27001 认证。音频文件处理完成后 24 小时内自动删除，绝不保留任何用户数据。",
        action: "查看详细安全认证",
        actionLink: "#security"
      }
    ]
  },
  {
    id: "usage",
    title: "使用问题",
    icon: Zap,
    color: "from-blue-500 to-cyan-500",
    questions: [
      {
        id: 4,
        question: "我是技术小白，操作会很复杂吗？",
        answer: "完全不会！只需 3 步：上传音频 → AI自动识别语言 → 3秒生成文稿。比发微信还简单！我们还有详细的视频教程和 24/7 在线客服指导。",
        action: "观看 2 分钟操作演示视频",
        actionLink: "#demo"
      },
      {
        id: 5,
        question: "我的音频文件很大，上传会很慢吗？",
        answer: "我们支持断点续传和智能压缩技术！50MB 的音频文件通常 30 秒内就能上传完成。而且支持批量上传，一次可以处理多个文件，大大提升效率。",
        action: "测试上传速度",
        actionLink: "#workspace"
      },
      {
        id: 6,
        question: "能处理多人对话的会议录音吗？",
        answer: "当然可以！这是我们的强项。AI 能自动识别不同说话人，按照【张总】【李经理】的格式清晰标注。即使是 10 人的会议，也能准确分离每个人的发言。",
        action: "上传会议录音试试效果",
        actionLink: "#workspace"
      }
    ]
  },
  {
    id: "pricing",
    title: "价格和套餐",
    icon: Shield,
    color: "from-green-500 to-emerald-500",
    questions: [
      {
        id: 7,
        question: "免费版够用吗？我不想花冤枉钱",
        answer: "免费版每月 10 分钟，适合轻度使用。如果你每周有 1-2 个小时的录音需要转录，建议升级专业版。算一下：专业版 ¥99/月，每天节省 3 小时，相当于每小时成本只要 1 块钱！",
        action: "计算你的投资回报率",
        actionLink: "#calculator"
      },
      {
        id: 8,
        question: "年付真的划算吗？万一中途不想用了？",
        answer: "年付享 8 折优惠，相当于免费用 2.4 个月！而且我们支持按月退款，如果中途不满意，剩余月份全额退还。零风险，只有收益。",
        action: "立即享受年付优惠",
        actionLink: "#pricing"
      },
      {
        id: 9,
        question: "企业版定制价格会不会很贵？",
        answer: "企业版按团队规模定价，通常比购买多个专业版账号更便宜！而且包含私有化部署、专属客服、API 接口等增值服务。大多数企业 3 个月就能收回成本。",
        action: "获取企业版专属报价",
        actionLink: "#enterprise"
      }
    ]
  }
]

const supportOptions = [
  {
    icon: MessageCircle,
    title: "在线客服",
    description: "7×24小时即时响应",
    action: "立即咨询",
    color: "text-blue-600"
  },
  {
    icon: Phone,
    title: "电话支持",
    description: "400-888-0000",
    action: "拨打电话",
    color: "text-green-600"
  },
  {
    icon: Mail,
    title: "邮件支持",
    description: "support@voicescribe.com",
    action: "发送邮件",
    color: "text-purple-600"
  }
]

export function ConversionFAQ() {
  const [activeCategory, setActiveCategory] = useState("concerns")
  const [openQuestion, setOpenQuestion] = useState<number | null>(null)

  const toggleQuestion = (questionId: number) => {
    setOpenQuestion(openQuestion === questionId ? null : questionId)
  }

  const activeQuestions = faqCategories.find(cat => cat.id === activeCategory)?.questions || []

  return (
    <section className="py-20 bg-white dark:bg-slate-900">
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
            <span className="text-slate-900 dark:text-white">解答你的</span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              每一个疑虑
            </span>
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            我们理解你的担心，这里有最真实的解答和解决方案
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* 左侧：分类导航 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            {faqCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`w-full text-left p-4 rounded-xl transition-all duration-300 ${
                  activeCategory === category.id
                    ? `bg-gradient-to-r ${category.color} text-white shadow-lg`
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <category.icon className="h-5 w-5" />
                  <span className="font-semibold">{category.title}</span>
                </div>
              </button>
            ))}
          </motion.div>

          {/* 右侧：问答内容 */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
                className="space-y-4"
              >
                {activeQuestions.map((question, index) => (
                  <motion.div
                    key={question.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-800 dark:to-slate-700 border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                      <CardContent className="p-0">
                        {/* 问题标题 */}
                        <button
                          onClick={() => toggleQuestion(question.id)}
                          className="w-full text-left p-6 flex items-center justify-between hover:bg-white/50 dark:hover:bg-slate-700/50 transition-colors"
                        >
                          <h3 className="text-lg font-semibold text-slate-900 dark:text-white pr-4">
                            {question.question}
                          </h3>
                          {openQuestion === question.id ? (
                            <ChevronUp className="h-5 w-5 text-slate-500 flex-shrink-0" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-slate-500 flex-shrink-0" />
                          )}
                        </button>

                        {/* 答案内容 */}
                        <AnimatePresence>
                          {openQuestion === question.id && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <div className="px-6 pb-6 border-t border-slate-200 dark:border-slate-600">
                                <div className="pt-4">
                                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
                                    {question.answer}
                                  </p>
                                  
                                  {/* 行动号召 */}
                                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4 border border-blue-200/50 dark:border-blue-800/50">
                                    <div className="flex items-center gap-2 mb-2">
                                      <CheckCircle className="h-4 w-4 text-green-600" />
                                      <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                        立即行动
                                      </span>
                                    </div>
                                    <Button 
                                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                                      size="sm"
                                    >
                                      {question.action}
                                      <ArrowRight className="h-4 w-4 ml-2" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* 底部支持选项 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <div className="bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800 dark:to-slate-700 rounded-2xl p-8 border border-slate-200/50 dark:border-slate-600/50">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 text-center">
              还有疑问？我们随时为你解答
            </h3>
            
            <div className="grid md:grid-cols-3 gap-6">
              {supportOptions.map((option, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="w-16 h-16 mx-auto mb-4 bg-white dark:bg-slate-700 rounded-2xl flex items-center justify-center shadow-lg">
                    <option.icon className={`h-8 w-8 ${option.color}`} />
                  </div>
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                    {option.title}
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
                    {option.description}
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-500"
                  >
                    {option.action}
                  </Button>
                </motion.div>
              ))}
            </div>

            {/* 底部保证 */}
            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-600 text-center">
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                💝 我们承诺：每一个问题都会得到专业、耐心的解答
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  平均响应时间 &lt; 5分钟
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  问题解决率 99.8%
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  用户满意度 4.9/5
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
} 