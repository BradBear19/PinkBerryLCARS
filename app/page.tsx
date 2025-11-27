"use client";

import { useState } from "react";
import { AboutSystemPanel, FileSystemPanel } from "./components/panels";

export default function Page() {
  const [currentPanel, setCurrentPanel] = useState<string>("");
  return (
    <>
      {currentPanel === "aboutSystem" && <AboutSystemPanel />}
      {currentPanel === "fileSystem" && <FileSystemPanel />}
    </>
  );
}
