"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { LANGUAGES } from "@/lib/language-options"

interface LanguageSelectorProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  label?: string
  options?: { value: string; label: string; labelEn: string }[]
  langMode?: 'zh' | 'en'
}

export function LanguageSelector({ 
  value, 
  onChange, 
  disabled = false, 
  label, 
  options = LANGUAGES, 
  langMode = 'zh' 
}: LanguageSelectorProps) {
  console.log('🔍 LanguageSelector render:', { 
    value, 
    label, 
    options: options.map(o => ({ value: o.value, label: o.label })),
    disabled,
    langMode
  })
  
  const handleValueChange = (newValue: string) => {
    console.log('🎯 LanguageSelector: Value changing from', value, 'to', newValue)
    console.log('🎯 LanguageSelector: onChange function:', typeof onChange)
    console.log('🎯 LanguageSelector: Calling onChange...')
    onChange(newValue)
    console.log('🎯 LanguageSelector: onChange called successfully')
  }

  // 临时使用原生select来测试
  const handleNativeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value
    console.log('🎯 Native select: Value changing from', value, 'to', newValue)
    onChange(newValue)
  }
  
  return (
    <div className="space-y-2">
      <Label htmlFor={`language-${label}`} className="text-sm font-medium">
        {label || (langMode === 'zh' ? "输出语言" : "Output Language")}
      </Label>
      
      {/* 临时使用原生select进行测试 */}
      <select
        id={`language-${label}`}
        value={value}
        onChange={handleNativeChange}
        disabled={disabled}
        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {options.map((lang) => (
          <option key={lang.value} value={lang.value}>
            {langMode === 'zh' ? lang.label : lang.labelEn}
          </option>
        ))}
      </select>
      
      {/* 原来的Radix UI Select - 暂时注释掉
      <Select 
        value={value} 
        onValueChange={handleValueChange}
        disabled={disabled}
      >
        <SelectTrigger id={`language-${label}`} className="w-full">
          <SelectValue placeholder={langMode === 'zh' ? "选择语言" : "Select language"} />
        </SelectTrigger>
        <SelectContent>
          {options.map((lang) => (
            <SelectItem 
              key={lang.value} 
              value={lang.value}
            >
              {langMode === 'zh' ? lang.label : lang.labelEn}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      */}
    </div>
  )
}