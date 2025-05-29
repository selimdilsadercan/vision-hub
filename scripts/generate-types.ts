// scripts/generate-types.ts
const { execSync } = require("child_process");
const fs = require("fs");

const output = execSync(`npx supabase gen types typescript --project-id ceyufcdjltcefofcjgth --schema public`).toString("utf-8");

fs.writeFileSync("lib/supabase-types.ts", output, "utf-8");
console.log("✔ Supabase types generated.");
