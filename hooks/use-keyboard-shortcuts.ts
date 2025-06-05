"use client"

import { useEffect, useCallback } from 'react'

interface KeyboardShortcut {
  key: string
  ctrlKey?: boolean
  shiftKey?: boolean
  altKey?: boolean
  metaKey?: boolean
  action: () => void
  description: string
}

interface UseKeyboardShortcutsOptions {
  shortcuts: KeyboardShortcut[]
  enabled?: boolean
}

export function useKeyboardShortcuts({ shortcuts, enabled = true }: UseKeyboardShortcutsOptions) {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return

    // 忽略在输入框中的按键
    const target = event.target as HTMLElement
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.contentEditable === 'true') {
      return
    }

    for (const shortcut of shortcuts) {
      const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase()
      const ctrlMatch = !!shortcut.ctrlKey === event.ctrlKey
      const shiftMatch = !!shortcut.shiftKey === event.shiftKey
      const altMatch = !!shortcut.altKey === event.altKey
      const metaMatch = !!shortcut.metaKey === event.metaKey

      if (keyMatch && ctrlMatch && shiftMatch && altMatch && metaMatch) {
        event.preventDefault()
        shortcut.action()
        break
      }
    }
  }, [shortcuts, enabled])

  useEffect(() => {
    if (enabled) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown, enabled])

  return shortcuts
}

// 预定义的快捷键配置
export const createDefaultShortcuts = (actions: {
  upload?: () => void
  copy?: () => void
  download?: () => void
  reset?: () => void
  toggleTheme?: () => void
  showHelp?: () => void
}) => {
  const shortcuts: KeyboardShortcut[] = []

  if (actions.upload) {
    shortcuts.push({
      key: 'u',
      ctrlKey: true,
      action: actions.upload,
      description: 'Ctrl+U - 上传文件'
    })
  }

  if (actions.copy) {
    shortcuts.push({
      key: 'c',
      ctrlKey: true,
      shiftKey: true,
      action: actions.copy,
      description: 'Ctrl+Shift+C - 复制转录结果'
    })
  }

  if (actions.download) {
    shortcuts.push({
      key: 'd',
      ctrlKey: true,
      action: actions.download,
      description: 'Ctrl+D - 下载转录结果'
    })
  }

  if (actions.reset) {
    shortcuts.push({
      key: 'r',
      ctrlKey: true,
      shiftKey: true,
      action: actions.reset,
      description: 'Ctrl+Shift+R - 重置'
    })
  }

  if (actions.toggleTheme) {
    shortcuts.push({
      key: 't',
      ctrlKey: true,
      action: actions.toggleTheme,
      description: 'Ctrl+T - 切换主题'
    })
  }

  if (actions.showHelp) {
    shortcuts.push({
      key: '?',
      action: actions.showHelp,
      description: '? - 显示帮助'
    })
  }

  return shortcuts
}

// 快捷键帮助组件
export function KeyboardShortcutsHelp({ shortcuts }: { shortcuts: KeyboardShortcut[] }) {
  return (
    <div className="space-y-2">
      <h3 className="font-medium text-slate-900 dark:text-white mb-3">键盘快捷键</h3>
      {shortcuts.map((shortcut, index) => (
        <div key={index} className="flex justify-between items-center text-sm">
          <span className="text-slate-600 dark:text-slate-400">
            {shortcut.description.split(' - ')[1]}
          </span>
          <kbd className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs font-mono">
            {shortcut.description.split(' - ')[0]}
          </kbd>
        </div>
      ))}
    </div>
  )
} 