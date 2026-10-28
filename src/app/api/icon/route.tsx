import { ImageResponse } from "next/og";
import { BrandMark } from "@/lib/BrandMark";

export const runtime = "nodejs";

/** PNG app icon for the web manifest: /api/icon?size=192|512. The mark sits inside the maskable safe zone. */
export async function GET(req: Request) {
  const size = new URL(req.url).searchParams.get("size") === "192" ? 192 : 512;
  return new ImageResponse(<BrandMark size={size} />, { width: size, height: size });
}
