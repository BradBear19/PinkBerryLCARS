"use client";

import React, { useState, ReactNode, useEffect } from "react";
import { AboutSystemPanel, FileSystemPanel, HomePanel, DiskPanel, SettingsPanel } from "./components/panels";
import { playBeep } from "./components/audioRender";
import LCARSInfoPanel from "./components/infoRender";

interface LayoutProps {
  children: ReactNode;
  setCurrentPanel: (panel: string) => void;
}

export default function LCARSLayout({ children }: LayoutProps) {
  const [currentPanel, setCurrentPanel] = useState<string>("homeSystem");
  return (
    
    <html lang="en">
      <head>
        <title>PINK INC LCARS</title>
        <link rel="stylesheet" href="/globals.css" />
      </head>

      <body>
        {/* Top Section */}
        <div className="topSection">
          <div className="topLeftSec">
            <button className="tLTButton" onClick={() => {
              setCurrentPanel("homeSystem");
              playBeep();
            }}> 
            Home</button>
            <button className="tLBButton" onClick={playBeep} >Back</button>
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
              onClick={() => setCurrentPanel("settingsSystem")}>
                Settings
            </button>
            <button
              className="bLButton2"
              onClick={() => setCurrentPanel("diskSystem")}
            >
              Disk Specs
            </button>
            <button
              className="bLButton2"
              onClick={() => setCurrentPanel("aboutSystem")}
            >
              System Specs
            </button>
            <button
              className="bLButton3"
              onClick={() => setCurrentPanel("fileSystem")}
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
            {/* Dynamic content */}
            <div className="dynamicSec">
              <div className="roundingBCube" />
              <div className="roundingBCube1" />
              <div className= "specialDynamic"> 
                {children}
                {currentPanel === "aboutSystem" && <AboutSystemPanel />}
                {currentPanel === "fileSystem" && <FileSystemPanel />}
                {currentPanel === "homeSystem" && <HomePanel />}
                {currentPanel === "diskSystem" && <DiskPanel />}

                {/* Adolfo - SettingsPanel */}
                {currentPanel === "settingsSystem" && <SettingsPanel />}
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
