import { NextRequest, NextResponse } from 'next/server';

const XAI_API_TOKEN = process.env.XAI_API_TOKEN;

// 内置翻译字典
const builtInTranslations: { [key: string]: { [key: string]: string } } = {
  'en-zh': {
    'I want to help put away books': '我想帮忙整理书籍',
    'I want to help everyone stand in line': '我想帮助大家排队',
    'I want to hand out food for my classmates': '我想为同学们分发食物',
    'I want to hand out papers': '我想分发试卷',
    'I want to help turn off the lights when we leave the classroom': '我想在离开教室时帮忙关灯',
    'Welcome everyone to our quarterly review meeting': '欢迎大家参加我们的季度回顾会议',
    'Today we will be discussing the progress made': '今天我们将讨论所取得的进展',
    'Before we dive into the details': '在我们深入了解细节之前',
    'I would like to thank everyone for their hard work': '我想感谢大家的辛勤工作',
    'Thanks for the introduction': '感谢介绍',
    'I would like to start by presenting our financial results': '我想首先介绍我们的财务结果',
    'Overall we have seen a 15% increase in revenue': '总体而言，我们的收入增长了15%',
    'This growth is primarily attributed to': '这种增长主要归因于',
    'That is impressive': '这很令人印象深刻',
    'How are we doing compared to our annual targets': '与我们的年度目标相比，我们做得如何'
  },
  'en-zh-tw': {
    'I want to help put away books': '我想幫忙整理書籍',
    'I want to help everyone stand in line': '我想幫助大家排隊',
    'I want to hand out food for my classmates': '我想為同學們分發食物',
    'I want to hand out papers': '我想分發試卷',
    'I want to help turn off the lights when we leave the classroom': '我想在離開教室時幫忙關燈',
    'Welcome everyone to our quarterly review meeting': '歡迎大家參加我們的季度回顧會議',
    'Today we will be discussing the progress made': '今天我們將討論所取得的進展',
    'Before we dive into the details': '在我們深入了解細節之前',
    'I would like to thank everyone for their hard work': '我想感謝大家的辛勤工作',
    'Thanks for the introduction': '感謝介紹',
    'I would like to start by presenting our financial results': '我想首先介紹我們的財務結果',
    'Overall we have seen a 15% increase in revenue': '總體而言，我們的收入增長了15%',
    'This growth is primarily attributed to': '這種增長主要歸因於',
    'That is impressive': '這很令人印象深刻',
    'How are we doing compared to our annual targets': '與我們的年度目標相比，我們做得如何'
  },
  'zh-en': {
    '综合练习': 'Comprehensive Exercise',
    '请听小朋友们介绍各自想承担的班级工作三次': 'Please listen to the children introduce the class work they want to take on three times',
    '按介绍的顺序将人物与对应的工作连线': 'Connect the characters with the corresponding work in the order of introduction',
    '你好': 'Hello',
    '谢谢': 'Thank you',
    '再见': 'Goodbye',
    '早上好': 'Good morning',
    '下午好': 'Good afternoon',
    '晚上好': 'Good evening',
    '欢迎': 'Welcome',
    '会议': 'Meeting',
    '讨论': 'Discussion',
    '项目': 'Project',
    '工作': 'Work',
    '学习': 'Study',
    '今天': 'Today',
    '明天': 'Tomorrow',
    '昨天': 'Yesterday',
    '时间': 'Time',
    '地点': 'Location',
    '人员': 'Personnel',
    '内容': 'Content',
    '结果': 'Result',
    '问题': 'Problem',
    '解决方案': 'Solution',
    '计划': 'Plan',
    '目标': 'Goal',
    '成功': 'Success',
    '失败': 'Failure',
    '开始': 'Start',
    '结束': 'End',
    '继续': 'Continue',
    '停止': 'Stop',
    '重要': 'Important',
    '紧急': 'Urgent',
    '普通': 'Normal',
    '简单': 'Simple',
    '复杂': 'Complex',
    '容易': 'Easy',
    '困难': 'Difficult',
    '快速': 'Fast',
    '缓慢': 'Slow',
    '大': 'Big',
    '小': 'Small',
    '多': 'Many',
    '少': 'Few',
    '好': 'Good',
    '坏': 'Bad',
    '新': 'New',
    '旧': 'Old',
    '高': 'High',
    '低': 'Low',
    '长': 'Long',
    '短': 'Short',
    '宽': 'Wide',
    '窄': 'Narrow',
    '深': 'Deep',
    '浅': 'Shallow',
    '热': 'Hot',
    '冷': 'Cold',
    '暖': 'Warm',
    '凉': 'Cool',
    '干': 'Dry',
    '湿': 'Wet',
    '亮': 'Bright',
    '暗': 'Dark',
    '清楚': 'Clear',
    '模糊': 'Unclear',
    '正确': 'Correct',
    '错误': 'Wrong',
    '真': 'True',
    '假': 'False',
    '是': 'Yes',
    '不是': 'No',
    '有': 'Have',
    '没有': 'Don\'t have',
    '可以': 'Can',
    '不可以': 'Cannot',
    '应该': 'Should',
    '不应该': 'Should not',
    '必须': 'Must',
    '不必': 'Need not',
    '想要': 'Want',
    '不想': 'Don\'t want',
    '喜欢': 'Like',
    '不喜欢': 'Don\'t like',
    '需要': 'Need',
    '不需要': 'Don\'t need',
    '希望': 'Hope',
    '担心': 'Worry',
    '高兴': 'Happy',
    '难过': 'Sad',
    '生气': 'Angry',
    '害怕': 'Afraid',
    '惊讶': 'Surprised',
    '兴奋': 'Excited',
    '紧张': 'Nervous',
    '放松': 'Relaxed',
    '累': 'Tired',
    '饿': 'Hungry',
    '渴': 'Thirsty',
    '饱': 'Full',
    '健康': 'Healthy',
    '生病': 'Sick',
    '疼': 'Pain',
    '舒服': 'Comfortable',
    '不舒服': 'Uncomfortable'
  },
  'zh-zh-tw': {
    '综合练习': '綜合練習',
    '请听小朋友们介绍各自想承担的班级工作三次': '請聽小朋友們介紹各自想承擔的班級工作三次',
    '按介绍的顺序将人物与对应的工作连线': '按介紹的順序將人物與對應的工作連線',
    '你好': '你好',
    '谢谢': '謝謝',
    '再见': '再見',
    '早上好': '早上好',
    '下午好': '下午好',
    '晚上好': '晚上好',
    '欢迎': '歡迎',
    '会议': '會議',
    '讨论': '討論',
    '项目': '項目',
    '工作': '工作',
    '学习': '學習',
    '今天': '今天',
    '明天': '明天',
    '昨天': '昨天',
    '时间': '時間',
    '地点': '地點',
    '人员': '人員',
    '内容': '內容',
    '结果': '結果',
    '问题': '問題',
    '解决方案': '解決方案',
    '计划': '計劃',
    '目标': '目標',
    '成功': '成功',
    '失败': '失敗',
    '开始': '開始',
    '结束': '結束',
    '继续': '繼續',
    '停止': '停止',
    '重要': '重要',
    '紧急': '緊急',
    '普通': '普通',
    '简单': '簡單',
    '复杂': '複雜',
    '容易': '容易',
    '困难': '困難',
    '快速': '快速',
    '缓慢': '緩慢'
  },
  'zh-es': {
    '你好': 'Hola',
    '谢谢': 'Gracias',
    '再见': 'Adiós',
    '早上好': 'Buenos días',
    '下午好': 'Buenas tardes',
    '晚上好': 'Buenas noches',
    '欢迎': 'Bienvenido',
    '会议': 'Reunión',
    '工作': 'Trabajo',
    '学习': 'Estudiar',
    '今天': 'Hoy',
    '明天': 'Mañana',
    '昨天': 'Ayer',
    '时间': 'Tiempo',
    '地点': 'Lugar',
    '好': 'Bueno',
    '坏': 'Malo',
    '大': 'Grande',
    '小': 'Pequeño',
    '是': 'Sí',
    '不是': 'No'
  },
  'zh-fr': {
    '你好': 'Bonjour',
    '谢谢': 'Merci',
    '再见': 'Au revoir',
    '早上好': 'Bonjour',
    '下午好': 'Bon après-midi',
    '晚上好': 'Bonsoir',
    '欢迎': 'Bienvenue',
    '会议': 'Réunion',
    '工作': 'Travail',
    '学习': 'Étudier',
    '今天': 'Aujourd\'hui',
    '明天': 'Demain',
    '昨天': 'Hier',
    '时间': 'Temps',
    '地点': 'Lieu',
    '好': 'Bon',
    '坏': 'Mauvais',
    '大': 'Grand',
    '小': 'Petit',
    '是': 'Oui',
    '不是': 'Non'
  },
  'zh-de': {
    '你好': 'Hallo',
    '谢谢': 'Danke',
    '再见': 'Auf Wiedersehen',
    '早上好': 'Guten Morgen',
    '下午好': 'Guten Tag',
    '晚上好': 'Guten Abend',
    '欢迎': 'Willkommen',
    '会议': 'Besprechung',
    '工作': 'Arbeit',
    '学习': 'Lernen',
    '今天': 'Heute',
    '明天': 'Morgen',
    '昨天': 'Gestern',
    '时间': 'Zeit',
    '地点': 'Ort',
    '好': 'Gut',
    '坏': 'Schlecht',
    '大': 'Groß',
    '小': 'Klein',
    '是': 'Ja',
    '不是': 'Nein'
  },
  'zh-ja': {
    '你好': 'こんにちは',
    '谢谢': 'ありがとう',
    '再见': 'さようなら',
    '早上好': 'おはよう',
    '下午好': 'こんにちは',
    '晚上好': 'こんばんは',
    '欢迎': 'いらっしゃいませ',
    '会议': '会議',
    '工作': '仕事',
    '学习': '勉強',
    '今天': '今日',
    '明天': '明日',
    '昨天': '昨日',
    '时间': '時間',
    '地点': '場所',
    '好': '良い',
    '坏': '悪い',
    '大': '大きい',
    '小': '小さい',
    '是': 'はい',
    '不是': 'いいえ'
  },
  'zh-ko': {
    '你好': '안녕하세요',
    '谢谢': '감사합니다',
    '再见': '안녕히 가세요',
    '早上好': '좋은 아침',
    '下午好': '좋은 오후',
    '晚上好': '좋은 저녁',
    '欢迎': '환영합니다',
    '会议': '회의',
    '工作': '일',
    '学习': '공부',
    '今天': '오늘',
    '明天': '내일',
    '昨天': '어제',
    '时间': '시간',
    '地点': '장소',
    '好': '좋다',
    '坏': '나쁘다',
    '大': '크다',
    '小': '작다',
    '是': '네',
    '不是': '아니요',
    '综合练习': '종합 연습',
    '请听小朋友们介绍各自想承担的班级工作三次': '아이들이 각자 맡고 싶은 반 일을 소개하는 것을 세 번 들어보세요',
    '按介绍的顺序将人物与对应的工作连线': '소개 순서에 따라 인물과 해당 일을 연결하세요',
    '我想帮忙整理书籍': '저는 책 정리를 도와드리고 싶습니다',
    '我想帮助大家排队': '저는 모든 사람이 줄을 서는 것을 도와드리고 싶습니다',
    '我想为同学们分发食物': '저는 동급생들에게 음식을 나누어주고 싶습니다',
    '我想分发试卷': '저는 시험지를 나누어주고 싶습니다',
    '我想在离开教室时帮忙关灯': '저는 교실을 떠날 때 불을 끄는 것을 도와드리고 싶습니다'
  }
};

