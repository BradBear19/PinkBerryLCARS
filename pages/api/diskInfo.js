// pages/api/systemInfo.js
import { exec as _exec } from "child_process";
import { promisify } from "util";

const exec = promisify(_exec);

export default async function handler(req, res) {

    const diskCommand = `powershell -Command "Get-PhysicalDisk | Select-Object -First 1 Model, MediaType | ConvertTo-Json -Depth 2"`;
    const diskSpaceCommand = `powershell -Command "Get-WmiObject -Class Win32_LogicalDisk | select-object FreeSpace, Size | ConvertTo-Json"`;

    try {
      // Run commands concurrently
      const [diskOut, diskSpaceOut] = await Promise.all([
        exec(diskCommand),
        exec(diskSpaceCommand)
      ]);

      // Parse outputs
      let diskInfo = JSON.parse(diskOut.stdout);
      let diskSpace = JSON.parse(diskSpaceOut.stdout);

      // Flatten arrays if nested
      diskInfo = Array.isArray(diskInfo[0]) ? diskInfo[0] : diskInfo;
      diskSpace = Array.isArray(diskSpace[0]) ? diskSpace[0] : diskSpace;

      res.status(200).json({
        diskInfo: diskInfo,
        diskSpace: diskSpace
      });

    } catch (err) {
      console.error("PowerShell fetch failed:", err);
      res.status(500).json({ error: "Failed to fetch system info" });
    }

    return;
  }
