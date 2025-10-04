// ==========================================
// MACOS WEB - SIMPLE JAVASCRIPT
// ==========================================

let openWindows = [];
let zIndex = 1000;

// ==========================================
// START
// ==========================================
window.addEventListener("load", () => {
  const boot = document.getElementById("bootScreen");
  if (boot) {
    setTimeout(() => boot.classList.add("hidden"), 5000);
  }
  updateClock();
  setupBrightness();

  /* Clock regular update */
  setInterval(() => {
    updateClock();
  }, 1000);
});

let updateClock = () => {
  const now = new Date(); // current date/time object

  //Time format:"5:30PM" style
  const time = now.toLocaleTimeString("en-IN", {
    hour: "numeric", // 5 (not 05)
    minute: "2-digit", // 30 (always 2 digits)
    hour12: true,
  });

  const date = now.toLocaleDateString("en-IN", {
    weekday: "short", // "Mon"
    month: "short", // "Jun"
    day: "numeric", // "1"
  });

  //menu bar time display
  document.querySelector(".time").textContent = date + " " + time;
};

/* Brightness control Function */

let setupBrightness = () => {
  const btn = document.querySelector(".brightness-control"); //brightness icon mai hai
  // try both spellings in case of typo in HTML
  const popup =
    document.getElementById("birightness-popup") ||
    document.getElementById("brightnessPopup"); //brightness silder popup
  const slider = document.getElementById("brightnessSlider"); //brightness slider */

  if (!btn || !popup || !slider) {
    console.warn("setupBrightness: missing element:", {
      btn: !!btn,
      popup: !!popup,
      slider: !!slider,
    });
    return;
  }

  //brightness overlay creation
  const overlay = document.createElement("div");
  overlay.className = "brightness-overlay";
  document.body.appendChild(overlay);
  //Icon click=>Popup toggle
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    popup.classList.toggle("active");
  });

  //document click=>Popup hide
  document.addEventListener("click", (e) => {
    if (!popup.contains(e.target) && !btn.contains(e.target)) {
      popup.classList.remove("active");
    }
  });

  /* slider move => brightness change (addEvent Listener) */
  slider.addEventListener("input", (e) => {
    const brightness = Number(e.target.value);
    const clamped = Math.max(0, Math.min(100, brightness));
    const darkness = (100 - clamped) / 100;
    overlay.style.opacity = darkness;
  });
};
