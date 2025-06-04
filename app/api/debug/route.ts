import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    const debug = {
      timestamp: new Date().toISOString(),
      status: "VoiceScribe Debug API - Online",
      environment: process.env.NODE_ENV,
      vercel: {
        env: process.env.VERCEL_ENV || 'local',
        url: process.env.VERCEL_URL || 'localhost',
        git_commit_sha: process.env.VERCEL_GIT_COMMIT_SHA || 'unknown',
        git_commit_ref: process.env.VERCEL_GIT_COMMIT_REF || 'unknown',
        region: process.env.VERCEL_REGION || 'unknown',
      },
      apiTokens: {
        replicate: process.env.REPLICATE_API_TOKEN ? 
          `已配置 (${process.env.REPLICATE_API_TOKEN.substring(0, 8)}...)` : 
          '❌ 未配置',
        xai: process.env.XAI_API_TOKEN ? 
          `已配置 (${process.env.XAI_API_TOKEN.substring(0, 8)}...)` : 
          '❌ 未配置',
      },
      platform: {
        node_version: process.version,
        platform: process.platform,
        arch: process.arch,
      },
      headers: {
        host: req.headers.get('host'),
        'user-agent': req.headers.get('user-agent'),
        'x-forwarded-for': req.headers.get('x-forwarded-for'),
        'x-real-ip': req.headers.get('x-real-ip'),
      },
      nextjs: {
        version: "13.5.1",
        runtime: 'nodejs',
      }
    };

    return NextResponse.json(debug, { 
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Content-Type': 'application/json'
      }
    });
  } catch (error: any) {
    console.error('Debug API Error:', error);
    return NextResponse.json({ 
      error: error.message,
      timestamp: new Date().toISOString(),
      status: "Error in Debug API"
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  return NextResponse.json({
    message: "Debug API only supports GET requests",
    timestamp: new Date().toISOString()
  }, { status: 405 });
} 