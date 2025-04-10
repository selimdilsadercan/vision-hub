import fs from "fs";
import path from "path";

export interface SkillsByCategory {
  [key: string]: {
    [key: string]: string[];
  };
}

export function readSkillsData(): SkillsByCategory {
  try {
    const filePath = path.join(process.cwd(), "lib", "skills.csv");
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const lines = fileContent.split("\n").slice(1); // Skip header

    const skillsMap: SkillsByCategory = {};

    lines.forEach((line) => {
      const [category, skill, microSkill] = line.split("|");
      if (!category || !skill || !microSkill) return;

      if (!skillsMap[category]) {
        skillsMap[category] = {};
      }
      if (!skillsMap[category][skill]) {
        skillsMap[category][skill] = [];
      }
      skillsMap[category][skill].push(microSkill.trim());
    });

    return skillsMap;
  } catch (error) {
    console.error("Error reading skills data:", error);
    return {};
  }
}
