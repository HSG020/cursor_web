"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Headphones, Mail, Phone, MapPin, Twitter, Github, Linkedin, Youtube } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const footerLinks = {
  product: {
    title: "产品",
    links: [
      { name: "功能特性", href: "#features" },
      { name: "价格方案", href: "#pricing" },
      { name: "API 文档", href: "/docs" },
      { name: "产品演示", href: "#demo" },
      { name: "更新日志", href: "/changelog" }
    ]
  },
  company: {
    title: "公司",
    links: [
      { name: "关于我们", href: "/about" },
      { name: "联系我们", href: "/contact" },
      { name: "招聘信息", href: "/careers" },
      { name: "媒体报道", href: "/press" },
      { name: "合作伙伴", href: "/partners" }
    ]
  },
  support: {
    title: "支持",
    links: [
      { name: "帮助中心", href: "/help" },
      { name: "常见问题", href: "#faq" },
      { name: "技术支持", href: "/support" },
      { name: "社区论坛", href: "/community" },
      { name: "状态页面", href: "/status" }
    ]
  },
  legal: {
    title: "法律",
    links: [
      { name: "使用条款", href: "/terms" },
      { name: "隐私政策", href: "/privacy" },
      { name: "Cookie 政策", href: "/cookies" },
      { name: "数据安全", href: "/security" },
      { name: "合规认证", href: "/compliance" }
    ]
  }
}

const socialLinks = [
  { name: "Twitter", icon: Twitter, href: "https://twitter.com/voicescribe" },
  { name: "GitHub", icon: Github, href: "https://github.com/voicescribe" },
  { name: "LinkedIn", icon: Linkedin, href: "https://linkedin.com/company/voicescribe" },
  { name: "YouTube", icon: Youtube, href: "https://youtube.com/@voicescribe" }
]

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900/20 to-indigo-900/20"></div>
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* 主要内容区域 */}
        <div className="py-16">
          <div className="grid lg:grid-cols-6 gap-12">
            {/* 品牌和简介 */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Link href="/" className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
                    <Headphones className="h-8 w-8 text-white" />
                  </div>
                  <span className="font-bold text-2xl">VoiceScribe</span>
                </Link>
                
                <p className="text-slate-300 mb-6 leading-relaxed">
                  专业级AI语音转文字平台，为全球用户提供高精度、多语言的语音识别服务。
                  让语音转换变得简单高效。
                </p>
                
                {/* 联系信息 */}
                <div className="space-y-3 text-sm text-slate-400">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4" />
                    <span>contact@voicescribe.com</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4" />
                    <span>+86 400-123-4567</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4" />
                    <span>北京市朝阳区科技园区</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* 链接区域 */}
            <div className="lg:col-span-4">
              <div className="grid md:grid-cols-4 gap-8">
                {Object.entries(footerLinks).map(([key, section], index) => (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <h3 className="font-semibold text-white mb-4">{section.title}</h3>
                    <ul className="space-y-3">
                      {section.links.map((link) => (
                        <li key={link.name}>
                          <Link
                            href={link.href}
                            className="text-slate-400 hover:text-white transition-colors duration-200 text-sm"
                          >
                            {link.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 订阅区域 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="py-8 border-t border-slate-800"
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-xl font-semibold mb-2">订阅我们的更新</h3>
              <p className="text-slate-400 text-sm">
                获取最新功能更新、技术资讯和优惠信息
              </p>
            </div>
            <div className="flex gap-3">
              <Input
                type="email"
                placeholder="输入您的邮箱地址"
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400 focus:border-blue-500"
              />
              <Button className="bg-blue-600 hover:bg-blue-700 px-6">
                订阅
              </Button>
            </div>
          </div>
        </motion.div>

        {/* 底部区域 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="py-8 border-t border-slate-800"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* 版权信息 */}
            <div className="text-slate-400 text-sm">
              <p>© 2024 VoiceScribe. 保留所有权利。</p>
              <p className="mt-1">
                <Link href="/terms" className="hover:text-white transition-colors">使用条款</Link>
                {" · "}
                <Link href="/privacy" className="hover:text-white transition-colors">隐私政策</Link>
                {" · "}
                <Link href="/cookies" className="hover:text-white transition-colors">Cookie 政策</Link>
              </p>
            </div>

            {/* 社交媒体链接 */}
            <div className="flex items-center gap-4">
              <span className="text-slate-400 text-sm mr-2">关注我们:</span>
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors duration-200 group"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <social.icon className="h-4 w-4 text-slate-400 group-hover:text-white transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        </motion.div>

        {/* 认证标志 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="py-6 border-t border-slate-800"
        >
          <div className="flex flex-wrap justify-center items-center gap-8 text-slate-500 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-green-600 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">✓</span>
              </div>
              <span>ISO 27001 认证</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">S</span>
              </div>
              <span>SOC 2 Type II</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-purple-600 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">G</span>
              </div>
              <span>GDPR 合规</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-orange-600 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">P</span>
              </div>
              <span>PCI DSS</span>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
} 