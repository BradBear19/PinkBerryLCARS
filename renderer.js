// renderer.js
const os = require('os'); // Node module for system info

document.addEventListener('DOMContentLoaded', () => {
  // ----- HONK Button -----
  const honkButton = document.querySelector('.bLButton1');
  if (honkButton) {
    honkButton.addEventListener('click', () => {
      const audio = new Audio('styleAssets/honk-sound.mp3');
      audio.play().catch(err => console.error('Audio playback failed:', err));
    });
  }

  // ----- System Name -----
  const sysNameEl = document.getElementById('sysName');
  if (sysNameEl) {
    const hostname = os.hostname(); // Get the computer name
    sysNameEl.textContent = `🖥️ ${hostname}•LCARS`;
  }

    // ----- System Status with Date -----
  const sysStatusEl = document.getElementById('sysDate');
  if (sysStatusEl) {
    const now = new Date();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const yyyy = now.getFullYear();
    const formattedDate = `${mm}${dd}${yyyy}`;
    sysStatusEl.textContent = `${formattedDate}`;
  }
});

const updateOnlineStatus = () => {
  document.getElementById('status').innerHTML = navigator.onLine ? 'online' : 'offline'
}

function updateTime() {
const now = new Date();
const timeString = now.toLocaleTimeString(); // Formats time based on locale
document.getElementById("time").innerText = timeString;
}

window.addEventListener('online', updateOnlineStatus)
window.addEventListener('offline', updateOnlineStatus)

// Initialize the time immediately
updateTime();
updateOnlineStatus()

// Update the time every second
setInterval(updateTime, 1000);