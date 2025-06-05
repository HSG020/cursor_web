import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { LanguageProvider } from '@/lib/language-context';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AuthSessionProvider } from '@/components/providers/session-provider';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'VoiceScribe - 语音转文字工具',
  description: '高级语音转文字服务，支持说话人识别 | Advanced speech-to-text transcription with speaker detection',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="shortcut icon" href="/favicon.svg" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
      </head>
      <body className={inter.className}>
        {/* Google Analytics */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-TB09YKTD26"
          strategy="afterInteractive"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-TB09YKTD26');
            `,
          }}
        />
        
        {/* Plausible Analytics */}
        <Script
          defer
          data-domain="www.b2bfollowup.xyz"
          src="https://plausible.io/js/script.file-downloads.outbound-links.js"
          strategy="afterInteractive"
        />
        
        <AuthSessionProvider>
          <ThemeProvider 
            attribute="class" 
            defaultTheme="system" 
            enableSystem 
            disableTransitionOnChange
          >
            <LanguageProvider>
              <Header />
              <main className="min-h-screen pt-24">
                {children}
              </main>
              <Footer />
            </LanguageProvider>
          </ThemeProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}