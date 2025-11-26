// renderer.js
const os = require('os'); // Node module for system info

document.addEventListener('DOMContentLoaded', () => {
  // ----- Makes buttons beep -----
  const Button = document.querySelector('.tLTButton');
  if (Button) {
    Button.addEventListener('click', () => {
      const audio = new Audio('styleAssets/beep2.mp3');
      audio.play().catch(err => console.error('Audio playback failed:', err));
    });
  }

   const Button1 = document.querySelector('.tLBButton');
  if (Button1) {
    Button1.addEventListener('click', () => {
      const audio = new Audio('styleAssets/beep2.mp3');
      audio.play().catch(err => console.error('Audio playback failed:', err));
    });
  }

   const Button2 = document.querySelector('.bLButton1');
  if (Button2) {
    Button2.addEventListener('click', () => {
      const audio = new Audio('styleAssets/beep2.mp3');
      audio.play().catch(err => console.error('Audio playback failed:', err));
    });
  }

   const Button3 = document.querySelector('.bLButton2');
  if (Button3) {
    Button3.addEventListener('click', () => {
      const audio = new Audio('styleAssets/beep2.mp3');
      audio.play().catch(err => console.error('Audio playback failed:', err));
    });
  }

  const Button4 = document.querySelector('.bLButton3');
  if (Button4) {
    Button4.addEventListener('click', () => {
      const audio = new Audio('styleAssets/beep2.mp3');
      audio.play().catch(err => console.error('Audio playback failed:', err));
    });
  }

  const Button5 = document.querySelector('.bLButton4');
  if (Button5) {
    Button5.addEventListener('click', () => {
      const audio = new Audio('styleAssets/beep2.mp3');
      audio.play().catch(err => console.error('Audio playback failed:', err));
    });
  }

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

  // ----- System Name -----
  const sysNameEl = document.getElementById('sysName');
  if (sysNameEl) {
    const hostname = os.hostname(); // Get the computer name
    sysNameEl.textContent = `🖥️LCARS•${hostname}`;
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

 