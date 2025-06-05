"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Star, 
  Quote, 
  TrendingUp, 
  Clock, 
  DollarSign,
  Users,
  Award,
  CheckCircle
} from "lucide-react"

const testimonials = [
  {
    id: 1,
    name: "李律师",
    role: "律师助理",
    company: "北京某律师事务所",
    avatar: "/avatars/lawyer.jpg",
    content: "我是一名律师助理，用 VoiceScribe 整理法庭录音，每天节省 3 小时。以前需要一整天才能完成的庭审记录，现在 30 分钟就搞定了。",
    metrics: {
      timeSaved: "3小时/天",
      efficiency: "90%",
      satisfaction: 5
    },
    highlight: "每天节省 3 小时",
    color: "from-blue-500 to-cyan-500"
  },
  {
    id: 2,
    name: "张记者",
    role: "资深记者",
    company: "某知名媒体",
    avatar: "/avatars/journalist.jpg",
    content: "采访完政府官员后，VoiceScribe 不仅能准确转录，还能自动标注情绪和关键词。我的稿件质量提升了，编辑都夸我进步神速！",
    metrics: {
      timeSaved: "5小时/篇",
      efficiency: "85%",
      satisfaction: 5
    },
    highlight: "稿件质量显著提升",
    color: "from-green-500 to-emerald-500"
  },
  {
    id: 3,
    name: "王经理",
    role: "客服主管",
    company: "某电商平台",
    avatar: "/avatars/manager.jpg",
    content: "客服录音分析功能太强大了！自动识别客户情绪，生成问题分类报告，我们的客户满意度从 3.2 分提升到 4.7 分。老板都惊呆了！",
    metrics: {
      timeSaved: "2天/周",
      efficiency: "95%",
      satisfaction: 5
    },
    highlight: "满意度提升 47%",
    color: "from-purple-500 to-pink-500"
  },
  {
    id: 4,
    name: "陈教授",
    role: "大学教授",
    company: "某985高校",
    avatar: "/avatars/professor.jpg",
    content: "学术会议录音转录是我的痛点，VoiceScribe 的多语言支持太棒了！中英文混合发言都能准确识别，学术论文写作效率提升了一倍。",
    metrics: {
      timeSaved: "4小时/周",
      efficiency: "88%",
      satisfaction: 5
    },
    highlight: "论文效率翻倍",
    color: "from-orange-500 to-red-500"
  },
  {
    id: 5,
    name: "刘总监",
    role: "市场总监",
    company: "某跨国企业",
    avatar: "/avatars/director.jpg",
    content: "跨国会议的实时翻译功能救了我的命！中英文同步显示，再也不用担心语言障碍。团队协作效率提升 80%，海外同事都说沟通更顺畅了。",
    metrics: {
      timeSaved: "6小时/周",
      efficiency: "92%",
      satisfaction: 5
    },
    highlight: "团队效率提升 80%",
    color: "from-indigo-500 to-purple-500"
  },
  {
    id: 6,
    name: "赵医生",
    role: "主治医师",
    company: "某三甲医院",
    avatar: "/avatars/doctor.jpg",
    content: "病历录音转文字功能让我告别了加班写病历的日子。医学术语识别准确，格式规范，每天下班时间提前了 2 小时，终于有时间陪家人了。",
    metrics: {
      timeSaved: "2小时/天",
      efficiency: "93%",
      satisfaction: 5
    },
    highlight: "告别加班写病历",
    color: "from-teal-500 to-green-500"
  }
]

const stats = [
  {
    icon: Users,
    value: "10万+",
    label: "活跃用户",
    color: "text-blue-600"
  },
  {
    icon: Clock,
    value: "500万+",
    label: "节省小时数",
    color: "text-green-600"
  },
  {
    icon: TrendingUp,
    value: "95%",
    label: "用户满意度",
    color: "text-purple-600"
  },
  {
    icon: Award,
    value: "4.9",
    label: "平均评分",
    color: "text-orange-600"
  }
]

export function TrustTestimonials() {
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
            <span className="text-slate-900 dark:text-white">真实用户</span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              真实成果
            </span>
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            看看他们如何用 VoiceScribe 改变工作方式，提升生活质量
          </p>
        </motion.div>

        {/* 统计数据 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
        >
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 rounded-2xl flex items-center justify-center">
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
              <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                {stat.value}
              </div>
              <div className="text-slate-600 dark:text-slate-400">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* 用户故事 */}
        <div className="grid lg:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-800 dark:to-slate-700 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group overflow-hidden h-full">
                <CardContent className="p-6 h-full flex flex-col">
                  {/* 引用图标 */}
                  <div className="flex justify-between items-start mb-4">
                    <Quote className="h-8 w-8 text-blue-500 opacity-50" />
                    <div className="flex">
                      {[...Array(testimonial.metrics.satisfaction)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                      ))}
                    </div>
                  </div>

                  {/* 用户内容 */}
                  <blockquote className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6 flex-1">
                    "{testimonial.content}"
                  </blockquote>

                  {/* 效果亮点 */}
                  <div className={`bg-gradient-to-r ${testimonial.color} bg-opacity-10 rounded-lg p-4 mb-6`}>
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-400">核心成果</span>
                    </div>
                    <p className="font-bold text-slate-900 dark:text-white">
                      {testimonial.highlight}
                    </p>
                  </div>

                  {/* 数据指标 */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-lg font-bold text-slate-900 dark:text-white">
                        {testimonial.metrics.timeSaved}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        时间节省
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-slate-900 dark:text-white">
                        {testimonial.metrics.efficiency}%
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        效率提升
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-slate-900 dark:text-white">
                        {testimonial.metrics.satisfaction}.0
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        满意评分
                      </div>
                    </div>
                  </div>

                  {/* 用户信息 */}
                  <div className="flex items-center gap-4 pt-4 border-t border-slate-200 dark:border-slate-600">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                      <AvatarFallback className={`bg-gradient-to-r ${testimonial.color} text-white font-semibold`}>
                        {testimonial.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        {testimonial.role} · {testimonial.company}
                      </div>
                    </div>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* 底部信任标识 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-2xl p-8 border border-green-200/50 dark:border-green-800/50">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              🏆 他们的成功，就是我们的使命
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              每一个用户故事都是我们前进的动力，每一份信任都值得我们全力以赴
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-green-500" />
                真实用户反馈
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-green-500" />
                数据真实有效
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-green-500" />
                持续优化改进
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
} 