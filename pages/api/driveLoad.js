import { exec as _exec } from "child_process";
import { promisify } from "util";

const exec = promisify(_exec);

export default async function handler(req, res) {

    const cpuCommand = `powershell -Command "Get-PSDrive -PSProvider FileSystem | select-object Name, Root, Free, Used | convertTo-JSON"`;

    try {

    const { stdout } = await exec(cpuCommand);

    const physicalDisk = JSON.parse(stdout);

    return res.status(200).json(physicalDisk);

  } catch (err) {
    console.error("File API execution failed:", err);
    return res.status(500).json({ error: "Failed to fetch file info" });
  }
}