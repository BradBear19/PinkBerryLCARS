"use client";
import { useEffect, useState } from "react";

interface LCARSInfoPanelProps {
  onOnlineStatusChange?: (isOnline: boolean) => void;
}

export default function LCARSInfoPanel({ onOnlineStatusChange }: LCARSInfoPanelProps) {
  const [time, setTime] = useState("");
  const [online, setOnline] = useState(true);
  const [host, setHost] = useState("");
  const [dateString, setDateString] = useState("");

  // Update time every second
  useEffect(() => {
    const updateTime = () => setTime(new Date().toLocaleTimeString());
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Online/offline status
  useEffect(() => {
    const updateOnline = () => {
      const isOnline = navigator.onLine;
      setOnline(isOnline);
      if (onOnlineStatusChange) {
        onOnlineStatusChange(isOnline);
      }
    };
    updateOnline();
    window.addEventListener("online", updateOnline);
    window.addEventListener("offline", updateOnline);
    return () => {
      window.removeEventListener("online", updateOnline);
      window.removeEventListener("offline", updateOnline);
    };
  }, [onOnlineStatusChange]);

  useEffect(() => {
    // Fetch hostname from the Next.js API route
    fetch("/api/sysInfo?type=hostname")
      .then((res) => res.json())
      .then((data) => setHost(data.hostname)) // use the key returned in your API
      .catch((err) => {
        console.error("Failed to fetch hostname:", err);
        setHost("Unknown");
      });
  }, []);


  // Date string
  useEffect(() => {
    const now = new Date();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    const yyyy = now.getFullYear();
    setDateString(`${mm}${dd}${yyyy}`);
  }, []);

  return (
    <>
      {/* Status displays - each item given a class for vertical layout */}
      <div className="info-item">Hostname: {host}</div>
      <div className="info-item">{dateString}</div>
      <div className="info-item">Time: {time}</div>
      <div className="info-item">Online Status: {online ? "online" : "offline"}</div>
    </>
  );
}
