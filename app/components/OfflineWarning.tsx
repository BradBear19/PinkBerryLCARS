"use client";
import { useState, useEffect } from "react";

interface OfflineWarningProps {
  isOnline: boolean;
}

export default function OfflineWarning({ isOnline }: OfflineWarningProps) {
  const [showWarning, setShowWarning] = useState(false);
  const [hasShownWarning, setHasShownWarning] = useState(false);
  const [isFlashing, setIsFlashing] = useState(false);

  useEffect(() => {
    // Trigger warning only when transitioning from online to offline
    if (!isOnline && !hasShownWarning) {
      setShowWarning(true);
      setIsFlashing(true);
      setHasShownWarning(true);

      // Flash background red 3 times
      let flashCount = 0;
      const flashInterval = setInterval(() => {
        flashCount++;
        if (flashCount >= 2) {
          // 6 half-cycles = 3 full flashes
          clearInterval(flashInterval);
          setIsFlashing(false);
        }
      }, 300); // Each flash lasts 300ms
    }

    // Reset warning when coming back online
    if (isOnline && hasShownWarning) {
      setHasShownWarning(false);
    }
  }, [isOnline, hasShownWarning]);

  return (
    <>
      {/* Flash overlay */}
      {isFlashing && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "red",
            zIndex: 1000,
            animation: "redFlash 0.3s infinite",
            pointerEvents: "none",
          }}
        />
      )}

      {/* Warning modal */}
      {showWarning && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#FF9900",
            padding: "30px",
            borderRadius: "15px",
            minWidth: "400px",
            zIndex: 1001,
            boxShadow: "0 0 20px red",
            color: "#000",
            textAlign: "center",
            fontFamily: "'Final Frontier', sans-serif",
            fontSize: "18px",
          }}
        >
          <h2 style={{ margin: "0 0 15px 0", fontSize: "24px" }}>⚠ WARNING ⚠</h2>
          <p style={{ margin: "0 0 20px 0", lineHeight: "1.5" }}>
            CONNECTION TO MOTHERBOARD LOST.
            <br />
            Please join a working Wi-Fi network!
          </p>
          <button
            onClick={() => setShowWarning(false)}
            style={{
              background: "#FF6600",
              color: "#000",
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px",
              fontSize: "16px",
              fontFamily: "'Final Frontier', sans-serif",
              cursor: "pointer",
            }}
          >
            ACKNOWLEDGE
          </button>
        </div>
      )}

      <style>{`
        @keyframes redFlash {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
}
