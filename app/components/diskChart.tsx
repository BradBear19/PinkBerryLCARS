"use client";

import { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";

type DiskSpaceInfo = {
  FreeSpace: number;
  Size: number;
};

type DiskResponse = {
  diskInfo: {
    Model: string;
    MediaType: string;
  };
  diskSpace: DiskSpaceInfo[] | DiskSpaceInfo;
};

export const DiskChart = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);
  const [diskData, setDiskData] = useState<DiskResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch disk info on mount
    fetch("/api/diskInfo")
      .then((res) => res.json())
      .then((data: DiskResponse) => {
        setDiskData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch disk info:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!canvasRef.current || !diskData) return;

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    // Handle diskSpace as array or single object
    const diskSpace = Array.isArray(diskData.diskSpace)
      ? diskData.diskSpace[0]
      : diskData.diskSpace;

    if (!diskSpace || diskSpace.Size === 0) return;

    const usedSpace = diskSpace.Size - diskSpace.FreeSpace;
    const freeSpace = diskSpace.FreeSpace;
    const totalSpace = diskSpace.Size;

    // Destroy previous chart if it exists
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    chartRef.current = new Chart(ctx, {
      type: "pie",
      data: {
        labels: ["Used", "Free"],
        datasets: [
          {
            data: [usedSpace, freeSpace],
            backgroundColor: [
              "rgba(221, 68, 68, 0.8)",
              "rgba(100, 200, 100, 0.8)",
            ],
            borderColor: ["rgb(221, 68, 68)", "rgb(100, 200, 100)"],
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: "rgb(255, 149, 28)",
              font: {
                family: "'Final Frontier'",
                size: 12,
              },
              padding: 15,
            },
            position: "bottom",
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const gb = (context.parsed as number) / (1024 ** 3);
                const percent = (
                  ((context.parsed as number) / totalSpace) *
                  100
                ).toFixed(1);
                return `${context.label}: ${gb.toFixed(2)} GB (${percent}%)`;
              },
            },
          },
        },
      },
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [diskData]);

  if (loading) {
    return <div style={{ textAlign: "center", padding: "20px" }}>Loading disk info...</div>;
  }

  if (!diskData) {
    return <div style={{ textAlign: "center", padding: "20px" }}>Failed to load disk info</div>;
  }

  const diskSpace = Array.isArray(diskData.diskSpace)
    ? diskData.diskSpace[0]
    : diskData.diskSpace;

  const totalGb = (diskSpace.Size / (1024 ** 3)).toFixed(2);

  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      <div style={{ flex: 1, position: "relative", minHeight: 0 }}>
        <canvas ref={canvasRef} style={{ height: "100%" }}></canvas>
      </div>
      <div style={{ textAlign: "center", fontSize: "0.85rem", color: "rgb(255, 149, 28)" }}>
        <p>
          <strong>{diskData.diskInfo.Model}</strong> ({diskData.diskInfo.MediaType})
        </p>
        <p>
          Total: {totalGb} GB
        </p>
      </div>
    </div>
  );
};