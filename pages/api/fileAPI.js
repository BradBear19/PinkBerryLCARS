import path from "path";
import { exec as _exec } from "child_process";
import { promisify } from "util";

const exec = promisify(_exec);

export default async function handler(req, res) {
  try {
    const scriptPath = path.join(process.cwd(), "referenceExecutables", "fileGet.js");

    const targetDir = "C:/DatPlayaMentality/ThatOneSnake/ThatFuckingBirdThatIHate";
    const fileCommand = `node "${scriptPath}" "${targetDir}"`;

    const { stdout } = await exec(fileCommand);

    const fileInfo = JSON.parse(stdout);
    return res.status(200).json({ fileInfo });

  } catch (err) {
    console.error("File API execution failed:", err);
    return res.status(500).json({ error: "Failed to fetch file info" });
  }
}
