// pages/api/systemInfo.js
import os from "os";
import { exec as _exec } from "child_process";
import { promisify } from "util";

const exec = promisify(_exec);

export default async function handler(req, res) {
  const { type } = req.query;

  if (type === "hostname") {
    return res.status(200).json({ hostname: os.hostname() });
  }

  if (type === "sysInfo") {
    const networks = os.networkInterfaces();
    let primaryNetwork = null;

    for (const [ifaceName, entries] of Object.entries(networks)) {
      for (const entry of entries) {
        if (entry.family === "IPv4" && !entry.internal) {
          primaryNetwork = { iface: ifaceName, ...entry };
          break;
        }
      }
      if (primaryNetwork) break;
    }

    // PowerShell commands
    const cpuCommand = `powershell -Command "Get-WmiObject Win32_Processor | Select-Object -First 1 Name,NumberOfCores,NumberOfLogicalProcessors,MaxClockSpeed | ConvertTo-Json -Depth 2"`;
    const diskCommand = `powershell -Command "Get-PhysicalDisk | Select-Object -First 1 Model, MediaType | ConvertTo-Json -Depth 2"`;
    const diskSpaceCommand = `powershell -Command "Get-WmiObject -Class Win32_LogicalDisk | select-object FreeSpace, Size | ConvertTo-Json"`;

    try {
      // Run commands concurrently
      const [cpuOut, diskOut, diskSpaceOut] = await Promise.all([
        exec(cpuCommand),
        exec(diskCommand),
        exec(diskSpaceCommand)
      ]);

      // Parse outputs
      let cpuInfo = JSON.parse(cpuOut.stdout);
      let diskInfo = JSON.parse(diskOut.stdout);
      let diskSpace = JSON.parse(diskSpaceOut.stdout);

      // Flatten arrays if nested
      cpuInfo = Array.isArray(cpuInfo[0]) ? cpuInfo[0] : cpuInfo;
      diskInfo = Array.isArray(diskInfo[0]) ? diskInfo[0] : diskInfo;
      diskSpace = Array.isArray(diskSpace[0]) ? diskSpace[0] : diskSpace;

      res.status(200).json({
        platform: os.version(),
        arch: os.arch(),
        upTime: os.uptime(),
        cpuInfo: cpuInfo,
        totalMem: os.totalmem(),
        freeMem: os.freemem(),
        networkInfo: primaryNetwork,
        diskInfo: diskInfo,
        diskSpace: diskSpace
      });

    } catch (err) {
      console.error("PowerShell fetch failed:", err);
      res.status(500).json({ error: "Failed to fetch system info" });
    }

    return;
  }

  res.status(400).json({ error: "Invalid type parameter" });
}
