// ==========================================
// MACOS WEB - MODERN JAVASCRIPT (ES6+)
// ==========================================

let openWindows = [];
let zIndex = 1000;

// ==========================================
// START
// ==========================================
window.onload = () => {
  setTimeout(() => {
    document.getElementById("bootScreen").classList.add("hidden");
  }, 3000);

  updateClock();
  setInterval(updateClock, 1000);
  updateCalendarIcon();
  setupBrightness();
  setupDock();
  setupContextMenu();
  setupSpotlight();
};

// ==========================================
// CLOCK
// ==========================================
const updateClock = () => {
  const now = new Date();
  const time = now.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  const date = now.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  document.querySelector(".time").textContent = `${date} ${time}`;
};

// ==========================================
// CALENDAR ICON
// ==========================================
const updateCalendarIcon = () => {
  const now = new Date();
  const day = now.getDate();
  const weekday = now.toLocaleDateString("en-US", { weekday: "long" });

  document.getElementById("calendarDay").textContent = day;
  document.getElementById("calendarWeekday").textContent = weekday;
};

// ==========================================
// BRIGHTNESS
// ==========================================
const setupBrightness = () => {
  const btn = document.querySelector(".brightness-control");
  const popup = document.getElementById("brightnessPopup");
  const slider = document.getElementById("brightnessSlider");

  const overlay = document.createElement("div");
  overlay.className = "brightness-overlay";
  document.body.appendChild(overlay);

  btn.onclick = (e) => {
    e.stopPropagation();
    popup.classList.toggle("active");
  };

  document.onclick = (e) => {
    if (!popup.contains(e.target) && !btn.contains(e.target)) {
      popup.classList.remove("active");
    }
  };

  slider.oninput = function () {
    const brightness = this.value;
    const darkness = (100 - brightness) / 100;
    overlay.style.opacity = darkness;
  };
};

// ==========================================
// DOCK
// ==========================================
const setupDock = () => {
  const items = document.querySelectorAll(".dock-item");

  items.forEach((item) => {
    item.onclick = function () {
      this.classList.add("bounce");
      setTimeout(() => this.classList.remove("bounce"), 500);
      openApp(this.dataset.app);
    };
  });
};

// ==========================================
// OPEN APP
// ==========================================
const openApp = (appName) => {
  const existingWindow = openWindows.find((win) => win.appName === appName);

  if (existingWindow) {
    existingWindow.element.classList.remove("minimized");
    existingWindow.element.style.zIndex = ++zIndex;
    return;
  }

  const win = createWindow(appName);
  openWindows.push({ appName, element: win });
};

// ==========================================
// CREATE WINDOW
// ==========================================
const createWindow = (appName) => {
  const win = document.createElement("div");
  win.className = "window";
  win.style.zIndex = ++zIndex;
  win.style.left = `${100 + Math.random() * 300}px`;
  win.style.top = `${100 + Math.random() * 200}px`;
  win.style.width = "800px";
  win.style.height = "600px";

  const title = appName.charAt(0).toUpperCase() + appName.slice(1);

  win.innerHTML = `
        <div class="window-titlebar">
            <div class="window-controls">
                <div class="window-control close"></div>
                <div class="window-control minimize"></div>
                <div class="window-control maximize"></div>
            </div>
            <div class="window-title">${title}</div>
            <div style="width: 60px;"></div>
        </div>
        <div class="window-content">${getAppHTML(appName)}</div>
        <div class="resize-handle right"></div>
        <div class="resize-handle bottom"></div>
        <div class="resize-handle corner"></div>
    `;

  document.getElementById("desktop").appendChild(win);

  setupWindowButtons(win);
  setupDrag(win);
  setupResize(win);

  if (appName === "safari") setupSafari(win);
  if (appName === "calculator") setupCalculator(win);
  if (appName === "weather") setupWeather(win);

  return win;
};

