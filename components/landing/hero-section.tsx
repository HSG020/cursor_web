"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { 
  Mic, 
  FileText, 
  Zap, 
  Play, 
  Pause,
  Volume2,
  Users,
  Globe,
  Clock,
  ArrowRight,
  Sparkles,
  Star,
  Award,
  Headphones,
  Brain
} from "lucide-react"
import Link from "next/link"

// 动态场景数据
const scenarios = [
  {
    id: 1,
    title: "记者采访",
    subtitle: "Interview Recording",
    description: "3分钟采访，秒变完整稿件",
    audioWave: [0.2, 0.8, 0.4, 0.9, 0.3, 0.7, 0.5, 0.6, 0.8, 0.4],
    result: "【记者】：请问您对这次政策有什么看法？\n【专家】：我认为这是一个积极的信号...",
    color: "from-blue-500 to-cyan-500"
  },
  {
    id: 2,
    title: "会议记录",
    subtitle: "Meeting Minutes",
    description: "多人会议，智能分离发言人",
    audioWave: [0.3, 0.6, 0.8, 0.4, 0.7, 0.5, 0.9, 0.3, 0.6, 0.8],
    result: "【张总】：这个季度的销售目标...\n【李经理】：我们需要重点关注...\n【王主管】：建议优化流程...",
    color: "from-purple-500 to-pink-500"
  },
  {
    id: 3,
    title: "双语翻译",
    subtitle: "Real-time Translation",
    description: "中英文实时对照，无缝沟通",
    audioWave: [0.5, 0.7, 0.3, 0.8, 0.4, 0.9, 0.2, 0.6, 0.7, 0.5],
    result: "Hello, welcome to our company.\n你好，欢迎来到我们公司。\n\nWe are very pleased to meet you.\n我们很高兴见到您。",
    color: "from-green-500 to-emerald-500"
  }
]

