import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const replicateToken = process.env.REPLICATE_API_TOKEN;
    const xaiToken = process.env.XAI_API_TOKEN;
    
    return NextResponse.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      replicateTokenExists: !!replicateToken,
      xaiTokenExists: !!xaiToken,
      replicateTokenLength: replicateToken ? replicateToken.length : 0,
      xaiTokenLength: xaiToken ? xaiToken.length : 0,
      replicatePrefix: replicateToken ? replicateToken.substring(0, 8) + '...' : 'NOT_FOUND',
      xaiPrefix: xaiToken ? xaiToken.substring(0, 8) + '...' : 'NOT_FOUND',
    });
  } catch (error) {
    return NextResponse.json({
      status: 'ERROR',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}

export async function POST() {
  return NextResponse.json({ message: 'POST method works!' });
} 