// ==========================================
// APP HTML
// ==========================================
const getAppHTML = (appName) => {
  const appTemplates = {
    finder: `
            <div style="display: flex; height: 100%;">
                <div class="finder-sidebar">
                    <div class="finder-item">📁 Documents</div>
                    <div class="finder-item">📥 Downloads</div>
                    <div class="finder-item">🖼️ Pictures</div>
                    <div class="finder-item">🎵 Music</div>
                </div>
                <div class="finder-content" style="flex: 1;">
                    <h2>My Files</h2>
                    <div style="margin-top: 20px;">
                        <div style="padding: 15px; background: #f5f5f7; border-radius: 8px; margin: 10px 0;">📄 Document.pdf</div>
                        <div style="padding: 15px; background: #f5f5f7; border-radius: 8px; margin: 10px 0;">📄 Report.docx</div>
                    </div>
                </div>
            </div>
        `,
    safari: `
            <div class="safari-content">
                <div class="safari-toolbar">
                    <button class="safari-nav-btn back-btn">←</button>
                    <button class="safari-nav-btn forward-btn">→</button>
                    <button class="safari-nav-btn refresh-btn">⟳</button>
                    <input type="text" class="safari-url-bar" placeholder="Enter website" value="https://example.com">
                </div>
                <iframe class="safari-iframe"></iframe>
            </div>
        `,
    settings: `
            <div class="settings-content">
                <h2>System Settings</h2>
                <div class="settings-group">
                    <h3>Display</h3>
                    <div class="settings-item">
                        <span>Brightness</span>
                        <input type="range" min="30" max="100" value="100">
                    </div>
                </div>
            </div>
        `,
    notes: `<div class="notes-content"><textarea class="notes-textarea" placeholder="Type here...">Welcome to Notes!</textarea></div>`,
    calculator: `
            <div class="calculator-content">
                <div class="calc-display">0</div>
                <button class="calc-btn">C</button>
                <button class="calc-btn">±</button>
                <button class="calc-btn">%</button>
                <button class="calc-btn operator">÷</button>
                <button class="calc-btn">7</button>
                <button class="calc-btn">8</button>
                <button class="calc-btn">9</button>
                <button class="calc-btn operator">×</button>
                <button class="calc-btn">4</button>
                <button class="calc-btn">5</button>
                <button class="calc-btn">6</button>
                <button class="calc-btn operator">−</button>
                <button class="calc-btn">1</button>
                <button class="calc-btn">2</button>
                <button class="calc-btn">3</button>
                <button class="calc-btn operator">+</button>
                <button class="calc-btn zero">0</button>
                <button class="calc-btn">.</button>
                <button class="calc-btn operator">=</button>
            </div>
        `,
    weather: `
            <div class="weather-content">
                <div class="weather-location">Loading...</div>
                <div class="weather-icon-display">⛅</div>
                <div class="weather-temp">--°</div>
                <div class="weather-description">--</div>
                <div class="weather-details">
                    <div class="weather-detail">
                        <div class="weather-detail-label">Humidity</div>
                        <div class="weather-detail-value" id="humidity">--%</div>
                    </div>
                    <div class="weather-detail">
                        <div class="weather-detail-label">Wind</div>
                        <div class="weather-detail-value" id="wind">-- km/h</div>
                    </div>
                </div>
            </div>
        `,
  };

  return (
    appTemplates[appName] || '<div style="padding: 30px;">App content</div>'
  );
};

// ==========================================
// WINDOW BUTTONS
// ==========================================
const setupWindowButtons = (win) => {
  const close = win.querySelector(".close");
  const minimize = win.querySelector(".minimize");
  const maximize = win.querySelector(".maximize");

  close.onclick = (e) => {
    e.stopPropagation();
    win.remove();

    const index = openWindows.findIndex((window) => window.element === win);
    if (index !== -1) {
      openWindows.splice(index, 1);
    }
  };

  minimize.onclick = (e) => {
    e.stopPropagation();
    win.classList.add("minimized");
  };

  maximize.onclick = (e) => {
    e.stopPropagation();

    if (win.dataset.max === "true") {
      Object.assign(win.style, {
        width: win.dataset.w,
        height: win.dataset.h,
        left: win.dataset.l,
        top: win.dataset.t,
      });
      win.dataset.max = "false";
    } else {
      Object.assign(win.dataset, {
        w: win.style.width,
        h: win.style.height,
        l: win.style.left,
        t: win.style.top,
      });
      Object.assign(win.style, {
        width: "100%",
        height: "calc(100vh - 26px)",
        left: "0",
        top: "26px",
      });
      win.dataset.max = "true";
    }
  };
};

// ==========================================
// DRAG WINDOW
// ==========================================
const setupDrag = (win) => {
  const titlebar = win.querySelector(".window-titlebar");
  let dragging = false;
  let position = { startX: 0, startY: 0, winX: 0, winY: 0 };

  titlebar.onmousedown = (e) => {
    if (e.target.classList.contains("window-control")) return;

    dragging = true;
    position = {
      startX: e.clientX,
      startY: e.clientY,
      winX: win.offsetLeft,
      winY: win.offsetTop,
    };
    win.style.zIndex = ++zIndex;
    e.preventDefault();
  };

  const moveHandler = (e) => {
    if (!dragging) return;

    const { startX, startY, winX, winY } = position;
    win.style.left = `${winX + e.clientX - startX}px`;
    win.style.top = `${winY + e.clientY - startY}px`;
  };

  const upHandler = () => {
    dragging = false;
  };

  document.addEventListener("mousemove", moveHandler);
  document.addEventListener("mouseup", upHandler);
};

