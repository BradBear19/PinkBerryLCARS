"use client"; // required if using Next.js app directory
import { useState, useEffect } from "react";
import path from "path";

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
  const [currentPath, setCurrentPath] = useState("C:\\"); // initial folder

  const fetchFiles = (pathToFetch) => {
    fetch(`/api/fileAPI?targetDir=${encodeURIComponent(pathToFetch)}`)
      .then(res => res.json())
      .then(data => setCurrentLoc(data))
      .catch(err => console.error("Failed to fetch file info:", err));
  };

  useEffect(() => {
    fetchFiles(currentPath);
  }, [currentPath]);

  const handleFolderClick = (item) => {
    if (item.type === "Directory") {
      setCurrentPath(item.path);
    }
  };
  

  const handleFileClick = (item) => {
    if (item.type === "File") {
      // Open file in-app (see next section)
      const ext = item.name.split(".").pop().toLowerCase();
      if (["png","jpg","jpeg","gif","mp4","webm","ogg"].includes(ext)) {
        setFilePreview(item.path);
      } else {
        alert(`Cannot preview this file type: ${ext}`);
      }
    }
  };

  let parent = currentPath.split("\\").slice(0, -1).join("\\");

  // If the result is just a drive letter, add the backslash
  if (/^[A-Z]:$/i.test(parent)) {
    parent += "\\";
  }

  const [filePreview, setFilePreview] = useState<string | null>(null);

  
  return (
    <div>
      <h2>Current Directory: {currentPath}</h2>
      <button onClick={() => setCurrentPath(parent)}>
        Up One Folder
      </button>

      <div style={{ display: "flex", flexWrap: "wrap", marginTop: "10px" }}>
        {currentLoc?.children.map((item, i) => (
          <div
            key={i}
            style={{
              border: "1px solid #ccc",
              padding: "8px",
              margin: "4px",
              width: "150px",
              cursor: "pointer"
            }}
            onClick={() => item.type === "Directory" ? handleFolderClick(item) : handleFileClick(item)}
          >
            <strong>{item.name}</strong>
            <p>{item.type}</p>
          </div>
        ))}
      </div>

      {filePreview && (
        <div style={{ marginTop: "20px" }}>
          <h3>Preview: {filePreview.split("\\").pop()}</h3>
          {["png","jpg","jpeg","gif"].some(ext => filePreview.endsWith(ext)) && (
            <img src={`file:///${filePreview}`} style={{ maxWidth: "100%" }} />
          )}
          {["mp4","webm","ogg"].some(ext => filePreview.endsWith(ext)) && (
            <video controls style={{ maxWidth: "100%" }}>
              <source src={`file:///${filePreview}`} />
            </video>
          )}
          <button onClick={() => setFilePreview(null)}>Close Preview</button>
        </div>
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


