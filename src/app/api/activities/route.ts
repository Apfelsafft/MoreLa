import { NextResponse } from "next/server";
import { getActivitiesData } from "@/lib/data";

export function GET() {
  return NextResponse.json(getActivitiesData());
}
