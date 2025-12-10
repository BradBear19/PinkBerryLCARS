import { exec as _exec } from "child_process";
import { promisify } from "util";

const exec = promisify(_exec);

export default async function handler(req, res) {
  try {
    const { targetDir } = req.query;

    if (!targetDir) {
      return res.status(400).json({ error: "Missing targetDir query parameter" });
    }

    console.log("Target to delete:", targetDir);

    const deleteCommand = `powershell -Command "Remove-Item -Path '${targetDir}' -Force"`;

    await exec(deleteCommand);

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error("File API execution failed:", err);
    return res.status(500).json({ error: "Failed to delete file", details: err.message });
  }
}
