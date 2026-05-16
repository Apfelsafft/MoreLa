import { NextResponse } from "next/server";
import { getSitePagesData } from "@/lib/data";

export function GET() {
  return NextResponse.json(getSitePagesData());
}
