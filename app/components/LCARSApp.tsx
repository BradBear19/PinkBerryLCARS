import React, { useState, ReactNode } from "react";
import { 
  AboutSystemPanel,
  HomePanel,
  DiskPanel,
  FileSystemApp,
  SettingsPanel,
} from "./panels";

import { playBeep } from "./audioRender";
import LCARSInfoPanel from "./infoRender";

export default function LCARSLayout({ children }: { children: ReactNode }) {
  const [currentPanel, setCurrentPanel] = useState("homeSystem");

  return (
    <>
      {/* Top Section */}
      <div className="topSection">
        <div className="topLeftSec">
          <button
            className="tLTButton"
            onClick={() => {
              setCurrentPanel("homeSystem");
              playBeep();
            }}
          >
            Home
          </button>
          <button className="tLBButton" onClick={playBeep}>
            Back
          </button>
        </div>

        <div className="topRightSec">
          <div className="mainSec">
            <div className="sysInfo">
              <LCARSInfoPanel />
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
              playBeep();
            }}
          >
            Settings
          </button>

          <button
            className="bLButton2"
            onClick={() => {
              setCurrentPanel("diskSystem");
              playBeep();
            }}
          >
            Disk Specs
          </button>

          <button
            className="bLButton2"
            onClick={() => {
              setCurrentPanel("aboutSystem");
              playBeep();
            }}
          >
            System Specs
          </button>

          <button
            className="bLButton3"
            onClick={() => {
              setCurrentPanel("fileSystem");
              playBeep();
            }}
          >
            File System
          </button>
        </div>

        <div className="botRightSection">
          <div className="botBarSec">
            <div className="b1B" />
            <div className="b2B" />
            <div className="b3B" />
            <div className="b4B" />
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
              {currentPanel === "fileSystem" && <FileSystemApp />}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
