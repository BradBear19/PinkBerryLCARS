import { exec as _exec } from "child_process";
import { promisify } from "util";

const exec = promisify(_exec);

export default async function handler(req, res) {
  const { type } = req.query;

  // Windows-friendly command
  const scriptPath = "C:/referenceExecutables/fileAPI.js";
  const targetDir = "C:/"; // Or req.query.path

  const fileCommand = `node "${scriptPath}" "${targetDir}"`;

  try {
    const { stdout } = await exec(fileCommand);

    // Parse JSON output
    const fileInfo = JSON.parse(stdout);

    res.status(200).json({ fileInfo });
  } catch (err) {
    console.error("File API execution failed:", err);
    res.status(500).json({ error: "Failed to fetch file info" });
  }
}
