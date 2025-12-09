import { useState, useEffect, useRef } from "react";

interface LcarsModalProps {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isOpen: boolean;
}

interface LcarsFileCreateModalProps {
  title: string;
  confirmText?: string;
  cancelText?: string;
  isOpen: boolean;
  fileTypes?: string[]; // optional file types e.g., ['txt','js','json']
  onConfirm: () => void;
  onCancel: () => void;
}

export const LcarsDeleteModal = ({
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  isOpen,
}: LcarsModalProps) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "#FF9900", // LCARS orange
        padding: "20px",
        borderRadius: "10px",
        minWidth: "300px",
        zIndex: 999,
        boxShadow: "0 0 10px black",
        color: "#000",
      }}
    >
      <h3>{title}</h3>
      <p>{message}</p>
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "15px" }}>
        {onCancel && (
          <button
            style={{ marginRight: "10px", background: "#FFCC66" }}
            onClick={onCancel}
          >
            {cancelText}
          </button>
        )}
        <button style={{ background: "#FF6600" }} onClick={onConfirm}>
          {confirmText}
        </button>
      </div>
    </div>
  );
};

export const LcarsFileCreateModal = ({
  title,
  confirmText = "Create",
  cancelText = "Cancel",
  isOpen,
  fileTypes = [],
  onConfirm,
  onCancel,
}: LcarsFileCreateModalProps) => {
  const [fileName, setFileName] = useState("");
  const [fileType, setFileType] = useState(fileTypes[0] || "");
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (!fileName.trim()) return; // prevent empty file name
    onConfirm();
    setFileName(""); // reset after confirm
    setFileType(fileTypes[0] || "");
  };

  const handleCancel = () => {
    setFileName("");
    setFileType(fileTypes[0] || "");
    onCancel();
  };

  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "#FF9900", // LCARS orange
        padding: "25px",
        borderRadius: "15px",
        minWidth: "350px",
        zIndex: 999,
        boxShadow: "0 0 15px rgba(0,0,0,0.8)",
        color: "#000",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h3 style={{ marginBottom: "15px", textAlign: "center" }}>{title}</h3>

      {/* Input Box */}
      <input
        ref={inputRef}
        type="text"
        value={fileName}
        placeholder="Enter file name"
        onChange={(e) => setFileName(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          fontSize: "1rem",
          borderRadius: "8px",
          border: "2px solid #FF6600",
          marginBottom: "15px",
        }}
      />

      {/* Optional File Type Dropdown */}
      {fileTypes.length > 0 && (
        <select
          value={fileType}
          onChange={(e) => setFileType(e.target.value)}
          style={{
            width: "100%",
            padding: "8px",
            fontSize: "1rem",
            borderRadius: "8px",
            border: "2px solid #FF6600",
            marginBottom: "20px",
          }}
        >
          {fileTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      )}

      {/* Buttons */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
        <button
          onClick={handleCancel}
          style={{
            background: "#FFCC66",
            padding: "10px 18px",
            borderRadius: "8px",
            fontWeight: "bold",
            cursor: "pointer",
            border: "none",
          }}
        >
          {cancelText}
        </button>

        <button
          onClick={handleConfirm}
          style={{
            background: "#FF6600",
            padding: "10px 18px",
            borderRadius: "8px",
            fontWeight: "bold",
            cursor: "pointer",
            border: "none",
            color: "#fff",
          }}
        >
          {confirmText}
        </button>
      </div>
    </div>
  );
};
