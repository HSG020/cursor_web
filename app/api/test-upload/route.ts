import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    console.log('🧪 测试上传端点被调用');
    console.log('Content-Type:', req.headers.get('content-type'));
    
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const language = formData.get('language') as string;
    
    return NextResponse.json({
      status: 'success',
      message: '文件上传测试成功',
      fileInfo: {
        name: file?.name || 'unknown',
        size: file?.size || 0,
        type: file?.type || 'unknown'
      },
      language: language || 'auto',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ 测试上传错误:', error);
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : '未知错误',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 