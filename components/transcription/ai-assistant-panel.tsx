"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { 
  Brain, 
  MessageSquare, 
  FileText, 
  TrendingUp, 
  Users, 
  Clock,
  Lightbulb,
  Zap,
  RefreshCw,
  CheckCircle,
  AlertCircle
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface Segment {
  speaker: string
  text: string
  startTime: number
  id?: number
  seek?: number
  end?: number
}

interface AiAssistantPanelProps {
  transcript: Segment[]
}

interface AnalysisResult {
  summary: string
  keyPoints: string[]
  speakers: string[]
  duration: string
  sentiment: 'positive' | 'neutral' | 'negative'
  actionItems?: string[]
}

export function AiAssistantPanel({ transcript }: AiAssistantPanelProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [userQuestion, setUserQuestion] = useState('')
  const [chatHistory, setChatHistory] = useState<Array<{role: 'user' | 'assistant', content: string}>>([])
  const [isAsking, setIsAsking] = useState(false)

  // 自动分析当转录内容变化时
  useEffect(() => {
    if (transcript.length > 0 && !analysis && !isAnalyzing) {
      analyzeTranscript()
    }
  }, [transcript])

  const analyzeTranscript = async () => {
    if (!transcript || transcript.length === 0) return

    setIsAnalyzing(true)
    setError(null)

    try {
      const fullText = transcript.map(s => `${s.speaker}: ${s.text}`).join('\n')
      
      const response = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'analyze',
          text: fullText,
          speakers: Array.from(new Set(transcript.map(s => s.speaker))),
          duration: Math.max(...transcript.map(s => s.startTime))
        })
      })

      if (!response.ok) {
        throw new Error('分析服务出错')
      }

      const result = await response.json()
      setAnalysis(result.analysis)
    } catch (error) {
      console.error('分析失败:', error)
      setError('AI分析暂时不可用，请稍后重试')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const askQuestion = async () => {
    if (!userQuestion.trim() || isAsking) return

    setIsAsking(true)
    const question = userQuestion
    setUserQuestion('')

    // 添加用户问题到历史
    setChatHistory(prev => [...prev, { role: 'user', content: question }])

    try {
      const fullText = transcript.map(s => `${s.speaker}: ${s.text}`).join('\n')
      
      const response = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'chat',
          question,
          text: fullText,
          chatHistory
        })
      })

      if (!response.ok) {
        throw new Error('问答服务出错')
      }

      const result = await response.json()
      
      // 添加AI回答到历史
      setChatHistory(prev => [...prev, { role: 'assistant', content: result.answer }])
    } catch (error) {
      console.error('问答失败:', error)
      setChatHistory(prev => [...prev, { 
        role: 'assistant', 
        content: '抱歉，我暂时无法回答这个问题。请稍后重试。' 
      }])
    } finally {
      setIsAsking(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return <TrendingUp className="h-4 w-4 text-green-500" />
      case 'negative': return <AlertCircle className="h-4 w-4 text-red-500" />
      default: return <CheckCircle className="h-4 w-4 text-blue-500" />
    }
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
      case 'negative': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
      default: return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
    }
  }

  if (transcript.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-6">
        <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4">
          <Brain className="h-8 w-8 text-white" />
        </div>
        <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-2">
          AI智能助手待命中
        </h4>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs">
          上传音频文件后，AI将自动分析内容并提供智能洞察
        </p>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* 分析结果区域 */}
      <div className="flex-1 min-h-0 overflow-y-auto space-y-4">
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center p-4"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="inline-block p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-3"
            >
              <Brain className="h-6 w-6 text-white" />
            </motion.div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              AI正在分析转录内容...
            </p>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <span className="text-sm text-red-700 dark:text-red-300">{error}</span>
            </div>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={analyzeTranscript}
              className="mt-2 text-xs"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              重新分析
            </Button>
          </motion.div>
        )}

        {analysis && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* 智能摘要 */}
            <Card className="bg-white/80 dark:bg-slate-700/80">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="h-4 w-4 text-purple-600" />
                  <span className="font-semibold text-sm">智能摘要</span>
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {analysis.summary}
                </p>
              </CardContent>
            </Card>

            {/* 关键要点 */}
            <Card className="bg-white/80 dark:bg-slate-700/80">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="h-4 w-4 text-yellow-600" />
                  <span className="font-semibold text-sm">关键要点</span>
                </div>
                <ul className="space-y-2">
                  {analysis.keyPoints.map((point, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-slate-700 dark:text-slate-300">{point}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* 统计信息 */}
            <div className="grid grid-cols-2 gap-3">
              <Card className="bg-white/80 dark:bg-slate-700/80">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-4 w-4 text-blue-600" />
                    <span className="font-semibold text-xs">说话人</span>
                  </div>
                  <p className="text-lg font-bold text-slate-800 dark:text-slate-200">
                    {analysis.speakers.length}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/80 dark:bg-slate-700/80">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-green-600" />
                    <span className="font-semibold text-xs">时长</span>
                  </div>
                  <p className="text-lg font-bold text-slate-800 dark:text-slate-200">
                    {analysis.duration}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* 情感分析 */}
            <Card className="bg-white/80 dark:bg-slate-700/80">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getSentimentIcon(analysis.sentiment)}
                    <span className="font-semibold text-sm">整体情感</span>
                  </div>
                  <Badge className={getSentimentColor(analysis.sentiment)}>
                    {analysis.sentiment === 'positive' ? '积极' : 
                     analysis.sentiment === 'negative' ? '消极' : '中性'}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* 行动项目 */}
            {analysis.actionItems && analysis.actionItems.length > 0 && (
              <Card className="bg-white/80 dark:bg-slate-700/80">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="h-4 w-4 text-orange-600" />
                    <span className="font-semibold text-sm">行动项目</span>
                  </div>
                  <ul className="space-y-2">
                    {analysis.actionItems.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-700 dark:text-slate-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}

        {/* 对话历史 */}
        <AnimatePresence>
          {chatHistory.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: message.role === 'user' ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`p-3 rounded-lg ${
                message.role === 'user' 
                  ? 'bg-blue-100 dark:bg-blue-900/30 ml-4' 
                  : 'bg-slate-100 dark:bg-slate-700/50 mr-4'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                {message.role === 'user' ? (
                  <MessageSquare className="h-3 w-3 text-blue-600" />
                ) : (
                  <Brain className="h-3 w-3 text-purple-600" />
                )}
                <span className="text-xs font-semibold">
                  {message.role === 'user' ? '您' : 'AI助手'}
                </span>
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300">
                {message.content}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* 问答输入区域 */}
      <div className="flex-shrink-0 pt-4 border-t border-slate-200 dark:border-slate-600">
        <div className="space-y-2">
          <Textarea
            placeholder="向AI助手提问关于转录内容的问题..."
            value={userQuestion}
            onChange={(e) => setUserQuestion(e.target.value)}
            className="min-h-[60px] text-sm resize-none"
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                askQuestion()
              }
            }}
          />
          <Button 
            size="sm" 
            onClick={askQuestion}
            disabled={!userQuestion.trim() || isAsking}
            className="w-full"
          >
            {isAsking ? (
              <>
                <Brain className="h-4 w-4 mr-2 animate-pulse" />
                思考中...
              </>
            ) : (
              <>
                <MessageSquare className="h-4 w-4 mr-2" />
                提问
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
} 