export async function POST(req: NextRequest) {
  try {
    const { text, targetLang, sourceLang } = await req.json();

    if (!text) {
      return NextResponse.json({ error: '没有提供要翻译的文本' }, { status: 400 });
    }

    // 标准化语言代码
    const standardizeLanguageCode = (lang: string): string => {
      const languageMapping: { [key: string]: string } = {
        'chinese': 'zh',
        'english': 'en',
        'japanese': 'ja',
        'korean': 'ko',
        'spanish': 'es',
        'french': 'fr',
        'german': 'de',
        'russian': 'ru',
        'arabic': 'ar',
        'hindi': 'hi',
        'portuguese': 'pt',
        'italian': 'it',
        'thai': 'th',
        'vietnamese': 'vi'
      };
      return languageMapping[lang.toLowerCase()] || lang;
    };

    const standardSourceLang = standardizeLanguageCode(sourceLang);
    const standardTargetLang = standardizeLanguageCode(targetLang);

    console.log('🔄 翻译API语言标准化:');
    console.log('原始:', `${sourceLang} -> ${targetLang}`);
    console.log('标准化:', `${standardSourceLang} -> ${standardTargetLang}`);

    // 语言映射
    const languageMap: { [key: string]: string } = {
      'en': '英语',
      'zh': '中文简体',
      'zh-tw': '中文繁体',
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

    const sourceLangName = languageMap[standardSourceLang] || standardSourceLang;
    const targetLangName = languageMap[standardTargetLang] || standardTargetLang;

    console.log('🔍 检查XAI_API_TOKEN:', XAI_API_TOKEN ? '已配置' : '未配置');

    // 如果没有配置XAI API Token，使用内置翻译字典
    if (!XAI_API_TOKEN) {
      console.log('🔄 使用内置翻译字典');
      console.log('📝 原文:', text);
      console.log('🔤 翻译方向:', `${standardSourceLang} -> ${standardTargetLang}`);
      
      const translationKey = `${standardSourceLang}-${standardTargetLang}`;
      const dictionary = builtInTranslations[translationKey];
      
      if (dictionary) {
        // 改进的翻译逻辑：支持分词和部分匹配
        let translatedText = text;
        
        // 首先尝试完整匹配
        if (dictionary[text.trim()]) {
          translatedText = dictionary[text.trim()];
          console.log('✅ 完整匹配翻译:', translatedText);
        } else {
          // 如果是中文，尝试分词翻译
          if (standardSourceLang === 'zh') {
            // 简单的中文分词：按标点符号和空格分割
            const sentences = text.split(/[，。！？；：、\s]+/).filter(s => s.trim());
            const translatedSentences = sentences.map(sentence => {
              const trimmed = sentence.trim();
              if (dictionary[trimmed]) {
                console.log(`🔍 找到翻译: "${trimmed}" -> "${dictionary[trimmed]}"`);
                return dictionary[trimmed];
              }
              
              // 尝试词汇级别的翻译
              let wordTranslated = trimmed;
              for (const [chinese, translation] of Object.entries(dictionary)) {
                if (trimmed.includes(chinese)) {
                  wordTranslated = wordTranslated.replace(chinese, translation);
                  console.log(`🔍 词汇替换: "${chinese}" -> "${translation}"`);
                }
              }
              return wordTranslated;
            });
            
            translatedText = translatedSentences.join(' ');
            console.log('📝 分词翻译结果:', translatedText);
          } else {
            // 对于其他语言，尝试词汇级别的替换
            for (const [original, translation] of Object.entries(dictionary)) {
              if (text.includes(original)) {
                translatedText = translatedText.replace(new RegExp(original, 'g'), translation);
                console.log(`🔍 词汇替换: "${original}" -> "${translation}"`);
              }
            }
          }
        }
        
        console.log('✅ 内置字典翻译完成');
        return NextResponse.json({ 
          translation: translatedText,
          sourceLang: sourceLangName,
          targetLang: targetLangName,
          method: 'built-in-dictionary'
        });
      } else {
        console.log('❌ 不支持的翻译方向:', translationKey);
        return NextResponse.json({ 
          error: `暂不支持从${sourceLangName}到${targetLangName}的翻译`,
          suggestion: '请配置XAI_API_TOKEN以使用AI翻译服务',
          availableTranslations: Object.keys(builtInTranslations)
        }, { status: 400 });
      }
    }

    // 使用XAI API进行翻译
    console.log('🤖 使用XAI API翻译');
    
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

    console.log('✅ XAI API翻译完成');
    return NextResponse.json({ 
      translation,
      sourceLang: sourceLangName,
      targetLang: targetLangName,
      method: 'xai-api'
    });

  } catch (error) {
    console.error('翻译API错误:', error);
    return NextResponse.json({ 
      error: '翻译服务内部错误' 
    }, { status: 500 });
  }
} 