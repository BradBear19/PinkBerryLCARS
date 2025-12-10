import { exec as _exec } from "child_process";
import { promisify } from "util";

const exec = promisify(_exec);

export default async function handler(req, res) {
  try {
    const { sourceDir, targetDir } = req.query;

    if (!targetDir || !sourceDir) {
      return res.status(400).json({ error: "Missing Target/Source query parameter" });
    }

    console.log("Source:", sourceDir);
    console.log("Destination:", targetDir);

    const copyCommand = `powershell -Command "Copy-Item -Path '${sourceDir}' -Destination '${targetDir}' -Force"`;

    await exec(copyCommand);

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error("File API execution failed:", err);
    return res.status(500).json({ error: "Failed to copy file", details: err.message });
  }
}
