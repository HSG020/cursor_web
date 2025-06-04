import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const debug = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      vercel: {
        env: process.env.VERCEL_ENV,
        url: process.env.VERCEL_URL,
        git_commit_sha: process.env.VERCEL_GIT_COMMIT_SHA,
        git_commit_ref: process.env.VERCEL_GIT_COMMIT_REF,
      },
      apiTokens: {
        replicate: process.env.REPLICATE_API_TOKEN ? `已配置 (${process.env.REPLICATE_API_TOKEN.substring(0, 8)}...)` : '未配置',
        xai: process.env.XAI_API_TOKEN ? `已配置 (${process.env.XAI_API_TOKEN.substring(0, 8)}...)` : '未配置',
      },
      headers: Object.fromEntries(req.headers.entries()),
      runtime: 'nodejs',
    };

    return NextResponse.json(debug, { 
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error: any) {
    return NextResponse.json({ 
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 