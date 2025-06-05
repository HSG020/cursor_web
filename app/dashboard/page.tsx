"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Headphones, 
  Clock, 
  FileText, 
  Download, 
  Trash2, 
  Calendar,
  BarChart3,
  Users,
  Zap,
  Crown,
  Plus
} from "lucide-react"
import Link from "next/link"

interface Transcription {
  id: string
  fileName: string
  duration: number
  language: string
  outputLang: string
  status: "processing" | "completed" | "failed"
  transcript?: string
  createdAt: string
  fileSize: number
}

interface UserStats {
  totalTranscriptions: number
  totalMinutes: number
  currentPlan: string
  remainingMinutes: number
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [transcriptions, setTranscriptions] = useState<Transcription[]>([])
  const [stats, setStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
      return
    }

    if (status === "authenticated") {
      loadDashboardData()
    }
  }, [status, router])

  const loadDashboardData = async () => {
    try {
      const response = await fetch('/api/transcriptions')
      
      if (!response.ok) {
        throw new Error('获取数据失败')
      }

      const data = await response.json()
      
      setStats(data.stats || {
        totalTranscriptions: 0,
        totalMinutes: 0,
        currentPlan: "free",
        remainingMinutes: 10
      })

      setTranscriptions(data.transcriptions || [])
    } catch (error) {
      console.error("加载仪表板数据失败:", error)
      
      // 使用默认数据
      setStats({
        totalTranscriptions: 0,
        totalMinutes: 0,
        currentPlan: "free",
        remainingMinutes: 10
      })
      setTranscriptions([])
    } finally {
      setLoading(false)
    }
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const formatFileSize = (bytes: number) => {
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">已完成</Badge>
      case "processing":
        return <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">处理中</Badge>
      case "failed":
        return <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300">失败</Badge>
      default:
        return <Badge variant="secondary">未知</Badge>
    }
  }

  const getPlanIcon = (plan: string) => {
    switch (plan) {
      case "free":
        return <Users className="h-4 w-4" />
      case "professional":
        return <Zap className="h-4 w-4" />
      case "enterprise":
        return <Crown className="h-4 w-4" />
      default:
        return <Users className="h-4 w-4" />
    }
  }

  const getPlanName = (plan: string) => {
    switch (plan) {
      case "free":
        return "免费版"
      case "professional":
        return "专业版"
      case "enterprise":
        return "企业版"
      default:
        return "未知"
    }
  }

  const handleDeleteTranscription = async (id: string) => {
    if (!confirm('确定要删除这条转录记录吗？')) {
      return
    }

    try {
      const response = await fetch(`/api/transcriptions?id=${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('删除失败')
      }

      // 重新加载数据
      loadDashboardData()
    } catch (error) {
      console.error('删除转录记录失败:', error)
      alert('删除失败，请重试')
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-300">加载中...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* 欢迎信息 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            欢迎回来，{session.user?.name || '用户'}！
          </h1>
          <p className="text-slate-600 dark:text-slate-300">
            管理您的语音转录项目和账户设置
          </p>
        </motion.div>

        {/* 统计卡片 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-300">总转录数</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats?.totalTranscriptions || 0}</p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-300">总时长</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats?.totalMinutes.toFixed(1) || 0} 分钟</p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                  <Clock className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-300">当前计划</p>
                  <div className="flex items-center gap-2">
                    {getPlanIcon(stats?.currentPlan || "free")}
                    <p className="text-lg font-bold text-slate-900 dark:text-white">{getPlanName(stats?.currentPlan || "free")}</p>
                  </div>
                </div>
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-300">剩余配额</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats?.remainingMinutes.toFixed(1) || 0} 分钟</p>
                </div>
                <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-full">
                  <Headphones className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 快速操作 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">快速操作</h2>
          </div>
          <div className="flex gap-4">
            <Button asChild className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
              <Link href="/">
                <Plus className="h-4 w-4 mr-2" />
                新建转录
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/pricing">
                升级计划
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* 转录历史 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                转录历史
              </CardTitle>
            </CardHeader>
            <CardContent>
              {transcriptions.length === 0 ? (
                <div className="text-center py-8">
                  <Headphones className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-500 dark:text-slate-400 mb-4">还没有转录记录</p>
                  <Button asChild>
                    <Link href="/">开始第一次转录</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {transcriptions.map((transcription) => (
                    <div
                      key={transcription.id}
                      className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-medium text-slate-900 dark:text-white">
                            {transcription.fileName}
                          </h3>
                          {getStatusBadge(transcription.status)}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDuration(transcription.duration)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(transcription.createdAt)}
                          </span>
                          <span>{formatFileSize(transcription.fileSize)}</span>
                          <span>{transcription.language} → {transcription.outputLang}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {transcription.status === "completed" && (
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4 mr-1" />
                            下载
                          </Button>
                        )}
                        <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700" onClick={() => handleDeleteTranscription(transcription.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
} 