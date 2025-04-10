import fs from "fs";
import path from "path";

export interface Education {
  title: string;
  category: string;
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  description: string;
  topics: string[];
}

export function readEducationData(): Education[] {
  try {
    const filePath = path.join(process.cwd(), "lib", "educations.csv");
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const lines = fileContent.split("\n").slice(1); // Skip header

    return lines
      .filter((line) => line.trim())
      .map((line) => {
        const [title, category, duration, level, description, topics] = line.split("|").map((item) => item.trim());
        return {
          title,
          category,
          duration,
          level: level as "Beginner" | "Intermediate" | "Advanced",
          description,
          topics: topics.split(",").map((topic) => topic.trim())
        };
      });
  } catch (error) {
    console.error("Error reading education data:", error);
    return [];
  }
}
