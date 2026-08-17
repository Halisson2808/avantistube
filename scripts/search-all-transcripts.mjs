import { readdirSync, readFileSync, existsSync } from "fs";
import { join } from "path";

const userProfile = process.env.USERPROFILE || "C:\\Users\\Usuário";
const brainDir = join(userProfile, ".gemini", "antigravity-ide", "brain");

console.log("Searching all conversation transcripts in brainDir:", brainDir);

if (existsSync(brainDir)) {
  const convs = readdirSync(brainDir);
  for (const cid of convs) {
    const logPath = join(brainDir, cid, ".system_generated", "logs", "transcript.jsonl");
    if (existsSync(logPath)) {
      try {
        const lines = readFileSync(logPath, "utf-8").split("\n");
        for (let i = 0; i < lines.length; i++) {
          const l = lines[i];
          if (!l) continue;
          if (
            l.includes("otpauth") ||
            l.includes("secret2fa") ||
            l.includes("backupCodes") ||
            l.includes("10 Códigos de Backup") ||
            l.includes("senha mestra") ||
            l.includes("avantistube_vault")
          ) {
            console.log(`\nFound match in conversation ${cid} at line ${i}:`);
            // Print snippet
            try {
              const parsed = JSON.parse(l);
              console.log("Content:", parsed.content || JSON.stringify(parsed).substring(0, 500));
            } catch {
              console.log(l.substring(0, 500));
            }
          }
        }
      } catch (e) {}
    }
  }
}
