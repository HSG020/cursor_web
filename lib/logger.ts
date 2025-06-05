// 日志工具 - 根据环境控制日志输出
const isDevelopment = process.env.NODE_ENV === 'development'

export const logger = {
  log: (...args: any[]) => {
    if (isDevelopment) {
      console.log(...args)
    }
  },
  
  error: (...args: any[]) => {
    console.error(...args) // 错误日志始终输出
  },
  
  warn: (...args: any[]) => {
    if (isDevelopment) {
      console.warn(...args)
    }
  },
  
  info: (...args: any[]) => {
    if (isDevelopment) {
      console.info(...args)
    }
  },
  
  debug: (...args: any[]) => {
    if (isDevelopment) {
      console.debug(...args)
    }
  }
}

// 用于API路由的日志工具
export const apiLogger = {
  request: (method: string, path: string, data?: any) => {
    if (isDevelopment) {
      console.log(`📡 ${method} ${path}`, data ? { data } : '')
    }
  },
  
  response: (method: string, path: string, status: number, data?: any) => {
    if (isDevelopment) {
      console.log(`📤 ${method} ${path} - ${status}`, data ? { data } : '')
    }
  },
  
  error: (method: string, path: string, error: any) => {
    console.error(`❌ ${method} ${path}`, error)
  }
} 