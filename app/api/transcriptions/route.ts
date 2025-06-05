import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    // 检查用户认证
    const session = await getServerSession(authOptions)
    if (!session || !session.user?.id) {
      return NextResponse.json({ 
        error: "未授权访问"
      }, { status: 401 })
    }

    // 获取查询参数
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const status = searchParams.get("status")

    // 构建查询条件
    const where: any = {
      userId: session.user.id
    }

    if (status && status !== "all") {
      where.status = status
    }

    // 获取转录记录
    const [transcriptions, total] = await Promise.all([
      prisma.transcription.findMany({
        where,
        orderBy: {
          createdAt: "desc"
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.transcription.count({ where })
    ])

    // 获取用户统计信息
    const stats = await getUserStats(session.user.id)

    return NextResponse.json({
      transcriptions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
      stats
    })

  } catch (error) {
    console.error("获取转录历史失败:", error)
    return NextResponse.json({ 
      error: "服务器内部错误"
    }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // 检查用户认证
    const session = await getServerSession(authOptions)
    if (!session || !session.user?.id) {
      return NextResponse.json({ 
        error: "未授权访问"
      }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ 
        error: "缺少转录ID"
      }, { status: 400 })
    }

    // 检查转录记录是否属于当前用户
    const transcription = await prisma.transcription.findFirst({
      where: {
        id,
        userId: session.user.id
      }
    })

    if (!transcription) {
      return NextResponse.json({ 
        error: "转录记录不存在或无权限删除"
      }, { status: 404 })
    }

    // 删除转录记录
    await prisma.transcription.delete({
      where: { id }
    })

    return NextResponse.json({ 
      message: "转录记录已删除"
    })

  } catch (error) {
    console.error("删除转录记录失败:", error)
    return NextResponse.json({ 
      error: "服务器内部错误"
    }, { status: 500 })
  }
}

async function getUserStats(userId: string) {
  try {
    // 获取用户订阅信息
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { subscription: true }
    })

    if (!user || !user.subscription) {
      return null
    }

    // 获取总转录数
    const totalTranscriptions = await prisma.transcription.count({
      where: { userId }
    })

    // 获取总时长
    const totalMinutesResult = await prisma.transcription.aggregate({
      where: { 
        userId,
        status: "completed"
      },
      _sum: {
        duration: true
      }
    })

    const totalMinutes = (totalMinutesResult._sum.duration || 0) / 60

    // 获取本月使用量
    const currentMonth = new Date()
    currentMonth.setDate(1)
    currentMonth.setHours(0, 0, 0, 0)

    const monthlyUsageResult = await prisma.usageRecord.aggregate({
      where: {
        userId,
        date: {
          gte: currentMonth
        }
      },
      _sum: {
        amount: true
      }
    })

    const usedMinutes = monthlyUsageResult._sum.amount || 0

    // 根据计划计算剩余配额
    let maxMinutes = 10
    if (user.subscription.planType === "professional") {
      maxMinutes = 500
    } else if (user.subscription.planType === "enterprise") {
      maxMinutes = 2000
    }

    const remainingMinutes = maxMinutes - usedMinutes

    return {
      totalTranscriptions,
      totalMinutes,
      currentPlan: user.subscription.planType,
      remainingMinutes,
      usedMinutes,
      maxMinutes
    }

  } catch (error) {
    console.error("获取用户统计失败:", error)
    return null
  }
} 