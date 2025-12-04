"use client"; // required if using Next.js app directory
import { useState, useEffect } from "react";

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
  cpuInfo: CpuInfo;
  networkInfo: networkInfo; 
  totalMem: number;
  freeMem: number;
};

type diskPlatform = {
  diskInfo: diskInfo;
  diskSpace: diskSpace;
}

type fileHandler = {
  name: string;
  type: string;
  path: string;
  children: subDirectory[];
}

type subDirectory = {
  name: string;
  type: string;
  path: string;
}

type phsyicalDrive = {
  Name: string;
  Root: string;
  Free: number;
  Used: number;
}


export const HomePanel = () => (
  <div className="panel fade-in">
    <h1>Home Screen</h1>
  </div>
);



export const DiskPanel = () => {
  const [diskPlatform, setSystemPlatform] = useState<phsyicalDrive[] | null>(null);

  useEffect(() => {
    fetch("/api/driveLoad") // adjust query or endpoint as needed
      .then((res) => res.json())
      .then((data) => {
         if (Array.isArray(data)) {
         setSystemPlatform(data);
        } else {
          setSystemPlatform([data]);
        }
      })
      .catch((err) => console.error("Failed to fetch system info:", err));
  }, []);

  return (
    <div>
      {diskPlatform && diskPlatform.length > 0 ? (
        <div>
          <h2>Drive Selection Screen</h2>
          <p>Available Drives:</p>

          {diskPlatform.map((drive, index) => (
            <div key={index}>
              <p><strong>Drive Name:</strong> {drive.Name}</p>
              <p><strong>Drive Root:</strong> {drive.Root}</p>
              <p><strong>Free Space (GB):</strong> {(drive.Free / (1024 ** 3)).toFixed(2)}</p>
              <p><strong>Used Space (GB):</strong> {(drive.Used / (1024 ** 3)).toFixed(2)}</p>
            </div>
          ))}
        </div>
    ) : (
      <p>Obtaining Drive Information...</p>
    )}
  </div>
  );
};



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
            <button className="dropbtn"> System Information</button>
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
              <button className="dropbtn">Wi-Fi Information</button>
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
              <button className="dropbtn">CPU Information</button>
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



export const FileSystemPanel = () => {
  const [currentLoc, setCurrentLoc] = useState<fileHandler | null>(null);

  useEffect(() => {
    fetch("/api/fileAPI")
      .then((res) => res.json())
      .then((data) => setCurrentLoc(data.fileInfo))
      .catch((err) => console.error("Failed to fetch system info:", err));
  }, []);

  return (
    <div className="panel fade-in">
      {currentLoc ? (
        <div>
          <h2>File System</h2>
          <p>Current Directory: {currentLoc.name}</p>
          <p>File Type: {currentLoc.type}</p>
          <p>Full Path: {currentLoc.path}</p>

          <h3>Contents</h3>

          <div className="children-container">
            {currentLoc.children && currentLoc.children.length > 0 ? (
              currentLoc.children.map((item, index) => (
                <div key={index} className="file-box">
                  <button>Name: {item.name}</button>
                  <p><strong>Type:</strong> {item.type}</p>
                  <p><strong>Path:</strong> {item.path}</p>
                </div>
              ))
            ) : (
              <p>No items found in this directory.</p>
            )}
          </div>
        </div>
      ) : (
        <p>Retrieving File Info…</p>
      )}
    </div>
  );
};

export const DriveSelectionScreen = ({
  setCurrentPanel,
}: {
  setCurrentPanel: (panel: string) => void;
}) => {
  const [driveList, setDriveList] = useState<phsyicalDrive[] | null>(null);

  useEffect(() => {
    fetch("/api/driveLoad")
      .then((res) => res.json())
      .then((data) => {
         if (Array.isArray(data)) {
         setDriveList(data);
        } else {
          setDriveList([data]);
        }
      })
      .catch((err) => console.error("Failed to fetch system info:", err));
  }, []);

  return (
    <div>
      {driveList && driveList.length > 0 ? (
        <div>
          <h2>Drive Selection Screen</h2>
          <p>Available Drives:</p>

          {driveList.map((drive, index) => (
            <div key={index} className="drive-box">
              <p><strong>Drive Name:</strong> {drive.Name}</p>
              <p><strong>Drive Root:</strong> {drive.Root}</p>

              <button onClick={() => {setCurrentPanel("fileSystem");}}>
              Open Drive
              </button>
            </div>
          ))}
        </div>
    ) : (
      <p>Obtaining Drive Information...</p>
    )}
  </div>
  );
};


