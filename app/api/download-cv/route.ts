import { NextResponse } from "next/server";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

export const runtime = "nodejs";

export async function GET() {
  const cvPath = join(process.cwd(), "public", "BAHA_KIZIL_CV.pdf");

  if (!existsSync(cvPath)) {
    return NextResponse.json(
      { error: "CV file not found" },
      { status: 404 },
    );
  }

  const buffer = readFileSync(cvPath);
  const body = new Uint8Array(buffer);

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'inline; filename="Baha_Kizil_CV.pdf"',
      "Content-Length": buffer.length.toString(),
      "Cache-Control": "public, max-age=3600",
    },
  });
}