// ==========================================
// RESIZE WINDOW
// ==========================================
const setupResize = (win) => {
  const handles = win.querySelectorAll(".resize-handle");

  handles.forEach((handle) => {
    handle.onmousedown = (e) => {
      e.preventDefault();
      e.stopPropagation();

      const initial = {
        x: e.clientX,
        y: e.clientY,
        width: win.offsetWidth,
        height: win.offsetHeight,
      };
      let resizing = true;

      const moveHandler = (e) => {
        if (!resizing) return;

        const { classList } = handle;

        if (classList.contains("right") || classList.contains("corner")) {
          const newWidth = initial.width + (e.clientX - initial.x);
          if (newWidth >= 500) win.style.width = `${newWidth}px`;
        }

        if (classList.contains("bottom") || classList.contains("corner")) {
          const newHeight = initial.height + (e.clientY - initial.y);
          if (newHeight >= 350) win.style.height = `${newHeight}px`;
        }
      };

      const upHandler = () => {
        resizing = false;
        document.removeEventListener("mousemove", moveHandler);
        document.removeEventListener("mouseup", upHandler);
      };

      document.addEventListener("mousemove", moveHandler);
      document.addEventListener("mouseup", upHandler);
    };
  });
};

// ==========================================
// SAFARI BROWSER
// ==========================================
const setupSafari = (win) => {
  const urlbar = win.querySelector(".safari-url-bar");
  const iframe = win.querySelector(".safari-iframe");
  const back = win.querySelector(".back-btn");
  const forward = win.querySelector(".forward-btn");
  const refresh = win.querySelector(".refresh-btn");

  let history = [];
  let index = -1;

  const loadURL = (url) => {
    const fullURL = url.startsWith("http") ? url : `https://${url}`;
    iframe.src = `https://api.allorigins.win/raw?url=${encodeURIComponent(
      fullURL
    )}`;

    if (index === -1 || history[index] !== fullURL) {
      history = history.slice(0, index + 1);
      history.push(fullURL);
      index = history.length - 1;
    }

    back.disabled = index <= 0;
    forward.disabled = index >= history.length - 1;
  };

  urlbar.onkeypress = (e) => {
    if (e.key === "Enter") loadURL(urlbar.value);
  };

  back.onclick = () => {
    if (index > 0) {
      index--;
      iframe.src = history[index];
      urlbar.value = history[index];
      back.disabled = index <= 0;
      forward.disabled = false;
    }
  };

  forward.onclick = () => {
    if (index < history.length - 1) {
      index++;
      iframe.src = history[index];
      urlbar.value = history[index];
      forward.disabled = index >= history.length - 1;
      back.disabled = false;
    }
  };

  refresh.onclick = () => {
    iframe.src = iframe.src;
  };

  loadURL(urlbar.value);
};

// ==========================================
// CALCULATOR
// ==========================================
const setupCalculator = (win) => {
  const display = win.querySelector(".calc-display");
  const buttons = win.querySelectorAll(".calc-btn");

  let current = "0";
  let previous = null;
  let operation = null;
  let reset = false;

  const calculate = () => {
    const a = parseFloat(previous);
    const b = parseFloat(current);

    const operations = {
      "+": () => a + b,
      "−": () => a - b,
      "×": () => a * b,
      "÷": () => a / b,
    };

    return operations[operation] ? operations[operation]() : b;
  };

  buttons.forEach((button) => {
    button.onclick = function () {
      const val = this.textContent;

      if (val >= "0" && val <= "9") {
        current = reset || current === "0" ? val : current + val;
        reset = false;
      } else if (val === ".") {
        if (!current.includes(".")) current += ".";
      } else if (val === "C") {
        current = "0";
        previous = null;
        operation = null;
      } else if (val === "±") {
        current = String(-parseFloat(current));
      } else if (val === "%") {
        current = String(parseFloat(current) / 100);
      } else if (["+", "−", "×", "÷"].includes(val)) {
        if (previous && operation && !reset) {
          current = String(calculate());
        }
        previous = current;
        operation = val;
        reset = true;
      } else if (val === "=") {
        if (previous && operation) {
          current = String(calculate());
          previous = null;
          operation = null;
          reset = true;
        }
      }

      display.textContent = current;
    };
  });
};

