"use client"; // required if using Next.js app directory

type networkInfo = {
  iface: string;
  address: string;
  netmask: number;
  family: string;
  mac: string;
  internal: boolean;
  scopeid: number;
  cidr: string;
};

type CpuInfo = {
  Name: string;
  NumberOfCores: number;
  NumberOfLogicalProcessors: number;
  MaxClockSpeed: number;
};

type diskInfo = {
  Model: string;
  MediaType: string;
};

type diskSpace = {
  FreeSpace: number;
  Size: number;
}

type systemPlatform = {
  platform: string;
  arch: string;
  upTime: number;
  cpuInfo: CpuInfo;  // ← add this
  networkInfo: networkInfo;  // ← add this
  totalMem: number;
  freeMem: number;
};

type diskPlatform = {
  diskInfo: diskInfo;
  diskSpace: diskSpace;
}

import { setDefaultAutoSelectFamily } from "net";
import { exit } from "process";
import { useState, useEffect } from "react";
import { cursorTo } from "readline";
import { CpuChart } from "./cpuChart";

export const AboutSystemPanel = () => {
  const [systemPlatform, setSystemPlatform] = useState<systemPlatform | null>(null);

  useEffect(() => {
    fetch("/api/sysInfo?type=sysInfo") // adjust query or endpoint as needed
      .then((res) => res.json())
      .then((data) => setSystemPlatform(data))
      .catch((err) => console.error("Failed to fetch system info:", err));
  }, []);

  return (
    <div className="panel fade-in">
      <h1>About Screen</h1>
      {systemPlatform ? (
        <div>
          <div> 
            <h2>System Information</h2>
            <p>Platform: {systemPlatform.platform}</p>
            <p>Architecture: {systemPlatform.arch}</p>
            <p>UpTime (Hrs): {(systemPlatform.upTime / (60 ** 2)).toFixed(2)}</p>
            <p>Total Memory (GB): {(systemPlatform.totalMem / (1024 ** 3)).toFixed(2)}</p>
            <p>Free Memory (GB): {(systemPlatform.freeMem / (1024 ** 3)).toFixed(2)}</p>
          </div>

          <div>
            <h2>Wi-Fi Information</h2>
            <p>Interface: {systemPlatform.networkInfo.iface}</p>
            <p>IP Address: {systemPlatform.networkInfo.address}</p>
            <p>Subnet Mask: {systemPlatform.networkInfo.netmask}</p>
            <p>Family: {systemPlatform.networkInfo.family}</p>
            <p>MAC: {systemPlatform.networkInfo.mac}</p>
          </div>

          <div>
            <h2>CPU Info</h2>
                <p>Processor Type: {systemPlatform.cpuInfo.Name} MHz</p>
                <p>Core Count: {systemPlatform.cpuInfo.NumberOfCores} MHz</p>
                <p>Thread Count: {systemPlatform.cpuInfo.NumberOfLogicalProcessors} MHz</p>
                <p>Max Clock Speed: {systemPlatform.cpuInfo.MaxClockSpeed} MHz</p>
          </div>

        </div>
      ) : (
        <p>Loading system information...</p>
      )}
    </div>
  );
};


export const FileSystemPanel = () => (
  <div className="panel fade-in">
    <h1>File System</h1>
    <p>Dynamic file system content goes here.</p>
  </div>
);

export const HomePanel = () => (
  <div className="panel fade-in">
    <h1>HomeScreen</h1>
  </div>
);


// Adolfo - Settings Panel

function exitPrompt() {
  let exit = confirm("Are you sure you want to exit?");
  if(exit)
    window.close();
}


export const SettingsPanel = () => (
  <div className="panel fade-in">
    <h1>Settings Panel</h1>

    {/* Container for top two divs, two columns */}
      <div className="settingsPanelContainer">

        {/* Top left div, settings */}
        <div className="box settingsBox">
          <h2>Settings</h2>
          <p>Volume slider, brightness slider, theme selection</p>

          {/* Indicates current settings values */}
          <div className="settingsIndicator">
            
          </div>
        </div>

        {/* Top right div, CLI settings */}
        <div className="box cliBox">
          <h2>PowerShell CLI</h2>
          <img src="/terminal.gif" alt="Terminal"></img>
        </div>
      </div>

      {/* Bottom div, long bar with system info graphs */}
      <div className="box infoBox">
        <h2>System Data</h2>
        <div className="infoContainer">

          {/* Container for chart.js graph showing CPU usage! */}
          <div className="cpuGraph">
            <CpuChart />
          </div>

          {/* Container for chart.js graph showing what's on the disk! */}
          <div className="diskGraph"></div>

          {/* Container for quick action buttons */}
          <div className="options">
            <button className="Console Log">Log to Console</button>
            <button className="reloadButton" onClick={() => window.location.reload()}>Reload</button> 
            <button className="quitButton" onClick={exitPrompt}>Quit</button>
          </div>
        </div>
    </div>
  </div>
);

export const DiskPanel = () => {
  const [diskPlatform, setSystemPlatform] = useState<diskPlatform | null>(null);

  useEffect(() => {
    fetch("/api/diskInfo") // adjust query or endpoint as needed
      .then((res) => res.json())
      .then((data) => setSystemPlatform(data))
      .catch((err) => console.error("Failed to fetch system info:", err));
  }, []);

  return(
    <div className="panel fade-in">
      <h1>Disk Screen</h1>
      {diskPlatform ? (
        <div>
          <h2>Disk Info</h2>
          <p>Disk Model: {diskPlatform.diskInfo.Model}</p>
          <p>Storage Type: {diskPlatform.diskInfo.MediaType}</p>
          <p>Free System Space (GB): {(diskPlatform.diskSpace.FreeSpace / (1024 ** 3)).toFixed(2)}</p>
          <p>Total Disk Size (GB): {(diskPlatform.diskSpace.Size / (1024 ** 3)).toFixed(2)}</p>
        </div>
      ) : (
        <p>Loading system information...</p>
      )}
    </div>
  );
};

