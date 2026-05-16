import { NextResponse } from "next/server";
import { getProjectsData } from "@/lib/data";

export async function GET() {
  const data = getProjectsData();
  return NextResponse.json(data);
}
