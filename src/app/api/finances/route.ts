import { NextResponse } from "next/server";
import { getFinancesData } from "@/lib/data";

export async function GET() {
  const data = getFinancesData();
  return NextResponse.json(data);
}