export function HeroSection() {
  const [currentScenario, setCurrentScenario] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioProgress, setAudioProgress] = useState(0)

  // 自动轮播场景
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentScenario((prev) => (prev + 1) % scenarios.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  // 模拟音频播放进度
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setAudioProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false)
            return 0
          }
          return prev + 2
        })
      }, 100)
      return () => clearInterval(interval)
    }
  }, [isPlaying])

  const handlePlayDemo = () => {
    setIsPlaying(!isPlaying)
    if (!isPlaying) {
      setAudioProgress(0)
    }
  }

  const scenario = scenarios[currentScenario]

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* 更震撼的背景动效 */}
      <div className="absolute inset-0 overflow-hidden">
        {/* 流星雨效果 */}
        <div className="absolute top-0 left-1/4 w-1 h-32 bg-gradient-to-b from-white/80 to-transparent transform rotate-45 animate-pulse"></div>
        <div className="absolute top-1/4 right-1/3 w-1 h-24 bg-gradient-to-b from-blue-400/60 to-transparent transform rotate-45 animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/3 left-1/2 w-1 h-20 bg-gradient-to-b from-purple-400/60 to-transparent transform rotate-45 animate-pulse delay-2000"></div>
        
        {/* 更大的光球效果 */}
        <div className="absolute -top-60 -right-60 w-96 h-96 bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-60 -left-60 w-96 h-96 bg-gradient-to-br from-indigo-400/30 to-pink-400/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-br from-purple-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
        
        {/* 网格背景 */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      {/* 浮动的装饰元素 */}
      <motion.div
        animate={{ 
          y: [-20, 20, -20],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ 
          duration: 6, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="absolute top-20 left-20 p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20"
      >
        <Headphones className="h-8 w-8 text-blue-300" />
      </motion.div>

      <motion.div
        animate={{ 
          y: [20, -20, 20],
          rotate: [0, -5, 5, 0]
        }}
        transition={{ 
          duration: 8, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay: 1
        }}
        className="absolute top-32 right-32 p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20"
      >
        <Brain className="h-8 w-8 text-purple-300" />
      </motion.div>

      <motion.div
        animate={{ 
          y: [-15, 15, -15],
          rotate: [0, 8, -8, 0]
        }}
        transition={{ 
          duration: 7, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay: 2
        }}
        className="absolute bottom-32 left-32 p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20"
      >
        <Zap className="h-8 w-8 text-yellow-300" />
      </motion.div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="text-center max-w-6xl mx-auto">
          {/* 超震撼的主标题 */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="mb-8"
          >
            {/* 顶部小标签 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-white/30 rounded-full px-6 py-3 mb-8"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="h-5 w-5 text-yellow-300" />
              </motion.div>
              <span className="text-white font-semibold text-lg">
                🚀 Product Hunt 震撼首发
              </span>
            </motion.div>
            
            {/* 巨大的主标题 */}
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="text-6xl lg:text-9xl font-black tracking-tight mb-8 leading-tight"
            >
              <motion.span 
                className="block text-white drop-shadow-2xl"
                animate={{ 
                  textShadow: [
                    "0 0 20px rgba(59, 130, 246, 0.5)",
                    "0 0 40px rgba(147, 51, 234, 0.5)",
                    "0 0 20px rgba(59, 130, 246, 0.5)"
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                说一句话
              </motion.span>
              <motion.span 
                className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-2xl"
                animate={{ 
                  backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"]
                }}
                transition={{ duration: 4, repeat: Infinity }}
                style={{
                  backgroundSize: "200% 200%"
                }}
              >
                3秒成文字
              </motion.span>
            </motion.h1>
            
            {/* 震撼的副标题 */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="text-2xl lg:text-4xl text-white/90 mb-4 font-bold"
            >
              全球最强 AI 语音识别
            </motion.p>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1 }}
              className="text-lg lg:text-xl text-white/70 mb-12 max-w-4xl mx-auto leading-relaxed"
            >
              无需注册 · 5次免费体验 · 50+语言支持 · 实时翻译 · 说话人识别
              <br />
              <span className="text-yellow-300 font-semibold">让每一句话都变成价值</span>
            </motion.p>
          </motion.div>

          {/* 超大的 CTA 按钮 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="flex flex-col sm:flex-row gap-6 justify-center mb-16"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold px-12 py-6 rounded-2xl text-2xl shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 group border-2 border-white/20"
                asChild
              >
                <Link href="#workspace">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Mic className="h-8 w-8 mr-3" />
                  </motion.div>
                  <span className="text-2xl font-black">立即免费体验</span>
                  <ArrowRight className="h-8 w-8 ml-3 group-hover:translate-x-2 transition-transform" />
                </Link>
              </Button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="outline" 
                size="lg"
                className="border-3 border-white/40 hover:border-white/60 bg-white/10 backdrop-blur-md text-white hover:bg-white/20 px-12 py-6 rounded-2xl text-xl font-bold transition-all duration-300"
                onClick={handlePlayDemo}
              >
                {isPlaying ? (
                  <Pause className="h-6 w-6 mr-3" />
                ) : (
                  <Play className="h-6 w-6 mr-3" />
                )}
                <span className="text-xl font-bold">观看魔法演示</span>
              </Button>
            </motion.div>
          </motion.div>

          {/* 超炫的信任指标 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.4 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto"
          >
            {[
              { icon: Star, label: "99.9% 准确率", value: "AI技术", color: "text-yellow-300" },
              { icon: Users, label: "100万+ 用户", value: "全球信赖", color: "text-blue-300" },
              { icon: Globe, label: "50+ 语言", value: "全球覆盖", color: "text-green-300" },
              { icon: Award, label: "#1 产品", value: "行业领先", color: "text-purple-300" }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.6 + index * 0.1 }}
                whileHover={{ scale: 1.1 }}
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center group hover:bg-white/20 transition-all duration-300"
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: index * 0.5 }}
                >
                  <item.icon className={`h-8 w-8 mx-auto mb-3 ${item.color} group-hover:scale-110 transition-transform`} />
                </motion.div>
                <div className="text-white font-bold text-xl mb-1">{item.value}</div>
                <div className="text-white/70 text-sm">{item.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
} 