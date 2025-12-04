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



import Image from "next/image";

import { setDefaultAutoSelectFamily } from "net";
import { useState, useEffect } from "react";
import { playBeep } from "./audioRender";




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
        <div className="info-columns-container">
          <div className="info-column-syst">
            <div className="dropdown">
            <button className="dropbtn" onClick={() => playBeep()}> System Information</button>
            <div className="dropdown-content">
            <p>Platform: {systemPlatform.platform}</p>
            <p>Architecture: {systemPlatform.arch}</p>
            <p>UpTime (Hrs): {(systemPlatform.upTime / (60 ** 2)).toFixed(2)}</p>
            <p>Total Memory (GB): {(systemPlatform.totalMem / (1024 ** 3)).toFixed(2)}</p>
            <p>Free Memory (GB): {(systemPlatform.freeMem / (1024 ** 3)).toFixed(2)}</p>
            </div>
          </div>
          </div>

          <div className="info-column">
            <div className="dropdown">
              <button className="dropbtn" onClick={() => playBeep()}>Wi-Fi Information</button>
                <div className="dropdown-content">
            <p>Interface: {systemPlatform.networkInfo.iface}</p>
            <p>IP Address: {systemPlatform.networkInfo.address}</p>
            <p>Subnet Mask: {systemPlatform.networkInfo.netmask}</p>
            <p>Family: {systemPlatform.networkInfo.family}</p>
            <p>MAC: {systemPlatform.networkInfo.mac}</p>
                </div>
            </div>
          </div>

          <div className="info-column">
            <div className="dropdown">
              <button className="dropbtn" onClick={() => playBeep()}>CPU Information</button>
                <div className="dropdown-content">
                <p>Processor Type: {systemPlatform.cpuInfo.Name} MHz</p>
                <p>Core Count: {systemPlatform.cpuInfo.NumberOfCores} MHz</p>
                <p>Thread Count: {systemPlatform.cpuInfo.NumberOfLogicalProcessors} MHz</p>
                <p>Max Clock Speed: {systemPlatform.cpuInfo.MaxClockSpeed} MHz</p>
                </div>
          </div>
          </div>
        </div>


      ) : (
        <p>Loading system information...</p>
      )}
    </div>
    
  );
};


export const FileSystemPanel = () => (
  <div className="panel fade-in" >
    <h1>File System</h1>
    <p>Dynamic file system content goes here.</p>
  </div>
);

export const HomePanel = () => (
  <div className="panel fade-in">
    <h1>Home Screen</h1>
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
        <div className="info-columns-container">
          <div className="info-column-syst">
            <div className="dropdown">
          <button className="dropbtn"onClick={() => playBeep()}> Disk Information</button>
          <div className="dropdown-content">
          <p>Disk Model: {diskPlatform.diskInfo.Model}</p>
          <p>Storage Type: {diskPlatform.diskInfo.MediaType}</p>
          <p>Free System Space (GB): {(diskPlatform.diskSpace.FreeSpace / (1024 ** 3)).toFixed(2)}</p>
          <p>Total Disk Size (GB): {(diskPlatform.diskSpace.Size / (1024 ** 3)).toFixed(2)}</p>
          </div>
        </div>
        </div>
        </div>
        

     
      )  : (
        <p>Loading system information...</p>
      )}
    </div>
  );
};

