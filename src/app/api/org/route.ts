import { NextResponse } from "next/server";
import { getOrgData } from "@/lib/data";

export async function GET() {
  const data = getOrgData();
  return NextResponse.json(data);
}
