"use client"

import { cn } from "@/lib/utils"
import { Loader2, AudioWaveform, Brain, Zap } from "lucide-react"

interface LoadingProps {
  variant?: "default" | "audio" | "brain" | "pulse" | "dots"
  size?: "sm" | "md" | "lg" | "xl"
  text?: string
  className?: string
}

export function Loading({ 
  variant = "default", 
  size = "md", 
  text,
  className 
}: LoadingProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6", 
    lg: "w-8 h-8",
    xl: "w-12 h-12"
  }

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg", 
    xl: "text-xl"
  }

  const renderSpinner = () => {
    switch (variant) {
      case "audio":
        return (
          <div className="flex items-center gap-1">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className={cn(
                  "bg-blue-500 rounded-full animate-pulse",
                  size === "sm" && "w-1 h-3",
                  size === "md" && "w-1.5 h-4",
                  size === "lg" && "w-2 h-5",
                  size === "xl" && "w-3 h-6"
                )}
                style={{
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: "1s"
                }}
              />
            ))}
          </div>
        )
      
      case "brain":
        return (
          <Brain 
            className={cn(
              sizeClasses[size],
              "animate-pulse text-purple-500"
            )}
          />
        )
      
      case "pulse":
        return (
          <div className={cn(
            "rounded-full bg-gradient-to-r from-blue-500 to-purple-500 animate-ping",
            sizeClasses[size]
          )} />
        )
      
      case "dots":
        return (
          <div className="flex space-x-1">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={cn(
                  "bg-blue-500 rounded-full animate-bounce",
                  size === "sm" && "w-2 h-2",
                  size === "md" && "w-3 h-3",
                  size === "lg" && "w-4 h-4",
                  size === "xl" && "w-5 h-5"
                )}
                style={{
                  animationDelay: `${i * 0.1}s`
                }}
              />
            ))}
          </div>
        )
      
      default:
        return (
          <Loader2 
            className={cn(
              sizeClasses[size],
              "animate-spin text-blue-500"
            )}
          />
        )
    }
  }

  return (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
      {renderSpinner()}
      {text && (
        <p className={cn(
          "text-slate-600 dark:text-slate-400 font-medium",
          textSizeClasses[size]
        )}>
          {text}
        </p>
      )}
    </div>
  )
}

// 全屏加载组件
export function FullScreenLoading({ text = "加载中..." }: { text?: string }) {
  return (
    <div className="fixed inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <Loading variant="brain" size="xl" text={text} />
    </div>
  )
}

// 页面加载组件
export function PageLoading({ text = "页面加载中..." }: { text?: string }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 flex items-center justify-center">
      <Loading variant="pulse" size="lg" text={text} />
    </div>
  )
}

// 音频处理加载组件
export function AudioProcessingLoading({ stage = "处理中..." }: { stage?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
      <Loading variant="audio" size="lg" />
      <div className="mt-4 text-center">
        <p className="text-lg font-medium text-slate-900 dark:text-white mb-2">
          AI 正在处理您的音频
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {stage}
        </p>
      </div>
      <div className="mt-4 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <Zap className="w-3 h-3" />
        <span>通常需要 30-60 秒</span>
      </div>
    </div>
  )
} 