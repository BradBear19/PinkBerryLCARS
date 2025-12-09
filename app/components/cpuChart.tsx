"use client";

import { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";

export const CpuChart = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);
  const [cpuData, setCpuData] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize chart
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    chartRef.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels.length > 0 ? labels : ["0s"],
        datasets: [
          {
            label: "CPU Usage (%)",
            data: cpuData.length > 0 ? cpuData : [0],
            borderColor: "rgb(231, 200, 96)",
            backgroundColor: "rgba(231, 200, 96, 0.1)",
            borderWidth: 2,
            tension: 0.1,
            fill: true,
            pointRadius: 4,
            pointBackgroundColor: "rgb(231, 200, 96)",
            pointBorderColor: "rgb(231, 200, 96)",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            labels: {
              color: "rgb(255, 149, 28)",
              font: {
                family: "'Final Frontier'",
                size: 14,
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            ticks: {
              color: "rgb(255, 149, 28)",
              font: {
                family: "'Final Frontier'",
              },
            },
            grid: {
              color: "rgba(255, 149, 28, 0.1)",
            },
          },
          x: {
            ticks: {
              color: "rgb(255, 149, 28)",
              font: {
                family: "'Final Frontier'",
              },
            },
            grid: {
              color: "rgba(255, 149, 28, 0.1)",
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
  }, []);

  // Update chart data every 2 seconds
  useEffect(() => {
    const fetchAndPush = async () => {
      try {
        const res = await fetch('/api/cpuUsage');
        const data = await res.json();
        const newCpuValue = data && data.ok && typeof data.usage === 'number' ? data.usage : 0;
        const now = new Date();
        const timeLabel = now.toLocaleTimeString();

        setCpuData((prev) => {
          const updated = [...prev, newCpuValue];
          // Keep only last 30 data points
          return updated.slice(-30);
        });

        setLabels((prev) => {
          const updated = [...prev, timeLabel];
          return updated.slice(-30);
        });
      } catch (e) {
        console.warn('Failed to fetch CPU usage', e);
      }
    };

    // initial fetch
    fetchAndPush();
    const interval = setInterval(fetchAndPush, 2000);

    return () => clearInterval(interval);
  }, []);

  // Update chart whenever data changes
  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.data.labels = labels;
      chartRef.current.data.datasets[0].data = cpuData;
      chartRef.current.update();
    }
  }, [cpuData, labels]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
};
