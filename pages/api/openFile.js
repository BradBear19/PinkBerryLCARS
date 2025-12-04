import { exec as _exec } from "child_process";
import { promisify } from "util";

const exec = promisify(_exec);

export default async function handler(req, res) {
  try {
    const { path } = req.query;

    if (!path) {
      return res.status(400).json({ error: "Missing path query parameter" });
    }

    // Escape backslashes for Windows
    const safePath = path.replace(/\\/g, "\\\\");

    // PowerShell command to open the file with default app
    const command = `Start-Process "${safePath}"`;

    await exec(command, { shell: "powershell.exe" });

    return res.status(200).send("200");

  } catch (err) {
    console.error("Open file failed:", err);
    return res
      .status(500)
      .json({ error: "Failed to open file", details: err.message });
  }
}
