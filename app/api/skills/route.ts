import { readSkillsData } from "@/lib/skills";
import { NextResponse } from "next/server";

export async function GET() {
  const skills = readSkillsData();
  return NextResponse.json(skills);
}
