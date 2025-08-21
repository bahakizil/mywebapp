import { NextRequest, NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

export async function GET(request: NextRequest) {
  try {
    // CV dosyasının path'i - public klasöründen al
    const cvPath = join(process.cwd(), 'public', 'BAHA_KIZIL_CV.pdf');
    
    console.log('📄 Attempting to serve CV from:', cvPath);
    
    // Dosya var mı kontrol et
    try {
      const fileBuffer = readFileSync(cvPath);
      console.log('✅ CV file found, size:', fileBuffer.length, 'bytes');
      
      return new NextResponse(fileBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'inline; filename="Baha_Kizil_CV.pdf"', // Changed to inline to view in browser
          'Content-Length': fileBuffer.length.toString(),
          'Cache-Control': 'public, max-age=3600',
        },
      });
    } catch (fileError) {
      console.error('❌ CV file not found:', fileError);
      
      // Return error instead of fallback
      return NextResponse.json(
        { 
          error: 'CV file not found',
          message: 'Please contact the administrator to upload the CV file.',
          path: cvPath 
        },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('❌ Error serving CV:', error);
    return NextResponse.json(
      { error: 'Failed to download CV' },
      { status: 500 }
    );
  }
} 