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
};

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

import Image from "next/image";

import { setDefaultAutoSelectFamily } from "net";
import { useState, useEffect } from "react";
import { playBeep } from "./audioRender";

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
        <div className="info-columns-container">
          {diskPlatform.map((drive, index) => (
            <div key={index} className="info-column-syst">
              <div className="dropdown">
                <button className="dropbtn" onClick={() => playBeep()}>Drive Information</button>
                <div className="dropdown-content">
                  <p><strong>Drive Name:</strong> {drive.Name}</p>
                  <p><strong>Drive Root:</strong> {drive.Root}</p>
                  <p><strong>Free Space (GB):</strong> {(drive.Free / (1024 ** 3)).toFixed(2)}</p>
                  <p><strong>Used Space (GB):</strong> {(drive.Used / (1024 ** 3)).toFixed(2)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
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



export const FileSystemPanel = ({
  currentPath,
  setCurrentPath,
  setCurrentPanel,
}: {
  currentPath: string;
  setCurrentPath: (path: string) => void;
  setCurrentPanel: (panel: string) => void;
}) => {
  const [currentLoc, setCurrentLoc] = useState<fileHandler | null>(null);

  const fetchFiles = (pathToFetch: string) => {
    fetch(`/api/fileAPI?targetDir=${encodeURIComponent(pathToFetch)}`)
      .then(res => res.json())
      .then(data => setCurrentLoc(data))
      .catch(err => console.error("Failed to fetch file info:", err));
  };

  useEffect(() => {
    fetchFiles(currentPath);
  }, [currentPath]);

  const handleFolderClick = (item: subDirectory) => {
    if (item.type === "Directory") {
      setCurrentPath(item.path);
    }
  };

  const handleFileClick = (item: subDirectory) => {
    if (item.type !== "Directory") {
      fetch(`/api/openFile?path=${encodeURIComponent(item.path)}`);
  }
  };

  let parent = currentPath.split("\\").slice(0, -1).join("\\");
  if (/^[A-Z]:$/i.test(parent)) {
    parent += "\\";
  }

  return (
    <div>
      <h2>Current Directory: {currentPath}</h2>

      <button
        onClick={() => {
          const isDriveRoot = /^[A-Z]:\\$/i.test(currentPath);

          if (isDriveRoot) {
            setCurrentPanel("driveSelection");
          } else {
            setCurrentPath(parent);
          }

          playBeep();
        }}
      >
        Up One Folder
      </button>

      <div className="fileSysBox">
        {currentLoc?.children.map((item, i) => (
          <div
            key={i}
            style={{ border: "1px solid #ccc", padding: "8px", margin: "4px", width: "150px", cursor: "pointer" }}
            onClick={() =>
              item.type === "Directory"
                ? handleFolderClick(item)
                : handleFileClick(item)
            }
          >
            <strong>{item.name}</strong>
            <p>{item.type}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export const FileSystemApp = () => {
  const [currentPanel, setCurrentPanel] = useState("driveSelection");
  const [currentPath, setCurrentPath] = useState("C:\\"); // initial path

  return (
    <>
      {currentPanel === "driveSelection" && (
        <DriveSelectionScreen
          setCurrentPanel={setCurrentPanel}
          setCurrentPath={setCurrentPath} // pass path setter
        />
      )}

      {currentPanel === "fileSystem" && (
        <FileSystemPanel
          currentPath={currentPath} // pass current path
          setCurrentPath={setCurrentPath} // allow navigation
          setCurrentPanel={setCurrentPanel}
        />
      )}
    </>
  );
};



export const DriveSelectionScreen = ({
  setCurrentPanel,
  setCurrentPath,
}: {
  setCurrentPanel: (panel: string) => void;
  setCurrentPath: (path: string) => void;
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
          <h1>Drive Selection Screen</h1>
          <h2>Available Drives:</h2>

          <div className="info-columns-container">
          {driveList.map((drive, index) => (
            <div key={index} className="info-column-syst">
              <p><strong>Drive Name:</strong> {drive.Name}</p>
              <p><strong>Drive Root:</strong> {drive.Root}</p>
              <button className='dropbtn' onClick={() => {
                setCurrentPath(drive.Root);
                setCurrentPanel("fileSystem");
                playBeep();
              }}>
              Open Drive
              </button>
            </div>
          ))}
        </div>
        </div>
    ) : (
      <p>Obtaining Drive Information...</p>
    )}
  </div>
  );
};


