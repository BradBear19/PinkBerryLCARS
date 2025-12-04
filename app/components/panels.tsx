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
import { exit } from "process";
import { useState, useEffect } from "react";
import { cursorTo } from "readline";
import { CpuChart } from "./cpuChart";
import { DiskChart } from "./diskChart";
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

  // If the result is just a drive letter, add the backslash
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

      <div style={{ display: "flex", flexWrap: "wrap", marginTop: "10px" }}>
        <div className="fileSysBox">
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
    </div>
  );
};

// Adolfo - Settings


function exitPrompt() {
  let exit = confirm("Are you sure you want to exit?");
  if(exit)
    window.close();
}

// Settings Panel

// (Adolfo 12/4)
// I'm going for a layout with three sections:
// Top two sections side by side (settings on left, CLI interface on right)
// Bottom section, full div width (system info graphs and quick action buttons)

// I installed chart.js as a dependency to make the graphs. I made another file (cpuChart.tsx) to create it - it just shows random data for now though.

// I might just have the CLI interface open a Powershell terminal. Should be easy

// So now I gotta do the volume and brightness sliders, and the theme selection for changing colors if I can figure that out.

export const SettingsPanel = () => {
  const [brightness, setBrightness] = useState<number>(75);
  const [volume, setVolume] = useState<number>(20);
  const [muted, setMuted] = useState<boolean>(false);
  const [theme, setTheme] = useState<string>('orange');

  const themes = [
    { id: 'orange', name: 'Orange', primary: 'rgb(255, 149, 28)', accent: 'rgb(231, 200, 96)', bg: '#111' },
    { id: 'blue', name: 'Blue', primary: 'rgb(100, 150, 255)', accent: 'rgb(68, 85, 255)', bg: '#0a0f1a' },
    { id: 'red', name: 'Red', primary: 'rgb(255, 100, 100)', accent: 'rgb(221, 68, 68)', bg: '#1a0a0a' },
    { id: 'green', name: 'Green', primary: 'rgb(100, 200, 100)', accent: 'rgb(80, 180, 80)', bg: '#0a1a0a' },
    { id: 'purple', name: 'Purple', primary: 'rgb(200, 100, 255)', accent: 'rgb(172, 115, 236)', bg: '#15000a' },
  ];

  useEffect(() => {
    const selectedTheme = themes.find(t => t.id === theme);
    if (selectedTheme) {
      document.documentElement.style.setProperty('--primary-color', selectedTheme.primary);
      document.documentElement.style.setProperty('--accent-color', selectedTheme.accent);
      document.documentElement.style.setProperty('--bg-color', selectedTheme.bg);
    }
  }, [theme, themes]);

  const toggleMute = () => {
    if (!muted) {
      setMuted(true);
      setVolume(0);
    } else {
      setMuted(false);
      setVolume(20);
    }
  };

  // When running inside Electron, call into the main process via the preload bridge
  useEffect(() => {
    const api = (window as any).electronAPI;
    let cancelled = false;

    if (api && api.getBrightness) {
      api.getBrightness().then((res: any) => {
        if (!cancelled && res && res.ok && typeof res.value === 'number') {
          setBrightness(res.value);
        }
      }).catch(() => {});
    }

    if (api && api.getVolume) {
      api.getVolume().then((res: any) => {
        if (!cancelled && res && res.ok && typeof res.value === 'number') {
          setVolume(res.value);
          setMuted(res.value === 0);
        }
      }).catch(() => {});
    }

    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const api = (window as any).electronAPI;
    if (api && api.setBrightness) {
      api.setBrightness(brightness).then((res: any) => {
        if (!res || res.ok === false) console.warn('Failed to set brightness', res && res.error);
      }).catch((e: any) => console.warn('setBrightness error', e));
    }
  }, [brightness]);

  useEffect(() => {
    const api = (window as any).electronAPI;
    if (api && api.setVolume) {
      api.setVolume(volume).then((res: any) => {
        if (!res || res.ok === false) console.warn('Failed to set volume', res && res.error);
      }).catch((e: any) => console.warn('setVolume error', e));
    }
  }, [volume]);

  return (
    <div className="panel fade-in">
      <h1>Settings Panel</h1>

      {/* Container for top two divs, two columns */}
      <div className="settingsPanelContainer">

        {/* Top left div, settings */}
        <div className="box settingsBox">
          <h2>Settings</h2>
          <div className="settingsContainer">
            <div className="sliderRow">
              <label className="sliderLabel">Brightness</label>
              <input
                className="slider"
                type="range"
                min={0}
                max={100}
                value={brightness}
                onChange={(e) => setBrightness(parseInt(e.target.value))}
              />
              <span className="valueDisplay">{brightness}%</span>
            </div>

            <div className="sliderRow">
              <label className="sliderLabel">Volume</label>
              <input
                className="slider"
                type="range"
                min={0}
                max={100}
                value={volume}
                onChange={(e) => {
                  setVolume(parseInt(e.target.value));
                  if (muted && parseInt(e.target.value) > 0) setMuted(false);
                }}
              />
              <span className="valueDisplay">{volume}%</span>
            </div>

            <div className="sliderActions">
              <button className="optionButton" onClick={toggleMute}>{muted ? 'Unmute' : 'Mute'}</button>
            </div>
          </div>

          <div className="themeSelect">
            <h3>Theme</h3>
            <div className="themeList">
              {themes.map((t) => (
                <button
                  key={t.id}
                  className={`themeButton ${theme === t.id ? 'active' : ''}`}
                  onClick={() => setTheme(t.id)}
                  style={{
                    backgroundColor: t.accent,
                    borderColor: t.primary,
                  }}
                  title={t.name}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Top right div, CLI settings */}
        <div className="box cliBox">
          <h2>PowerShell CLI</h2>
          <img src="/terminal.gif" alt="Terminal" /> {/* It's just a gif for now */}
        </div>
      </div>

      {/* Bottom div, long bar with system info graphs */}
      <div className="box infoBox">
        <h2>System Configuration</h2>
        <div className="infoContainer">

          {/* Container for chart.js graph showing CPU usage! */}
          <div className="cpuGraph">
            <CpuChart />
          </div>

          {/* Container for chart.js graph showing what's on the disk! */}
          <div className="diskGraph">
            <DiskChart />
          </div>

          {/* Container for quick action buttons */}
          <div className="options">
            <button className="optionButton logButton" onClick={() => console.log({ brightness, volume, muted })}>Log to Console</button>
            <button className="optionButton reloadButton" onClick={() => window.location.reload()}>Reload</button>
            <button className="optionButton quitButton" onClick={exitPrompt}>Quit</button>
          </div>
        </div>
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


