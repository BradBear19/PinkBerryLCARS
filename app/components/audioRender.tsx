export const playBeep = () => {
  const audio = new Audio("beep2.mp3");
  audio.play().catch(err => console.error("Audio failed:", err));
};
