import { exec } from "child_process";

export default function handler(req, res) {
  exec(`Start ms-settings:`, { shell: "powershell.exe" });
  res.status(200).json({ ok: true });
}
