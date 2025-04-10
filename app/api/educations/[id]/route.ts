import { readEducationData } from "@/lib/educations";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const educations = readEducationData();
  const education = educations.find((edu) => edu.title === params.id);

  if (!education) {
    return NextResponse.json({ error: "Education not found" }, { status: 404 });
  }

  return NextResponse.json(education);
}
