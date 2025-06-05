import Head from 'next/head'

interface MetaTagsProps {
  title?: string
  description?: string
  keywords?: string
  image?: string
  url?: string
  type?: string
}

export function MetaTags({
  title = "VoiceScribe - AI语音转文字平台",
  description = "专业的AI语音转文字平台，支持50+种语言自动识别，智能说话人分离，实时翻译。基于OpenAI Whisper技术，转录准确率高达99%。",
  keywords = "语音转文字,AI转录,音频转文字,语音识别,Whisper,会议记录,采访转录,多语言翻译",
  image = "/og-image.png",
  url = "https://voicescribe.vercel.app",
  type = "website"
}: MetaTagsProps) {
  const fullTitle = title.includes("VoiceScribe") ? title : `${title} | VoiceScribe`
  
  return (
    <Head>
      {/* 基础Meta标签 */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="VoiceScribe Team" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      
      {/* Open Graph标签 */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content="VoiceScribe" />
      <meta property="og:locale" content="zh_CN" />
      
      {/* Twitter Card标签 */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* 其他重要标签 */}
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      <meta name="theme-color" content="#667eea" />
      <meta name="msapplication-TileColor" content="#667eea" />
      
      {/* 结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "VoiceScribe",
            "description": description,
            "url": url,
            "applicationCategory": "MultimediaApplication",
            "operatingSystem": "Web Browser",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "CNY"
            },
            "creator": {
              "@type": "Organization",
              "name": "VoiceScribe Team"
            }
          })
        }}
      />
      
      {/* Favicon */}
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/favicon.svg" />
      
      {/* 预连接到外部资源 */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* 语言和地区 */}
      <meta httpEquiv="content-language" content="zh-CN" />
      <link rel="alternate" hrefLang="zh-CN" href={url} />
      <link rel="alternate" hrefLang="en" href={`${url}/en`} />
    </Head>
  )
}

// 预定义的页面Meta配置
export const pageMetaConfigs = {
  home: {
    title: "VoiceScribe - AI语音转文字平台",
    description: "专业的AI语音转文字平台，支持50+种语言自动识别，智能说话人分离，实时翻译。基于OpenAI Whisper技术，转录准确率高达99%。",
    keywords: "语音转文字,AI转录,音频转文字,语音识别,Whisper,会议记录,采访转录,多语言翻译"
  },
  dashboard: {
    title: "仪表板 - 管理您的转录项目",
    description: "查看和管理您的语音转录历史，统计使用情况，下载转录文件。",
    keywords: "转录历史,项目管理,使用统计,文件下载"
  },
  signin: {
    title: "登录 - VoiceScribe",
    description: "登录VoiceScribe账户，享受更多转录额度和高级功能。",
    keywords: "用户登录,账户管理"
  },
  signup: {
    title: "注册 - VoiceScribe",
    description: "注册VoiceScribe账户，免费获得转录额度，体验AI语音转文字服务。",
    keywords: "用户注册,免费试用"
  }
} 