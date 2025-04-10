import { readEducationData } from "@/lib/educations";
import { NextResponse } from "next/server";

export async function GET() {
  const educations = readEducationData();
  return NextResponse.json(educations);
}
