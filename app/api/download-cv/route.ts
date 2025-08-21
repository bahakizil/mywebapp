import { NextRequest, NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

export async function GET(request: NextRequest) {
  try {
    // CV dosyasının path'i - public klasöründen al
    const cvPath = join(process.cwd(), 'public', 'BAHA_KIZIL_CV.pdf');
    
    // Dosya var mı kontrol et
    try {
      const fileBuffer = readFileSync(cvPath);
      
      return new NextResponse(fileBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename="Baha_Kizil_CV.pdf"',
          'Cache-Control': 'no-cache',
        },
      });
    } catch (fileError) {
      console.error('CV file not found:', fileError);
      
      // Fallback: Mock CV content
      const mockPdfContent = Buffer.from('%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R >>\nendobj\n4 0 obj\n<< /Length 44 >>\nstream\nBT\n/F1 12 Tf\n100 700 Td\n(Baha Kizil - CV) Tj\nET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f\n0000000009 00000 n\n0000000058 00000 n\n0000000115 00000 n\n0000000206 00000 n\ntrailer\n<< /Size 5 /Root 1 0 R >>\nstartxref\n299\n%%EOF');
      
      return new NextResponse(mockPdfContent, {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename="Baha_Kizil_CV.pdf"',
          'Cache-Control': 'no-cache',
        },
      });
    }
  } catch (error) {
    console.error('Error serving CV:', error);
    return NextResponse.json(
      { error: 'Failed to download CV' },
      { status: 500 }
    );
  }
} 