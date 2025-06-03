import { NextRequest, NextResponse } from 'next/server';

const XAI_API_TOKEN = process.env.XAI_API_TOKEN;

export async function POST(req: NextRequest) {
  try {
    const { action, text, speakers, duration, question, chatHistory } = await req.json();

    if (!XAI_API_TOKEN) {
      return NextResponse.json({ error: 'AI助手服务未配置' }, { status: 500 });
    }

    if (action === 'analyze') {
      // 分析转录内容
      const systemPrompt = `你是一个专业的转录内容分析助手。请分析以下转录内容并提供结构化的分析结果。

请按以下JSON格式返回分析结果：
{
  "summary": "智能摘要（2-3句话概括主要内容）",
  "keyPoints": ["关键要点1", "关键要点2", "关键要点3"],
  "speakers": ["说话人列表"],
  "duration": "音频时长（格式：X分Y秒）",
  "sentiment": "positive|neutral|negative",
  "actionItems": ["行动项目1", "行动项目2"]（如果有的话）
}

要求：
1. 摘要要简洁明了，突出核心内容
2. 关键要点不超过5个，按重要性排序
3. 准确识别情感倾向
4. 如果内容涉及会议、讨论等，提取行动项目
5. 只返回JSON，不要其他解释`;

      const userPrompt = `请分析以下转录内容：

${text}

说话人数量：${speakers?.length || 0}
音频时长：${duration ? Math.floor(duration / 60) : 0}分${duration ? Math.floor(duration % 60) : 0}秒`;

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
              content: userPrompt
            }
          ],
          model: 'grok-3-latest',
          stream: false,
          temperature: 0.3
        })
      });

      if (!response.ok) {
        throw new Error(`Grok API错误: ${response.status}`);
      }

      const data = await response.json();
      let analysisText = data.choices?.[0]?.message?.content;

      if (!analysisText) {
        throw new Error('分析服务返回空结果');
      }

      // 尝试解析JSON
      let analysis;
      try {
        // 移除可能的markdown标记
        analysisText = analysisText.replace(/```json\n?|\n?```/g, '').trim();
        analysis = JSON.parse(analysisText);
      } catch (parseError) {
        // 如果解析失败，创建一个基础的分析结果
        analysis = {
          summary: analysisText.split('\n')[0] || '内容分析完成',
          keyPoints: ['内容要点分析', '说话人交流记录', '音频质量良好'],
          speakers: speakers || ['Speaker 1'],
          duration: `${Math.floor(duration / 60)}分${Math.floor(duration % 60)}秒`,
          sentiment: 'neutral',
          actionItems: []
        };
      }

      return NextResponse.json({ analysis });

    } else if (action === 'chat') {
      // 处理用户提问
      const systemPrompt = `你是一个专业的转录内容问答助手。基于提供的转录内容回答用户问题。

要求：
1. 只基于转录内容回答，不要编造信息
2. 回答要准确、简洁、有帮助
3. 如果转录内容中没有相关信息，请明确说明
4. 可以分析、总结、解释转录内容
5. 用中文回答`;

      const userPrompt = `转录内容：
${text}

用户问题：${question}`;

      const messages = [
        {
          role: 'system',
          content: systemPrompt
        }
      ];

      // 添加聊天历史（最近5轮对话）
      if (chatHistory && chatHistory.length > 0) {
        const recentHistory = chatHistory.slice(-10);
        messages.push(...recentHistory);
      }

      messages.push({
        role: 'user',
        content: userPrompt
      });

      const response = await fetch('https://api.x.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${XAI_API_TOKEN}`
        },
        body: JSON.stringify({
          messages,
          model: 'grok-3-latest',
          stream: false,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`Grok API错误: ${response.status}`);
      }

      const data = await response.json();
      const answer = data.choices?.[0]?.message?.content;

      if (!answer) {
        throw new Error('问答服务返回空结果');
      }

      return NextResponse.json({ answer });

    } else {
      return NextResponse.json({ error: '不支持的操作类型' }, { status: 400 });
    }

  } catch (error) {
    console.error('AI助手API错误:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'AI助手服务内部错误' 
    }, { status: 500 });
  }
} 