// ==========================================
// WEATHER APP
// ==========================================
const setupWeather = (win) => {
  const elements = {
    location: win.querySelector(".weather-location"),
    icon: win.querySelector(".weather-icon-display"),
    temp: win.querySelector(".weather-temp"),
    desc: win.querySelector(".weather-description"),
    humidity: win.querySelector("#humidity"),
    wind: win.querySelector("#wind"),
  };

  const weatherIcons = {
    clear: "☀️",
    cloud: "☁️",
    rain: "🌧️",
    snow: "❄️",
    thunder: "⛈️",
    default: "⛅",
  };

  const showDemoWeather = () => {
    Object.assign(elements, {
      location: { textContent: "Demo Mode" },
      temp: { textContent: "18°C" },
      desc: { textContent: "partly cloudy" },
      humidity: { textContent: "65%" },
      wind: { textContent: "12 km/h" },
      icon: { textContent: "⛅" },
    });

    elements.location.textContent = "Demo Mode";
    elements.temp.textContent = "18°C";
    elements.desc.textContent = "partly cloudy";
    elements.humidity.textContent = "65%";
    elements.wind.textContent = "12 km/h";
    elements.icon.textContent = "⛅";
  };

  if (!navigator.geolocation) {
    elements.location.textContent = "No Location Access";
    showDemoWeather();
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude: lat, longitude: lon } = position.coords;
      const apiKey = "8d3f4ca3a3d8c7e9d1f2e3a4b5c6d7e8";
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          const condition = data.weather[0].main.toLowerCase();
          const weatherIcon = Object.keys(weatherIcons).find((key) =>
            condition.includes(key)
          )
            ? weatherIcons[
                Object.keys(weatherIcons).find((key) => condition.includes(key))
              ]
            : weatherIcons.default;

          elements.location.textContent = data.name;
          elements.temp.textContent = `${Math.round(data.main.temp)}°C`;
          elements.desc.textContent = data.weather[0].description;
          elements.humidity.textContent = `${data.main.humidity}%`;
          elements.wind.textContent = `${Math.round(
            data.wind.speed * 3.6
          )} km/h`;
          elements.icon.textContent = weatherIcon;
        })
        .catch(() => showDemoWeather());
    },
    () => {
      elements.location.textContent = "Location Disabled";
      showDemoWeather();
    }
  );
};

// ==========================================
// RIGHT-CLICK CONTEXT MENU
// ==========================================
const setupContextMenu = () => {
  const menu = document.getElementById("contextMenu");
  const desktop = document.getElementById("desktop");

  desktop.oncontextmenu = (e) => {
    e.preventDefault();
    Object.assign(menu.style, {
      left: `${e.clientX}px`,
      top: `${e.clientY}px`,
    });
    menu.classList.add("active");
  };

  document.onclick = () => menu.classList.remove("active");

  menu.onclick = (e) => {
    e.stopPropagation();
    menu.classList.remove("active");
  };
};

// ==========================================
// SPOTLIGHT SEARCH
// ==========================================
const setupSpotlight = () => {
  const overlay = document.getElementById("spotlightOverlay");
  const input = document.getElementById("spotlightInput");
  const results = document.getElementById("spotlightResults");
  const searchIcon = document.querySelectorAll(".menu-icon")[3];

  const apps = [
    { name: "Finder", icon: "📁", app: "finder" },
    { name: "Safari", icon: "🧭", app: "safari" },
    { name: "Messages", icon: "💬", app: "messages" },
    { name: "Mail", icon: "✉️", app: "mail" },
    { name: "Notes", icon: "📝", app: "notes" },
    { name: "Calendar", icon: "📅", app: "calendar" },
    { name: "Settings", icon: "⚙️", app: "settings" },
    { name: "Calculator", icon: "🔢", app: "calculator" },
    { name: "Weather", icon: "⛅", app: "weather" },
  ];

  const openSpotlight = () => {
    overlay.classList.add("active");
    input.focus();
  };

  const closeSpotlight = () => {
    overlay.classList.remove("active");
    input.value = "";
    results.innerHTML = "";
  };

  document.onkeydown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === " ") {
      e.preventDefault();
      openSpotlight();
    }
    if (e.key === "Escape") closeSpotlight();
  };

  searchIcon.onclick = openSpotlight;

  overlay.onclick = (e) => {
    if (e.target === overlay) closeSpotlight();
  };

  input.oninput = function () {
    const query = this.value.toLowerCase();
    results.innerHTML = "";

    if (query === "") return;

    const matches = apps.filter((app) =>
      app.name.toLowerCase().includes(query)
    );

    if (matches.length === 0) {
      results.innerHTML =
        '<div style="padding: 20px; text-align: center; color: #888;">No results found</div>';
      return;
    }

    matches.forEach((match) => {
      const item = document.createElement("div");
      item.className = "spotlight-result-item";
      item.innerHTML = `
                <div class="spotlight-result-icon">${match.icon}</div>
                <div class="spotlight-result-text">${match.name}</div>
            `;

      item.onclick = () => {
        openApp(match.app);
        closeSpotlight();
      };

      results.appendChild(item);
    });
  };
};
