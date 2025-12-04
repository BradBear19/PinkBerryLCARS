import path from "path";
import { exec as _exec } from "child_process";
import { promisify } from "util";

const exec = promisify(_exec);

export default async function handler(req, res) {
  try {
    const { targetDir } = req.query;

    if (!targetDir) {
      return res.status(400).json({ error: "Missing targetDir query parameter" });
    }

    const scriptPath = path.join(
      process.cwd(),
      "referenceExecutables",
      "fileGet.js"
    );

    console.log("Executing fileGet.js for directory:", targetDir);

    // Escape backslashes for Windows paths
    const safeTarget = targetDir.replace(/\\/g, "\\\\");


    const fileCommand = `node "${scriptPath}" "${safeTarget}"`;

    const { stdout, stderr } = await exec(fileCommand);

    if (stderr) console.error(stderr);

    const fileInfo = JSON.parse(stdout);
    return res.status(200).json(fileInfo);

  } catch (err) {
    console.error("File API execution failed:", err);
    return res.status(500).json({ error: "Failed to fetch file info", details: err.message });
  }
}
