import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('📡 简单转录API被调用');
    
    // 检查环境变量
    const replicateToken = process.env.REPLICATE_API_TOKEN;
    if (!replicateToken) {
      return NextResponse.json({
        error: 'REPLICATE_API_TOKEN环境变量未设置'
      }, { status: 500 });
    }
    
    // 检查请求
    const contentType = request.headers.get('content-type') || '';
    console.log('📡 Content-Type:', contentType);
    
    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json({
        error: '请求必须是multipart/form-data格式'
      }, { status: 400 });
    }
    
    // 尝试解析FormData
    let formData;
    try {
      formData = await request.formData();
    } catch (error) {
      return NextResponse.json({
        error: '无法解析FormData: ' + (error instanceof Error ? error.message : 'Unknown error')
      }, { status: 400 });
    }
    
    const file = formData.get('file') as File;
    if (!file) {
      return NextResponse.json({
        error: '没有找到音频文件'
      }, { status: 400 });
    }
    
    console.log('📡 收到文件:', file.name, file.size, 'bytes');
    
    // 返回成功响应（暂时不调用实际的转录API）
    return NextResponse.json({
      message: '简单转录API工作正常',
      fileName: file.name,
      fileSize: file.size,
      replicateTokenLength: replicateToken.length,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ 简单转录API错误:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : '未知错误'
    }, { status: 500 });
  }
} 