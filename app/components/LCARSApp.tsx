import React, { useState, ReactNode } from "react";
import { 
  AboutSystemPanel,
  HomePanel,
  DiskPanel,
  FileSystemApp,
  SettingsPanel,
  BotBarNormal,
  BotBarFile,
  BotBarCopy
} from "./panels";

import { playBeep } from "./audioRender";
import LCARSInfoPanel from "./infoRender";
import OfflineWarning from "./OfflineWarning";

export default function LCARSLayout({ children }: { children: ReactNode }) {
  const [currentPanel, setCurrentPanel] = useState("homeSystem");
  const [currentBar, setCurrentBar] = useState("defualt");
  const [selectedPath, setSelectedPath] = useState(""); // initial path
  const [isOnline, setIsOnline] = useState(true);


  return (
    <>
      <OfflineWarning isOnline={isOnline} />
      <div className="topSection">
        <div className="topLeftSec">
          <button
            className="tLTButton"
            onClick={() => {
              setCurrentPanel("homeSystem");
              setCurrentBar("defualt");
              playBeep();
            }}
          >
            Home
          </button>
          <button className="tLBButton" 
            onClick={() => {
              setCurrentBar("defualt");
              playBeep();
            }}>
            Back
          </button>
        </div>

        <div className="topRightSec">
          <div className="mainSec">
            <div className="sysInfo">
              <LCARSInfoPanel onOnlineStatusChange={setIsOnline} />
            </div>
            <div className="roundingTCube" />
            <div className="roundingTCube1" />
          </div>

          <div className="topBarSec">
            <div className="b1T" />
            <div className="b2T" />
            <div className="b3T" />
            <div className="b4T" />
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="bottomSection">
        <div className="botLeftSection">
          <button
            className="bLButton1"
            onClick={() => {
              setCurrentPanel("settingsSystem");
              setCurrentBar("defualt");
              playBeep();
            }}
          >
            Settings
          </button>

          <button
            className="bLButton2"
            onClick={() => {
              setCurrentPanel("diskSystem");
              setCurrentBar("defualt");
              playBeep();
            }}
          >
            Disk Specs
          </button>

          <button
            className="bLButton2"
            onClick={() => {
              setCurrentPanel("aboutSystem");
              setCurrentBar("defualt");
              playBeep();
            }}
          >
            System Specs
          </button>

          <button
            className="bLButton3"
            onClick={() => {
              setCurrentPanel("fileSystem");
              setCurrentBar("FileSystemBar");
              playBeep();
            }}
          >
            File System
          </button>
        </div>

        <div className="botRightSection">
          <div className="botBarSec" id="bottomBarID">
            {currentBar === "defualt" && <BotBarNormal />}
            {currentBar === "CopyBar" && (
              <BotBarCopy selectedPath={selectedPath }setCurrentBar={setCurrentBar}/>)}
            {currentBar === "FileSystemBar" && (
              <BotBarFile selectedPath={selectedPath} setCurrentBar={setCurrentBar}  />)}
          </div>

          <div className="dynamicSec">
            <div className="roundingBCube" />
            <div className="roundingBCube1" />

            <div className="specialDynamic">
              {children}
              {currentPanel === "aboutSystem" && <AboutSystemPanel />}
              {currentPanel === "homeSystem" && <HomePanel />}
              {currentPanel === "diskSystem" && <DiskPanel />}
              {currentPanel === "settingsSystem" && <SettingsPanel />}
              {currentPanel === "fileSystem" && <FileSystemApp setSelectedItem={setSelectedPath}/>}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
