import { NextRequest, NextResponse } from 'next/server';

const XAI_API_TOKEN = process.env.XAI_API_TOKEN;

export async function POST(req: NextRequest) {
  try {
    const { text, targetLang, sourceLang } = await req.json();

    if (!text) {
      return NextResponse.json({ error: '没有提供要翻译的文本' }, { status: 400 });
    }

    if (!XAI_API_TOKEN) {
      return NextResponse.json({ error: '翻译服务未配置' }, { status: 500 });
    }

    // 语言映射
    const languageMap: { [key: string]: string } = {
      'en': '英语',
      'zh': '中文',
      'es': '西班牙语',
      'fr': '法语',
      'de': '德语',
      'ja': '日语',
      'ru': '俄语',
      'ar': '阿拉伯语',
      'hi': '印地语',
      'pt': '葡萄牙语',
      'it': '意大利语',
      'ko': '韩语',
      'th': '泰语',
      'vi': '越南语'
    };

    const sourceLangName = languageMap[sourceLang] || sourceLang;
    const targetLangName = languageMap[targetLang] || targetLang;

    const systemPrompt = `你是一个专业的翻译助手。请将提供的文本从${sourceLangName}翻译成${targetLangName}。要求：
1. 保持原文的语义和语调
2. 如果是对话内容，保持说话人的风格
3. 专业术语要准确翻译
4. 保持段落结构不变
5. 只返回翻译结果，不要添加任何解释或说明`;

    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${XAI_API_TOKEN}`
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: text
          }
        ],
        model: 'grok-3-latest',
        stream: false,
        temperature: 0.3
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Grok API错误:', errorText);
      return NextResponse.json({ 
        error: `翻译服务错误: ${response.status}` 
      }, { status: 500 });
    }

    const data = await response.json();
    const translation = data.choices?.[0]?.message?.content;

    if (!translation) {
      return NextResponse.json({ error: '翻译服务返回空结果' }, { status: 500 });
    }

    return NextResponse.json({ 
      translation,
      sourceLang: sourceLangName,
      targetLang: targetLangName
    });

  } catch (error) {
    console.error('翻译API错误:', error);
    return NextResponse.json({ 
      error: '翻译服务内部错误' 
    }, { status: 500 });
  }
} 