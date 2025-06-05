"use client"

import { motion } from "framer-motion"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { HelpCircle, MessageCircle, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FAQItem {
  question: string
  answer: string
  category: string
}

const faqData: FAQItem[] = [
  {
    category: "基础功能",
    question: "VoiceScribe 支持哪些音频格式？",
    answer: "我们支持几乎所有主流音频格式，包括 MP3、WAV、M4A、FLAC、OGG、AAC 等。同时也支持视频文件中的音频提取，如 MP4、AVI、MOV 等格式。"
  },
  {
    category: "基础功能",
    question: "转录的准确率如何？",
    answer: "我们的AI语音识别技术在清晰录音条件下可达到95%以上的准确率。准确率会受到音频质量、说话人口音、背景噪音等因素影响。我们持续优化算法以提供更好的识别效果。"
  },
  {
    category: "语言支持",
    question: "支持多少种语言？",
    answer: "目前支持50+种语言，包括中文（普通话、粤语）、英语、日语、韩语、法语、德语、西班牙语、俄语等主流语言。我们还在不断增加新的语言支持。"
  },
  {
    category: "语言支持",
    question: "可以自动检测音频语言吗？",
    answer: "是的，我们提供智能语言检测功能。系统可以自动识别音频中的主要语言，无需手动选择。这对于多语言混合的音频内容特别有用。"
  },
  {
    category: "定价和计费",
    question: "免费版有什么限制？",
    answer: "免费版每月提供60分钟的转录时长，支持基础的说话人识别和文本导出功能。升级到专业版可获得更多转录时长和高级功能。"
  },
  {
    category: "定价和计费",
    question: "如何计算转录时长？",
    answer: "转录时长按音频的实际播放时间计算。例如，一个30分钟的音频文件会消耗30分钟的配额。暂停的部分不会计入时长。"
  },
  {
    category: "技术问题",
    question: "上传的音频文件大小有限制吗？",
    answer: "免费版支持最大100MB的文件，专业版支持最大500MB，企业版支持最大2GB。对于超大文件，我们提供分段处理功能。"
  },
  {
    category: "技术问题",
    question: "转录需要多长时间？",
    answer: "通常情况下，转录速度约为音频时长的1/4到1/2。例如，10分钟的音频大约需要2-5分钟完成转录。具体时间取决于音频质量和服务器负载。"
  },
  {
    category: "数据安全",
    question: "我的音频数据安全吗？",
    answer: "我们非常重视数据安全。所有音频文件都经过端到端加密传输和存储，符合GDPR和SOC 2标准。处理完成后，音频文件会在30天内自动删除。"
  },
  {
    category: "数据安全",
    question: "可以删除我的转录记录吗？",
    answer: "当然可以。您可以随时在账户设置中删除任何转录记录。我们也提供批量删除功能，让您完全控制自己的数据。"
  }
]

const categories = Array.from(new Set(faqData.map(item => item.category)))

export function FAQSection() {
  return (
    <section className="py-20 px-4 bg-white dark:bg-slate-900">
      <div className="container mx-auto max-w-4xl">
        {/* 标题区域 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 px-4 py-2 rounded-full mb-6">
            <HelpCircle className="h-4 w-4 text-blue-600" />
            <span className="text-blue-700 dark:text-blue-300 text-sm font-medium">常见问题</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-900 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent">
            常见问题解答
          </h2>
          
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            找不到您想要的答案？我们的支持团队随时为您提供帮助
          </p>
        </motion.div>

        {/* FAQ内容 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {categories.map((category, categoryIndex) => (
            <div key={category} className="mb-12">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                {category}
              </h3>
              
              <Accordion type="single" collapsible className="space-y-4">
                {faqData
                  .filter(item => item.category === category)
                  .map((item, index) => (
                    <AccordionItem
                      key={index}
                      value={`${categoryIndex}-${index}`}
                      className="border border-slate-200 dark:border-slate-700 rounded-xl px-6 bg-slate-50/50 dark:bg-slate-800/50 backdrop-blur-sm"
                    >
                      <AccordionTrigger className="text-left hover:no-underline py-6">
                        <span className="font-medium text-slate-900 dark:text-white pr-4">
                          {item.question}
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="pb-6 text-slate-600 dark:text-slate-300 leading-relaxed">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
              </Accordion>
            </div>
          ))}
        </motion.div>

        {/* 联系支持 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-8 border border-blue-200/50 dark:border-blue-800/50">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              还有其他问题？
            </h3>
            <p className="text-slate-600 dark:text-slate-300 mb-6 max-w-2xl mx-auto">
              我们的专业支持团队随时准备为您提供帮助。无论是技术问题还是使用建议，我们都会及时回复。
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl group">
                <MessageCircle className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                在线客服
              </Button>
              <Button variant="outline" className="border-blue-200 dark:border-blue-800 px-6 py-3 rounded-xl group">
                <Phone className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                电话支持
              </Button>
            </div>
            
            <div className="mt-6 text-sm text-slate-500 dark:text-slate-400">
              <p>工作时间：周一至周五 9:00-18:00</p>
              <p>紧急技术支持：24/7 全天候服务</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
} 