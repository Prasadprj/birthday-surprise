/* =========================================
   BIRTHDAY SURPRISE — script.js
   Her: Sneha | Him: Prasad | Vibe: Flirty/Funny
   ========================================= */

// ── CONFIG ─────────────────────────────────────
const CONFIG = {
  her: "Sneha",
  him: "Prasad",
  typedStrings: [
    "A special mission awaits you... 🎯",
    "No, seriously. Stop scrolling Instagram. 😤",
    "This one is just for you, Sneha. ✨",
    "Prasad went through a LOT of trouble. 💀",
    "So you better enjoy this. 😂❤️",
  ],
  floaterEmojis: ["🎂", "✨", "💫", "🎉", "💕", "🌸", "⭐", "🎈", "💜", "🦋"],
};

// ── GLOBAL BACKGROUND MUSIC ────────────────────
let globalMusicPlaying = false;
const globalMusic = document.getElementById("global-background-music");
const globalMusicBtn = document.getElementById("global-music-toggle");

// Try to start music after first user interaction
function tryStartGlobalMusic() {
  if (globalMusic && !globalMusicPlaying) {
    globalMusic.volume = 0.35; // Set volume to 35%
    globalMusic.play()
      .then(() => {
        globalMusicPlaying = true;
        if (globalMusicBtn) globalMusicBtn.classList.remove("muted");
      })
      .catch(() => {
        // Autoplay blocked — user must click the toggle button
      });
  }
}

// Toggle music on/off
window.toggleGlobalMusic = function() {
  if (!globalMusic) return;

  if (globalMusicPlaying) {
    globalMusic.pause();
    globalMusicPlaying = false;
    if (globalMusicBtn) globalMusicBtn.classList.add("muted");
  } else {
    globalMusic.volume = 0.35;
    globalMusic.play()
      .then(() => {
        globalMusicPlaying = true;
        if (globalMusicBtn) globalMusicBtn.classList.remove("muted");
      })
      .catch(() => {});
  }
};

// ── STARFIELD ──────────────────────────────────
(function initStarfield() {
  const canvas = document.getElementById("starfield");
  const ctx = canvas.getContext("2d");
  let stars = [];
  const STAR_COUNT = 180;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createStar() {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.8 + 0.3,
      alpha: Math.random(),
      speed: Math.random() * 0.4 + 0.1,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
      twinkleDir: Math.random() > 0.5 ? 1 : -1,
    };
  }

  function initStars() {
    stars = Array.from({ length: STAR_COUNT }, createStar);
  }

  function drawStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach((s) => {
      // Twinkle
      s.alpha += s.twinkleSpeed * s.twinkleDir;
      if (s.alpha > 1)      { s.alpha = 1;  s.twinkleDir = -1; }
      if (s.alpha < 0.1)    { s.alpha = 0.1; s.twinkleDir = 1; }

      // Slow drift upward
      s.y -= s.speed;
      if (s.y < 0) { s.y = canvas.height; s.x = Math.random() * canvas.width; }

      // Draw
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 220, 255, ${s.alpha})`;
      ctx.shadowBlur = 6;
      ctx.shadowColor = "rgba(255, 110, 199, 0.8)";
      ctx.fill();
    });
    requestAnimationFrame(drawStars);
  }

  window.addEventListener("resize", () => { resize(); initStars(); });
  resize();
  initStars();
  drawStars();
})();

// ── FLOATING EMOJIS ────────────────────────────
(function initFloaters() {
  const container = document.getElementById("floaters");
  const emojis = CONFIG.floaterEmojis;
  const total = 14;

  for (let i = 0; i < total; i++) {
    const el = document.createElement("span");
    el.classList.add("floater");
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];

    const left      = Math.random() * 100;
    const duration  = Math.random() * 12 + 10;      // 10s – 22s
    const delay     = Math.random() * 15;
    const size      = Math.random() * 1 + 1;         // 1rem – 2rem

    el.style.cssText = `
      left: ${left}%;
      font-size: ${size}rem;
      animation-duration: ${duration}s;
      animation-delay: -${delay}s;
    `;
    container.appendChild(el);
  }
})();

// ── TYPED.JS ───────────────────────────────────
function initTyped() {
  new Typed("#typed-text", {
    strings: CONFIG.typedStrings,
    typeSpeed: 45,
    backSpeed: 25,
    backDelay: 2000,
    startDelay: 800,
    loop: true,
    smartBackspace: true,
  });
}

// ── SCREEN MANAGER ─────────────────────────────
const screens = {
  welcome:        document.getElementById("welcome-screen"),
  verify:         document.getElementById("verify-screen"),
  denied:         document.getElementById("denied-screen"),
  song:           document.getElementById("song-screen"),
  peopleIntro:    document.getElementById("people-intro-screen"),
  envelopeGarden: document.getElementById("envelope-garden-screen"),
  mwIntro:        document.getElementById("mw-intro-screen"),
  mwWall:         document.getElementById("mw-wall-screen"),
  finale:         document.getElementById("finale-screen"),
};

function switchScreen(from, to, animateCard) {
  const fromScreen = screens[from];
  const toScreen   = screens[to];

  // Fade out current
  gsap.to(fromScreen, {
    opacity: 0,
    duration: 0.4,
    onComplete: () => {
      fromScreen.classList.remove("active");
      toScreen.classList.add("active");

      // Fade + slide in new screen
      gsap.fromTo(
        toScreen,
        { opacity: 0 },
        { opacity: 1, duration: 0.5 }
      );

      if (animateCard) {
        gsap.fromTo(
          toScreen.querySelector(".card"),
          { y: 40, opacity: 0, scale: 0.95 },
          { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.4)" }
        );
      }
    },
  });
}

// ── WELCOME SCREEN ENTRANCE ────────────────────
function animateWelcomeEntrance() {
  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

  tl.set("#welcome-screen", { opacity: 1 })
    .from("#welcome-card",    { y: 60, opacity: 0, scale: 0.9, duration: 0.9, ease: "back.out(1.6)" })
    .from(".sparkle-bar",     { opacity: 0, y: -10, duration: 0.4 }, "-=0.4")
    .from("#mission-title",   { opacity: 0, y: 20, duration: 0.5 }, "-=0.2")
    .from(".hello-line",      { opacity: 0, x: -20, duration: 0.4 }, "-=0.1")
    .from(".typed-container", { opacity: 0, duration: 0.4 }, "-=0.1")
    .from("#start-btn",       { opacity: 0, y: 15, scale: 0.8, duration: 0.5, ease: "back.out(2)" }, "+=0.2")
    .from(".credit-text",     { opacity: 0, duration: 0.4 }, "-=0.1")
    .call(initTyped) // start typing only after animation
    .call(tryStartGlobalMusic, null, "+=0.8"); // try to start music after welcome animation
}

// ── BUTTON: Start Mission ──────────────────────
window.goToVerification = function () {
  tryStartGlobalMusic(); // Ensure music starts on user interaction
  track("screen_verify"); // ← invisible tracking
  sfx_startMission();
  gsap.to("#start-btn", {
    scale: 0.9,
    duration: 0.1,
    yoyo: true,
    repeat: 1,
    onComplete: () => {
      switchScreen("welcome", "verify", false);
      setTimeout(() => startVerifyTerminal(), 500);
    },
  });
};

// ── WISTERIA TERMINAL ENGINE ───────────────────────────────

/* ── WEB AUDIO CONTEXT ── */
let audioCtx = null;

function getAudioCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}

/* ==============================================
   UNIFIED SOUND LIBRARY
   All named sound functions for every interaction
   =============================================== */

// ── UTILITY: safe oscillator helper ───────────
function _osc(type, freq, gainVal, duration, startDelay = 0, freqEnd = null) {
  try {
    const ctx  = getAudioCtx();
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime + startDelay);
    if (freqEnd !== null) {
      osc.frequency.exponentialRampToValueAtTime(freqEnd, ctx.currentTime + startDelay + duration);
    }
    gain.gain.setValueAtTime(gainVal, ctx.currentTime + startDelay);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startDelay + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime + startDelay);
    osc.stop(ctx.currentTime + startDelay + duration + 0.01);
  } catch(e) {}
}

// ── SCREEN 1: WELCOME ─────────────────────────

// 🚀 Start Mission — whoosh + rising launch tone
function sfx_startMission() {
  try {
    const ctx = getAudioCtx();
    // Whoosh
    const buf = ctx.createBuffer(1, ctx.sampleRate * 0.35, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
    }
    const src    = ctx.createBufferSource();
    const filter = ctx.createBiquadFilter();
    const gain   = ctx.createGain();
    src.buffer         = buf;
    filter.type        = "bandpass";
    filter.frequency.setValueAtTime(200, ctx.currentTime);
    filter.frequency.linearRampToValueAtTime(1800, ctx.currentTime + 0.35);
    filter.Q.value     = 0.8;
    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
    src.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
    src.start(ctx.currentTime);
    // Rising launch tone on top
    _osc("sine", 200, 0.08, 0.4, 0, 900);
    _osc("triangle", 400, 0.05, 0.3, 0.1, 1200);
  } catch(e) {}
}

// ── SCREEN 2: IDENTITY VERIFICATION ──────────

// ⚔️ Obviously — sword strike shimmer
function sfx_obviously() {
  try {
    _osc("sawtooth", 180, 0.07, 0.08);
    _osc("sine",     440, 0.06, 0.25, 0.06, 880);
    _osc("triangle", 880, 0.04, 0.3,  0.12, 1760);
    // Metallic shimmer
    [1200, 1600, 2100].forEach((f, i) => _osc("sine", f, 0.025, 0.2, i * 0.04));
  } catch(e) {}
}

// 🏃 I'm not Sneha — heavy thud + low buzzer
function sfx_notSneha() {
  try {
    const ctx  = getAudioCtx();
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(120, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.25);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    osc.connect(gain); gain.connect(ctx.destination);
    osc.start(); osc.stop(ctx.currentTime + 0.35);
    _osc("sawtooth", 80, 0.08, 0.2, 0.05, 40);
  } catch(e) {}
}

// [ Fine... Let me in ] — denied gone, retry beep
function sfx_fineLetMeIn() {
  try {
    _osc("square", 300, 0.04, 0.06);
    _osc("square", 450, 0.04, 0.06, 0.08);
    _osc("sine",   600, 0.05, 0.2,  0.16, 900);
  } catch(e) {}
}

// ── CONFETTI ───────────────────────────────────

// ❌ Wrong pick — dull thud + low tone (used by song screen)
function sfx_puzzleWrong() {
  try {
    _osc("sine",     80,  0.12, 0.25, 0,    40);
    _osc("sawtooth", 140, 0.06, 0.2,  0.03, 70);
  } catch(e) {}
}

// 🔐 Next Mission / proceed — lock click + whoosh
function sfx_nextMission() {
  try {
    _osc("square",   600, 0.07, 0.04);
    _osc("square",   300, 0.06, 0.04, 0.04);
    _osc("sine",     300, 0.06, 0.4,  0.06, 1200);
    _osc("triangle", 523, 0.05, 0.3,  0.2);
    _osc("triangle", 659, 0.05, 0.3,  0.3);
  } catch(e) {}
}

// ── SCREEN 15: MEMORY WALL INTRO ─────────────

// 📸 Open the Wall — camera shutter snap
function sfx_openWall() {
  try {
    const ctx  = getAudioCtx();
    // Mechanical shutter click
    const buf  = ctx.createBuffer(1, ctx.sampleRate * 0.06, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (data.length * 0.2));
    }
    const src  = ctx.createBufferSource();
    const gain = ctx.createGain();
    src.buffer = buf;
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    src.connect(gain); gain.connect(ctx.destination);
    src.start();
    // Second click (mirror/shutter close)
    setTimeout(() => {
      try {
        const src2  = ctx.createBufferSource();
        const g2    = ctx.createGain();
        src2.buffer = buf;
        g2.gain.setValueAtTime(0.15, ctx.currentTime);
        src2.connect(g2); g2.connect(ctx.destination);
        src2.start();
      } catch(e) {}
    }, 80);
    // Warm tone after
    _osc("sine", 440, 0.05, 0.3, 0.1);
  } catch(e) {}
}

// 📷 Polaroid card flip — card whoosh
function sfx_cardFlip() {
  try {
    const ctx  = getAudioCtx();
    const buf  = ctx.createBuffer(1, ctx.sampleRate * 0.18, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      const t = i / data.length;
      data[i] = (Math.random() * 2 - 1) * Math.sin(t * Math.PI) * 0.6;
    }
    const src    = ctx.createBufferSource();
    const filter = ctx.createBiquadFilter();
    const gain   = ctx.createGain();
    src.buffer         = buf;
    filter.type        = "bandpass";
    filter.frequency.value = 1200;
    filter.Q.value     = 1.5;
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
    src.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
    src.start();
  } catch(e) {}
}

// 📖 Memory modal open — paper rustle
function sfx_modalOpen() {
  try {
    const ctx  = getAudioCtx();
    const buf  = ctx.createBuffer(1, ctx.sampleRate * 0.25, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      const t = i / data.length;
      data[i] = (Math.random() * 2 - 1) * (t < 0.3 ? t / 0.3 : 1 - t) * 0.5;
    }
    const src    = ctx.createBufferSource();
    const filter = ctx.createBiquadFilter();
    const gain   = ctx.createGain();
    src.buffer       = buf;
    filter.type      = "highpass";
    filter.frequency.value = 800;
    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28);
    src.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
    src.start();
    _osc("sine", 660, 0.04, 0.2, 0.08);
  } catch(e) {}
}

// ✕ Memory modal close — soft paper dismiss
function sfx_modalClose() {
  try {
    _osc("sine", 660, 0.04, 0.12, 0,    440);
    _osc("sine", 440, 0.03, 0.12, 0.08, 300);
  } catch(e) {}
}

// 💌 Continue / Memory Wall done — gentle bell
function sfx_continueWall() {
  try {
    _osc("sine",     523, 0.08, 0.5);
    _osc("sine",     784, 0.06, 0.45, 0.08);
    _osc("sine",     1047,0.05, 0.4,  0.16);
    _osc("triangle", 1568,0.03, 0.3,  0.24);
  } catch(e) {}
}

// ── SCREEN 17: GRAND FINALE ───────────────────

// ▶/⏸ Music toggle — vinyl start click
function sfx_musicToggle(isPlaying) {
  try {
    if (isPlaying) {
      // Starting — vinyl crackle + rising tone
      const ctx  = getAudioCtx();
      const buf  = ctx.createBuffer(1, ctx.sampleRate * 0.12, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * 0.15;
      const src   = ctx.createBufferSource();
      const gain  = ctx.createGain();
      src.buffer  = buf;
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      src.connect(gain); gain.connect(ctx.destination);
      src.start();
      _osc("sine", 330, 0.06, 0.3, 0.05, 660);
    } else {
      // Pausing — descending stop
      _osc("sine", 440, 0.06, 0.2, 0, 200);
      _osc("sine", 220, 0.04, 0.15, 0.1, 100);
    }
  } catch(e) {}
}

// 🔄 Restart Experience — rewind sweep
function sfx_restart() {
  try {
    const steps = [800, 650, 500, 380, 260, 180];
    steps.forEach((f, i) => _osc("square", f, 0.04, 0.1, i * 0.06));
    _osc("sine", 180, 0.06, 0.3, steps.length * 0.06, 80);
  } catch(e) {}
}

/* ── SOUND EFFECTS ── */

function playTerminalBeep(freq = 440, duration = 0.06, vol = 0.04) {
  try {
    const ctx  = getAudioCtx();
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "square";
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration + 0.01);
  } catch(e) {}
}

function playTerminalType() {
  playTerminalBeep(800 + Math.random() * 400, 0.04, 0.025);
}

function playProgressTick() {
  playTerminalBeep(300 + Math.random() * 100, 0.03, 0.02);
}

function playDetectedChime() {
  // Rising three-note chime
  const ctx = getAudioCtx();
  [523, 659, 784].forEach((f, i) => {
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(f, ctx.currentTime + i * 0.14);
    gain.gain.setValueAtTime(0.08, ctx.currentTime + i * 0.14);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.14 + 0.4);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime + i * 0.14);
    osc.stop(ctx.currentTime + i * 0.14 + 0.45);
  });
}

function playAlertSiren() {
  try {
    const ctx  = getAudioCtx();
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(220, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(440, ctx.currentTime + 0.3);
    osc.frequency.linearRampToValueAtTime(220, ctx.currentTime + 0.6);
    osc.frequency.linearRampToValueAtTime(440, ctx.currentTime + 0.9);
    osc.frequency.linearRampToValueAtTime(220, ctx.currentTime + 1.2);
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.07, ctx.currentTime + 0.05);
    gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 1.0);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.4);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 1.5);
  } catch(e) {}
}

function playConfirmedFanfare() {
  try {
    const ctx = getAudioCtx();
    const notes = [523, 659, 784, 1047];
    notes.forEach((f, i) => {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(f, ctx.currentTime + i * 0.1);
      gain.gain.setValueAtTime(0.09, ctx.currentTime + i * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.1 + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.1);
      osc.stop(ctx.currentTime + i * 0.1 + 0.55);
    });
  } catch(e) {}
}

/* ── LINE DEFINITIONS ── */

const VERIFY_LINES = [
  { text: "",                                          cls: "dim",         pause: 0    },
  { text: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",         cls: "divider",     pause: 120  },
  { text: "",                                          cls: "dim",         pause: 60   },
  { text: "        WISTERIA SYSTEM",                   cls: "bright",      pause: 180  },
  { text: "",                                          cls: "dim",         pause: 60   },
  { text: "     IDENTITY VERIFICATION",                cls: "label",       pause: 140  },
  { text: "",                                          cls: "dim",         pause: 60   },
  { text: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",         cls: "divider",     pause: 120  },
  { text: "",                                          cls: "dim",         pause: 200  },
  { text: "Scanning unknown visitor...",               cls: "dim",         pause: 300  },
  { text: "",                                          cls: "dim",         pause: 100  },
  { type: "progress",                                                       pause: 1800 },
  { text: "",                                          cls: "dim",         pause: 300  },
  { text: "Possible identity detected...",             cls: "warning",     pause: 500, sound: "chime" },
  { text: "",                                          cls: "dim",         pause: 200  },
  { text: "S N E H A",                                cls: "name",        pause: 600  },
  { text: "",                                          cls: "dim",         pause: 120  },
  { text: "Confidence: 99.97%",                        cls: "confidence",  pause: 400  },
  { text: "",                                          cls: "dim",         pause: 100  },
  { text: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",         cls: "divider",     pause: 200  },
  { text: "",                                          cls: "dim",         pause: 300  },
  { text: "⚠️  ONE QUESTION REMAINS",                  cls: "big-warning", pause: 500  },
  { text: "",                                          cls: "dim",         pause: 200  },
  { text: "Are you REALLY Sneha?",                     cls: "bold-white",  pause: 400  },
  { text: "",                                          cls: "dim",         pause: 120  },
  { text: "Think carefully.",                          cls: "italic-dim",  pause: 300  },
  { text: "",                                          cls: "dim",         pause: 120  },
  { text: "There is no going back. 👀",                cls: "dim",         pause: 600  },
  { text: "",                                          cls: "dim",         pause: 0    },
];

const DENIED_LINES = [
  { text: "",                                          cls: "dim",         pause: 0    },
  { text: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",         cls: "divider",     pause: 80   },
  { text: "",                                          cls: "dim",         pause: 60   },
  { text: "🚨  SYSTEM ALERT  🚨",                      cls: "danger",      pause: 300, sound: "siren" },
  { text: "",                                          cls: "dim",         pause: 100  },
  { text: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",         cls: "divider",     pause: 80   },
  { text: "",                                          cls: "dim",         pause: 300  },
  { text: "Nice try.",                                 cls: "bright",      pause: 400  },
  { text: "",                                          cls: "dim",         pause: 100  },
  { text: "Your browser history says otherwise. 😂",   cls: "dim",         pause: 600  },
  { text: "",                                          cls: "dim",         pause: 200  },
  { text: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",         cls: "divider",     pause: 120  },
  { text: "",                                          cls: "dim",         pause: 100  },
  { text: "IDENTITY:",                                 cls: "label",       pause: 200  },
  { text: "Sneha",                                     cls: "name",        pause: 400  },
  { text: "",                                          cls: "dim",         pause: 100  },
  { text: "STATUS:",                                   cls: "label",       pause: 200  },
  { text: "Caught.",                                   cls: "danger",      pause: 400  },
  { text: "",                                          cls: "dim",         pause: 200  },
  { text: "Nice attempt though. 👀",                   cls: "italic-dim",  pause: 500  },
  { text: "",                                          cls: "dim",         pause: 100  },
  { text: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",         cls: "divider",     pause: 200  },
  { text: "",                                          cls: "dim",         pause: 0    },
];

const CONFIRMED_LINES = [
  { text: "",                                          cls: "dim",         pause: 0    },
  { text: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",         cls: "divider",     pause: 80   },
  { text: "",                                          cls: "dim",         pause: 60   },
  { text: "🌸  IDENTITY CONFIRMED",                    cls: "success",     pause: 300, sound: "fanfare" },
  { text: "",                                          cls: "dim",         pause: 100  },
  { text: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",         cls: "divider",     pause: 80   },
  { text: "",                                          cls: "dim",         pause: 300  },
  { text: "Welcome, Sneha.",                           cls: "bright",      pause: 400  },
  { text: "",                                          cls: "dim",         pause: 200  },
  { text: "The Wisteria Gate recognizes you.",         cls: "dim",         pause: 500  },
  { text: "",                                          cls: "dim",         pause: 200  },
  { text: "But...",                                    cls: "warning",     pause: 700  },
  { text: "",                                          cls: "dim",         pause: 200  },
  { text: "there's one problem.",                      cls: "dim",         pause: 500  },
  { text: "",                                          cls: "dim",         pause: 200  },
  { text: "Your birthday surprise",                    cls: "bold-white",  pause: 300  },
  { text: "has already begun. 😈",                     cls: "bold-white",  pause: 800  },
  { text: "",                                          cls: "dim",         pause: 0    },
];

/* ── TERMINAL RENDERER ── */

function renderTerminalLines(containerId, lines, onComplete) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = "";

  let i = 0;
  let totalDelay = 0;

  lines.forEach((line, idx) => {
    if (line.type === "progress") {
      // Progress bar element
      const wrap = document.createElement("div");
      wrap.className = "t-progress-wrap";
      wrap.innerHTML = `
        <div class="t-progress-bar-track">
          <div class="t-progress-bar-fill" id="t-prog-fill-${idx}"></div>
        </div>
        <span class="t-progress-pct" id="t-prog-pct-${idx}">0%</span>
      `;
      container.appendChild(wrap);

      setTimeout(() => {
        wrap.classList.add("show");
        animateTerminalProgress(
          `t-prog-fill-${idx}`,
          `t-prog-pct-${idx}`,
          78,
          1400
        );
      }, totalDelay);

    } else {
      // Text line
      const span = document.createElement("span");
      span.className = `t-line ${line.cls || ""}`;
      span.textContent = line.text || "\u00A0";
      container.appendChild(span);

      setTimeout(() => {
        span.classList.add("show");
        // Sound triggers
        if (line.sound === "chime")   { try { playDetectedChime(); } catch(e) {} }
        if (line.sound === "siren")   { try { playAlertSiren();    } catch(e) {} }
        if (line.sound === "fanfare") { try { playConfirmedFanfare(); } catch(e) {} }
        if (line.text && line.text.trim()) {
          playTerminalType();
        }
        // Auto-scroll
        container.scrollTop = container.scrollHeight;
      }, totalDelay);
    }

    totalDelay += line.pause || 0;
  });

  // onComplete fires after all lines shown
  if (onComplete) {
    setTimeout(onComplete, totalDelay + 100);
  }
}

function animateTerminalProgress(fillId, pctId, targetPct, duration) {
  const fill  = document.getElementById(fillId);
  const label = document.getElementById(pctId);
  if (!fill || !label) return;

  const startTime = performance.now();

  function tick(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease-out
    const eased = 1 - Math.pow(1 - progress, 2);
    const pct   = Math.round(eased * targetPct);

    fill.style.width    = pct + "%";
    label.textContent   = pct + "%";

    if (Math.random() < 0.15) playProgressTick();

    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  }

  requestAnimationFrame(tick);
}

/* ── SCREEN ENTRY: start verify terminal ── */
function startVerifyTerminal() {
  const body   = document.getElementById("terminal-body");
  const btnRow = document.getElementById("terminal-btn-row");
  if (!body) return;

  // Resume audio
  try { getAudioCtx().resume(); } catch(e) {}

  renderTerminalLines("terminal-body", VERIFY_LINES, () => {
    // Reveal buttons
    btnRow.style.opacity       = "1";
    btnRow.style.pointerEvents = "all";
    gsap.fromTo(btnRow,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
    );
  });
}

/* ── BUTTON: Identity Verify ── */
window.handleVerify = function (choice) {
  try { getAudioCtx().resume(); } catch(e) {}

  if (choice === "no") {
    sfx_notSneha();
    track("screen_denied"); // ← invisible tracking
    const verifyScreen = screens.verify;
    gsap.to(verifyScreen, {
      opacity: 0, duration: 0.3,
      onComplete: () => {
        verifyScreen.classList.remove("active");
        screens.denied.classList.add("active");
        gsap.fromTo(screens.denied, { opacity: 0 }, { opacity: 1, duration: 0.4 });
        setTimeout(() => startDeniedTerminal(), 200);
      },
    });

  } else {
    sfx_obviously();
    const btnRow = document.getElementById("terminal-btn-row");
    gsap.to(btnRow, { opacity: 0, duration: 0.2 });

    setTimeout(() => {
      renderTerminalLines("terminal-body", CONFIRMED_LINES, () => {
        setTimeout(() => {
          gsap.to(screens.verify, {
            opacity: 0, duration: 0.6,
            onComplete: () => {
              screens.verify.classList.remove("active");
              screens.song.classList.add("active");
              gsap.fromTo(screens.song, { opacity: 0 }, { opacity: 1, duration: 0.6 });
              track("screen_song"); // ← invisible tracking
              setTimeout(() => initSongScreen(), 300);
            },
          });
        }, 900);
      });
    }, 200);
  }
};

/* ── DENIED TERMINAL ── */
function startDeniedTerminal() {
  const body   = document.getElementById("denied-body");
  const btnRow = document.getElementById("denied-btn-row");
  if (!body) return;

  renderTerminalLines("denied-body", DENIED_LINES, () => {
    btnRow.style.opacity       = "1";
    btnRow.style.pointerEvents = "all";
    gsap.fromTo(btnRow,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
    );
  });
}

/* ── BUTTON: Go Back (from denied) ── */
window.goBack = function () {
  sfx_fineLetMeIn();
  gsap.to(screens.denied, {
    opacity: 0, duration: 0.3,
    onComplete: () => {
      screens.denied.classList.remove("active");
      const body   = document.getElementById("terminal-body");
      const btnRow = document.getElementById("terminal-btn-row");
      if (body)   body.innerHTML = "";
      if (btnRow) { btnRow.style.opacity = "0"; btnRow.style.pointerEvents = "none"; }
      screens.verify.classList.add("active");
      gsap.fromTo(screens.verify, { opacity: 0 }, { opacity: 1, duration: 0.4 });
      setTimeout(() => startVerifyTerminal(), 200);
    },
  });
};


// ── CONFETTI ───────────────────────────────────
function launchConfetti() {
  const colors = ["#ff6ec7", "#a855f7", "#facc15", "#60a5fa", "#f472b6"];

  confetti({
    particleCount: 120,
    spread: 80,
    origin: { y: 0.5 },
    colors,
    scalar: 1.1,
  });

  setTimeout(() => {
    confetti({
      particleCount: 60,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.6 },
      colors,
    });
    confetti({
      particleCount: 60,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.6 },
      colors,
    });
  }, 400);
}

// ── INIT ───────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  // Small delay so fonts + libs load
  setTimeout(animateWelcomeEntrance, 150);

  // ── INVISIBLE TRACKING ──
  track("site_opened");
  track("screen_welcome");
});

/* =========================================================
   PART 2 — THE SONG THAT KNOWS ENGINE
   ========================================================= */

const SONGS = [
  {
    text:    "hum tere pyar me sara alam kho baithe",
    correct: true,
    wrongMsg: null,
  },
  {
    text:    "abhi na jao chhod kar",
    correct: false,
    wrongMsg: "🎵 A beautiful farewell... but not the one the forest remembers.",
  },
  {
    text:    "itna na mujhse pyar badha",
    correct: false,
    wrongMsg: "🌸 So tender... but the melody fades. Try again.",
  },
  {
    text:    "bahon mein chale aao",
    correct: false,
    wrongMsg: "🌿 The forest stirs... but this isn't the song. Listen closer.",
  },
];

// ── SOUND: wisteria chime on scroll pick ──
function sfx_scrollPick() {
  try {
    const ctx = getAudioCtx();
    [523, 659, 784].forEach((f, i) => {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(f, ctx.currentTime + i * 0.1);
      gain.gain.setValueAtTime(0.07, ctx.currentTime + i * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.1 + 0.5);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.1);
      osc.stop(ctx.currentTime + i * 0.1 + 0.55);
    });
  } catch(e) {}
}

// ── SOUND: forest correct burst ──
function sfx_songCorrect() {
  try {
    const ctx   = getAudioCtx();
    const notes = [392, 523, 659, 784, 1047, 1319];
    notes.forEach((f, i) => {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = i % 2 === 0 ? "sine" : "triangle";
      osc.frequency.setValueAtTime(f, ctx.currentTime + i * 0.08);
      gain.gain.setValueAtTime(0.08, ctx.currentTime + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.08 + 0.6);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.08);
      osc.stop(ctx.currentTime + i * 0.08 + 0.65);
    });
    // Wind sweep
    const buf  = ctx.createBuffer(1, ctx.sampleRate * 0.5, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i/data.length) * 0.3;
    const src    = ctx.createBufferSource();
    const filter = ctx.createBiquadFilter();
    const wgain  = ctx.createGain();
    src.buffer = buf; filter.type = "highpass"; filter.frequency.value = 1500;
    wgain.gain.setValueAtTime(0.15, ctx.currentTime);
    wgain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    src.connect(filter); filter.connect(wgain); wgain.connect(ctx.destination);
    src.start();
  } catch(e) {}
}

// ── INIT SONG SCREEN ──
function initSongScreen() {
  // Spawn floating note particles
  spawnSongNotes();

  // Animate scrolls in (CSS handles stagger via animation-delay)
  const scrolls = document.querySelectorAll(".song-scroll");
  scrolls.forEach(s => {
    s.classList.remove("scroll-correct", "scroll-wrong", "scroll-dimmed");
    s.style.pointerEvents = "all";
    s.style.opacity       = "";
  });

  const fb = document.getElementById("song-feedback");
  if (fb) { fb.textContent = ""; fb.className = "song-feedback"; }
}

function spawnSongNotes() {
  const layer = document.getElementById("song-notes-layer");
  if (!layer) return;
  layer.innerHTML = "";

  const symbols = ["♩","♪","♫","♬","𝄞","𝄢","♭","♮"];
  for (let i = 0; i < 18; i++) {
    const el  = document.createElement("div");
    el.className   = "song-note-particle";
    el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    const left = Math.random() * 100;
    const dur  = 8 + Math.random() * 10;
    const delay = Math.random() * 12;
    el.style.left                = left + "%";
    el.style.fontSize            = (0.8 + Math.random() * 0.8) + "rem";
    el.style.animationDuration   = dur + "s";
    el.style.animationDelay      = `-${delay}s`;
    layer.appendChild(el);
  }
}

// ── SELECT SONG SCROLL ──
window.selectSongScroll = function (index) {
  const scrolls = document.querySelectorAll(".song-scroll");
  const song    = SONGS[index];
  const fb      = document.getElementById("song-feedback");

  sfx_scrollPick();

  if (song.correct) {
    // ── CORRECT ──────────────────────────────
    sfx_songCorrect();
    track("song_correct"); // ← invisible tracking

    // Mark correct, dim others
    scrolls.forEach((s, i) => {
      if (i === index) s.classList.add("scroll-correct");
      else             s.classList.add("scroll-dimmed");
      s.style.pointerEvents = "none";
    });

    // Feedback
    fb.textContent = "🌟 The forest remembers this song... it knows you.";
    fb.className   = "song-feedback show right-msg";

    // Music box burst icon
    const icon = document.getElementById("song-box-icon");
    gsap.to(icon, { scale: 1.6, duration: 0.3, ease: "back.out(2)",
      onComplete: () => gsap.to(icon, { scale: 1, duration: 0.4 }) });

    // Golden burst overlay
    const burst = document.createElement("div");
    burst.className = "song-correct-burst";
    document.body.appendChild(burst);
    setTimeout(() => burst.remove(), 1100);

    // Confetti
    setTimeout(() => {
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.5 },
        colors: ["#facc15","#c084fc","#f472b6","#fff","#86efac"],
        scalar: 1.1,
      });
    }, 400);

    // Transition to People Intro
    setTimeout(() => {
      gsap.to(screens.song, {
        opacity: 0, duration: 0.7,
        onComplete: () => {
          screens.song.classList.remove("active");
          screens.peopleIntro.classList.add("active");
          gsap.fromTo(screens.peopleIntro, { opacity: 0 }, { opacity: 1, duration: 0.6 });
          track("screen_people_intro"); // ← invisible tracking
          setTimeout(() => animatePeopleIntro(), 300);
        },
      });
    }, 2600);

  } else {
    // ── WRONG ────────────────────────────────
    sfx_puzzleWrong();
    track("song_wrong", { song_index: index }); // ← invisible tracking

    // Shake & dim the wrong scroll
    scrolls[index].classList.add("scroll-wrong");
    fb.textContent = song.wrongMsg;
    fb.className   = "song-feedback show wrong-msg";

    // Re-enable after shake
    setTimeout(() => {
      scrolls[index].classList.remove("scroll-wrong");
      scrolls[index].style.pointerEvents = "all";
      setTimeout(() => {
        fb.className = "song-feedback";
      }, 600);
    }, 900);
  }
};

/* =========================================================
   PART 4 — PEOPLE INTRO + ENVELOPE GARDEN + LETTER MODAL
   ========================================================= */

// ── FRIENDS DATA ───────────────────────────────────────────
// Each entry: { id, name, emoji, colour, quote, message, sign, imageEmoji }
// imageEmoji = a placeholder emoji shown in the polaroid (no real photo needed)
const FRIENDS = [
  {
    id:         1,
    name:       "Rupal",
    emoji:      "🌸",
    colour:     "#f9a8d4",   // soft pink
    quote:      "\"Some friendships are written in the stars.\"",
    imageEmoji: "🌸",
    message:    "From day one, Sneha felt like family. ❤️❤️\n\nA pure heart, a golden soul, and a laugh that somehow has the power to fix even the worst days. ✨ Sneha is always there for everyone, always supporting, always caring, and never expecting anything in return.\n\nBecause of Sneha, work never really feels like work. The random conversations, endless laughs, silly moments, and all those little things make even the most ordinary days memorable.\n\nThank you, Sneha, for being my best buddy, my comfort person at the office, and someone I can always count on. 🧡🧡\n\nAnd yes... Sneha is officially my laughing buddy — because apparently, we don't need a reason to laugh. 😂❤️",
    sign:       "— Rupal 💕",
  },
  {
    id:         2,
    name:       "Shamali",
    emoji:      "⭐",
    colour:     "#fde68a",   // warm gold
    quote:      "\"The best people make ordinary days extraordinary.\"",
    imageEmoji: "⭐",
    message:    "Snehudii.....\n\nYou are someone who can make anyone feel comfortable and involved like you did with me when we first met. And now I can't imagine my life without you.\n\nYou have become an integral part of my life and I only have few of these people — and you are one of them.\n\nLove u to the infinity and beyond. Happiest birthday to u and luckiest day for me that u were born this day 🫣😘",
    sign:       "— Shamali 🌟",
  },
  {
    id:         3,
    name:       "The Prince of Jabalpur",
    emoji:      "🎶",
    colour:     "#c4b5fd",   // lavender
    quote:      "\"Good friends are like stars — you don't always see them, but they're always there.\"",
    imageEmoji: "🎶",
    message:    "The heart of our group and one of the kindest, most beautiful, and effortlessly charming people I know. ❤️✨\n\nKeep smiling, keep shining, and keep being the wonderful Sneha you are.\n\nWith limited words, but unlimited wishes…",
    sign:       "— The Prince of Jabalpur 👑😎",
  },
  {
    id:         4,
    name:       "Akash",
    emoji:      "🦋",
    colour:     "#6ee7b7",   // mint green
    quote:      "\"You are braver than you believe and more talented than you think.\"",
    imageEmoji: "🦋",
    message:    "Hello Snehaa...\n\nHappy Birthday to one of the kindest and most caring souls I know. Your selfless heart and the way you always put others before yourself are truly inspiring. Wishing you endless happiness, good health, and all the love you deserve. ❤️",
    sign:       "— Akash 🦋",
  },
  {
    id:         5,
    name:       "Teju",
    emoji:      "🌼",
    colour:     "#fda4af",   // soft rose
    quote:      "\"Some people make the world a better place just by being in it.\"",
    imageEmoji: "🌼",
    message:    "Hi Snehaaa…\nHappiest birthday to my friend, who is the epitome of selflessness, if there is anything that anyone should adapt from you, then that would be selflessness. You taught me how to be caring and loving.\n\nThank you dost, have a blast birthday and have a wonderful life ahead.\n🎂🎂🎂🍰🥮🧁🧁",
    sign:       "— Teju 🌼",
  },
];

// ── STATE ──────────────────────────────────────────────────
const envState = {
  opened:       new Set(),
  currentLetter: null,
  allFriendsDone: false,
};

// ── SOUND: envelope open ──
function sfx_envelopeOpen() {
  try {
    const ctx  = getAudioCtx();
    const buf  = ctx.createBuffer(1, ctx.sampleRate * 0.3, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      const t = i / data.length;
      data[i] = (Math.random() * 2 - 1) * Math.sin(t * Math.PI) * 0.4;
    }
    const src    = ctx.createBufferSource();
    const filter = ctx.createBiquadFilter();
    const gain   = ctx.createGain();
    src.buffer         = buf;
    filter.type        = "highpass";
    filter.frequency.value = 600;
    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.32);
    src.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
    src.start();
    // Soft shimmer note
    _osc("sine", 880, 0.05, 0.3, 0.05, 660);
    _osc("sine", 660, 0.04, 0.25, 0.2, 520);
  } catch(e) {}
}

// ── SOUND: black envelope reveal ──
function sfx_blackEnvelopeReveal() {
  try {
    const ctx   = getAudioCtx();
    const notes = [220, 277, 330, 415, 523, 659, 784];
    notes.forEach((f, i) => {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = i < 4 ? "triangle" : "sine";
      osc.frequency.setValueAtTime(f, ctx.currentTime + i * 0.12);
      gain.gain.setValueAtTime(0.06, ctx.currentTime + i * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.6);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.12);
      osc.stop(ctx.currentTime + i * 0.12 + 0.65);
    });
  } catch(e) {}
}

// ── ANIMATE PEOPLE INTRO ──────────────────────────────────
function animatePeopleIntro() {

  /* ─ 1. Spawn floating wisteria petals ─ */
  (function spawnPetals() {
    const layer  = document.getElementById("pi-petals");
    if (!layer) return;
    layer.innerHTML = "";
    const symbols = ["🌸","🌺","✿","❀","🌷","💮","🪷"];
    for (let i = 0; i < 22; i++) {
      const el = document.createElement("div");
      el.className = "pi-petal";
      el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      const left  = Math.random() * 105;
      const dur   = 9 + Math.random() * 14;
      const delay = Math.random() * 18;
      const drift = (Math.random() - 0.5) * 120;
      const spin  = 180 + Math.random() * 360;
      el.style.left                = left + "%";
      el.style.fontSize            = (0.55 + Math.random() * 0.7) + "rem";
      el.style.setProperty("--drift", drift + "px");
      el.style.setProperty("--spin",  spin  + "deg");
      el.style.animationDuration   = dur + "s";
      el.style.animationDelay      = `-${delay}s`;
      layer.appendChild(el);
    }
  })();

  /* ─ 2. Card entrance animation ─ */
  const piContent = document.getElementById("pi-content");
  if (piContent) {
    gsap.fromTo(piContent,
      { opacity: 0, y: 35, scale: 0.96 },
      { opacity: 1, y: 0,  scale: 1, duration: 0.8, ease: "back.out(1.5)" }
    );
  }

  /* ─ 4. Three typed lines with timed reveals ─ */
  const LINES = [
    { id: "pi-line-1", text: "A lot of people will wish you today..." },
    { id: "pi-line-2", text: "...but I wanted you to hear from the people" },
    { id: "pi-line-3", text: "who make your world a little brighter." },
  ];

  // Reset everything
  const sparkle = document.getElementById("pi-sparkle");
  const ctaWrap = document.getElementById("pi-cta");

  LINES.forEach(l => {
    const el = document.getElementById(l.id);
    if (el) { el.textContent = ""; el.style.opacity = "0"; }
  });
  if (sparkle) sparkle.style.opacity = "0";
  if (ctaWrap) ctaWrap.classList.remove("visible");

  /* ─ 4. Sparkle entrance ─ */
  setTimeout(() => {
    if (sparkle) {
      gsap.to(sparkle, { opacity: 1, scale: 1.15, duration: 0.6, ease: "back.out(2)",
        onComplete: () => {
          sparkle.style.animationPlayState = "running";
        }
      });
    }
  }, 300);

  /* ─ 5. Type each line with a cursor effect ─ */
  function typeLine(lineEl, text, onDone) {
    lineEl.style.opacity = "1";
    lineEl.textContent   = "";
    const cursor = document.createElement("span");
    cursor.style.cssText = "border-right:2px solid rgba(255,235,255,0.7);margin-left:1px;animation:none;";
    lineEl.appendChild(cursor);
    let i = 0;
    const speed = 36; // ms per char
    function next() {
      if (i < text.length) {
        lineEl.insertBefore(document.createTextNode(text[i]), cursor);
        i++;
        const delay = text[i-1] === "." ? 220 : text[i-1] === "," ? 110 : speed + Math.random() * 12;
        setTimeout(next, delay);
      } else {
        cursor.remove();
        if (onDone) setTimeout(onDone, 280);
      }
    }
    setTimeout(next, 80);
  }

  // Kick off typed sequence
  setTimeout(() => {
    const l1 = document.getElementById("pi-line-1");
    if (!l1) return;
    typeLine(l1, LINES[0].text, () => {
      // After line 1 → pause 800ms → line 2
      setTimeout(() => {
        const l2 = document.getElementById("pi-line-2");
        if (!l2) return;
        typeLine(l2, LINES[1].text, () => {
          // After line 2 → pause 600ms → line 3
          setTimeout(() => {
            const l3 = document.getElementById("pi-line-3");
            if (!l3) return;
            typeLine(l3, LINES[2].text, () => {
              // After line 3 → fade in button
              setTimeout(() => {
                if (ctaWrap) {
                  ctaWrap.classList.add("visible");
                  gsap.fromTo(ctaWrap,
                    { opacity: 0, y: 18 },
                    { opacity: 1, y: 0, duration: 0.7, ease: "back.out(1.6)",
                      onComplete: () => { ctaWrap.style.opacity = ""; } }
                  );
                }
              }, 500);
            });
          }, 600);
        });
      }, 800);
    });
  }, 800); // start line 1 at 800ms after screen appears
}

// ── OPEN ENVELOPE GARDEN ──────────────────────────────────
window.openEnvelopeGarden = function () {
  sfx_nextMission();
  track("screen_envelopes"); // ← invisible tracking
  envState.opened.clear();
  envState.allFriendsDone = false;

  gsap.to(screens.peopleIntro, {
    opacity: 0, duration: 0.5,
    onComplete: () => {
      screens.peopleIntro.classList.remove("active");
      screens.envelopeGarden.classList.add("active");
      gsap.fromTo(screens.envelopeGarden, { opacity: 0 }, { opacity: 1, duration: 0.6 });

      // Hide banners on start
      document.getElementById("env-all-banner").style.display  = "none";
      document.getElementById("env-black-wrap").style.display  = "none";

      setTimeout(() => buildEnvelopeGarden(), 300);
    },
  });
};

// ── BUILD ENVELOPE GARDEN ─────────────────────────────────
function buildEnvelopeGarden() {
  const garden    = document.getElementById("env-garden");
  const starBar   = document.getElementById("env-stars");
  garden.innerHTML = "";
  starBar.innerHTML = "";

  // Star placeholders
  FRIENDS.forEach((friend) => {
    const item = document.createElement("span");
    item.className = "env-star-item";
    item.dataset.id = friend.id;
    item.innerHTML = `<span class="env-star-emoji" style="filter:grayscale(1) brightness(0.4)">☆</span><span class="env-star-name">${friend.name}</span>`;
    starBar.appendChild(item);
    // Animate in
    gsap.fromTo(item, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, delay: 0.1 });
  });

  // Envelopes positioned in a 3-top / 2-bottom grid layout
  const positions = [
    { left: "25%",  top: "35%" },
    { left: "50%",  top: "35%" },
    { left: "75%",  top: "35%" },
    { left: "35%",  top: "65%" },
    { left: "65%",  top: "65%" },
  ];

  FRIENDS.forEach((friend, i) => {
    const env = document.createElement("div");
    env.className      = "env-item";
    env.dataset.id     = friend.id;
    env.style.position = "absolute";
    env.style.left     = positions[i] ? positions[i].left : `${20 + i * 20}%`;
    env.style.top      = positions[i] ? positions[i].top  : "45%";
    env.style.transform = "translate(-50%, -50%)";
    env.style.setProperty("--env-colour", friend.colour);
    env.innerHTML = `
      <div class="env-emoji" style="color:${friend.colour};filter:drop-shadow(0 0 14px ${friend.colour})">💌</div>
      <div class="env-name">${friend.name}</div>
    `;
    env.addEventListener("click", () => openLetter(friend));
    garden.appendChild(env);

    // Stagger pop-in
    gsap.fromTo(env,
      { opacity: 0, scale: 0.5, y: 30 },
      { opacity: 1, scale: 1,   y: 0, duration: 0.55, delay: i * 0.18, ease: "back.out(1.8)" }
    );
  });
}

// ── OPEN LETTER ───────────────────────────────────────────
function openLetter(friend) {
  if (envState.opened.has(friend.id) && !envState.allFriendsDone) {
    // Already opened — just re-show the modal without re-counting
  }
  envState.currentLetter = friend;
  track("letter_opened", { from: friend.name }); // ← invisible tracking
  try { getAudioCtx().resume(); } catch(e) {}
  sfx_envelopeOpen();
  showLetterModal(friend, () => {
    // Called after modal is shown — mark as opened
    if (!envState.opened.has(friend.id)) {
      envState.opened.add(friend.id);
      markEnvelopeOpened(friend.id);
      updateStarBar();
      // Don't trigger banner immediately — let user read the letter first
    }
  });
}

// ── MARK ENVELOPE OPENED ──────────────────────────────────
function markEnvelopeOpened(id) {
  const envCard = document.querySelector(`.env-item[data-id="${id}"]`);
  if (envCard) {
    envCard.classList.add("opened");
    gsap.to(envCard, { scale: 0.92, opacity: 0.35, duration: 0.4 });
  }
}

// ── UPDATE STAR BAR ───────────────────────────────────────
function updateStarBar() {
  envState.opened.forEach((id) => {
    const item = document.querySelector(`.env-star-item[data-id="${id}"]`);
    if (!item) return;
    const starEl = item.querySelector(".env-star-emoji");
    if (starEl) {
      starEl.textContent = "★";
      starEl.style.filter = "drop-shadow(0 0 8px rgba(250,204,21,0.9))";
      starEl.style.color  = "#facc15";
    }
    gsap.fromTo(item, { scale: 0.5 }, { scale: 1, duration: 0.4, ease: "back.out(2)" });
  });
}

// ── ALL LETTERS OPENED ────────────────────────────────────
function onAllLettersOpened() {
  envState.allFriendsDone = true;
  track("all_letters_opened"); // ← invisible tracking

  // Show "all unlocked" banner — CSS uses opacity transition + .show class
  const banner = document.getElementById("env-all-banner");
  banner.style.display = "flex";
  banner.style.pointerEvents = "all";
  setTimeout(() => {
    gsap.to(banner, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" });
  }, 50);

  // Confetti
  confetti({
    particleCount: 100,
    spread: 90,
    origin: { y: 0.5 },
    colors: ["#f9a8d4","#fde68a","#c4b5fd","#6ee7b7","#fff"],
    scalar: 1.0,
  });

  // Reveal black envelope after a beat
  setTimeout(() => {
    const blackWrap = document.getElementById("env-black-wrap");
    blackWrap.style.display = "flex";
    blackWrap.style.pointerEvents = "all";
    gsap.fromTo(blackWrap,
      { opacity: 0, scale: 0.5 },
      { opacity: 1, scale: 1, duration: 0.8, ease: "back.out(2)" }
    );
    sfx_blackEnvelopeReveal();
  }, 2200);
}

// ── OPEN BLACK ENVELOPE ───────────────────────────────────
window.openBlackEnvelope = function () {
  const blackLetter = {
    id:         999,
    name:       "Prasad",
    emoji:      "🖤",
    colour:     "#7c3aed",
    quote:      "\"Everyone had something to say about you. But there's one person who wanted to tell you what you mean to him.\"",
    imageEmoji: "🖤",
    message:    "Heeeyaaaa Piu... 💛\n\nIf u hv made it this far — U just opened letters from people who care about u more than words can say.\n\nBut I wanted this last one to be mine. Thank you for being you.\n\nMy eyes met many eyes but only got lost in yours…..The eyes tells more than words could ever say. I hope u r good in reading eyes.\nFor every laugh, every conversation that somehow turned into a two-hour NewT sharing gossip time. For being the kind of person who makes everyone around her feel a little more seen. You deserve something that feels as special as u are.\n\nSo, on your birthday:\nI hope you always know just how loved and appreciated you are. I hope this year surprises you in all the best ways and exceeds every expectation you have. ✨ And I hope you carry your chaos, kindness 🌼 craziness, and that little bit of magic that makes you into everything you do.\n\nI may be terrible at putting feelings into words, but just know that having you in my life means more than I probably say.\nHappy Birthday, Piu. ❤️🎂",
    sign:       "— Prasad 🌼🖤",
    isBlack:    true,
  };

  sfx_blackEnvelopeReveal();
  track("black_envelope"); // ← invisible tracking
  envState.currentLetter = blackLetter;   // ← must be set so closeLetter knows it's the black one
  showLetterModal(blackLetter, () => {
    envState.opened.add(999);
  });
};

// ── LETTER MODAL ──────────────────────────────────────────
function showLetterModal(friend, onShown) {
  const overlay  = document.getElementById("letter-modal-overlay");
  const envWrap  = document.getElementById("lm-envelope-wrap");
  const envEl    = document.getElementById("lm-envelope");
  const content  = document.getElementById("lm-content");
  const quote    = document.getElementById("lm-quote");
  const polaroidImg  = document.getElementById("lm-polaroid-img");
  const polaroidName = document.getElementById("lm-polaroid-name");
  const message  = document.getElementById("lm-message");
  const sign     = document.getElementById("lm-sign");
  const nextBtn  = document.getElementById("lm-next-btn");

  // Populate content
  quote.textContent        = friend.quote;
  polaroidImg.textContent  = friend.imageEmoji;
  polaroidName.textContent = friend.name;
  message.textContent      = friend.message;
  sign.textContent         = friend.sign;

  // Colour theme
  overlay.style.setProperty("--lm-accent", friend.colour);
  envEl.style.borderColor  = friend.colour + "99";
  envEl.style.boxShadow    = `0 0 30px ${friend.colour}55`;

  // Special black envelope styling
  if (friend.isBlack) {
    envEl.classList.add("black-envelope");
    nextBtn.textContent = "Continue to Memory Wall 📸";
  } else {
    envEl.classList.remove("black-envelope");
    const remaining = FRIENDS.length - envState.opened.size - 1;
    nextBtn.textContent = remaining > 0
      ? `Open next letter → (${remaining} left)`
      : "See the last message 🖤";
  }

  // Reset state
  content.style.opacity = "0";
  envWrap.style.display = "flex";
  envEl.classList.remove("opening");

  // Show overlay
  overlay.classList.add("open");
  gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.4 });
  gsap.fromTo("#letter-modal",
    { scale: 0.85, opacity: 0, y: 40 },
    { scale: 1, opacity: 1, y: 0, duration: 0.6, ease: "back.out(1.6)" }
  );

  // Envelope opening animation — use CSS class `.lm-envelope.opening`
  setTimeout(() => {
    envEl.classList.add("opening");

    // After flap opens, fade envelope out and show content
    setTimeout(() => {
      gsap.to(envWrap, {
        opacity: 0, scale: 0.6, duration: 0.5,
        onComplete: () => {
          envWrap.style.display = "none";
          gsap.to(content, { opacity: 1, duration: 0.5, ease: "power2.out" });
          if (onShown) onShown();
        },
      });
    }, 700);
  }, 500);
}

// ── CLOSE LETTER ──────────────────────────────────────────
window.closeLetter = function () {
  const overlay = document.getElementById("letter-modal-overlay");
  const friend  = envState.currentLetter;

  gsap.to(overlay, {
    opacity: 0, duration: 0.3,
    onComplete: () => {
      overlay.classList.remove("open");
      overlay.style.opacity = "";   // let CSS take over (opacity:0, pointer-events:none)

      // If it was the black envelope → go to Memory Wall Intro
      if (friend && friend.isBlack) {
        setTimeout(() => goToMilestone5(), 150);
      }
      // Check if all friend letters are opened — trigger banner after modal closes
      else if (envState.opened.size === FRIENDS.length && !envState.allFriendsDone) {
        setTimeout(() => onAllLettersOpened(), 800);
      }
    },
  });
};

// ── MILESTONE 5 → Memory Wall Intro ───────────────────────
function goToMilestone5() {
  sfx_nextMission();

  // Immediately hide all envelope garden layers (no GSAP multi-target issues)
  const blackWrap = document.getElementById("env-black-wrap");
  const banner    = document.getElementById("env-all-banner");
  if (blackWrap) { blackWrap.style.display = "none"; }
  if (banner)    { banner.style.display    = "none"; }

  // Ensure envelopeGarden is visible before fading it out
  gsap.set(screens.envelopeGarden, { opacity: 1 });

  gsap.to(screens.envelopeGarden, {
    opacity: 0,
    duration: 0.5,
    onComplete: () => {
      screens.envelopeGarden.classList.remove("active");

      screens.mwIntro.classList.add("active");
      gsap.fromTo(screens.mwIntro, { opacity: 0 }, { opacity: 1, duration: 0.5 });
      gsap.fromTo("#mw-intro-card",
        { y: 40, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.7, ease: "back.out(1.6)" }
      );
    },
  });
}

/* =========================================================
   PART 5 — MEMORY WALL ENGINE
   ========================================================= */

// ── MEMORIES DATA ──────────────────────────────────────────
// Prasad & Sneha — personalised flirty/funny memories.
// To add a real photo: set imageUrl to the path e.g. "assets/images/memory1.jpg"
// Leave imageUrl as "" to keep the emoji placeholder.
const MEMORIES = [
  {
    id: 1,
    emoji: "🌸",
    caption: "Chapter 1",
    imageUrl: "images/IMG_1793.JPG.jpeg",
    title: "Where It All Began",
    date: "19 April 2025",
    story: "Rupal introduced us on 19 April 2025. I never imagined that an ordinary introduction would turn into one of the most meaningful friendships of my life. Looking back now, I'm really grateful that our paths crossed that day.",
    tags: ["#19april2025", "#beginnings", "#grateful"],
  },
  {
    id: 2,
    emoji: "🏔️",
    caption: "Chapter 2",
    imageUrl: "images/IMG_1794.JPG.jpeg",
    title: "The Crazy Adventure",
    date: "Karnala Fort Trek",
    story: "Who knew a simple trek to Karnala Fort would become one of our favorite adventures? We somehow have this talent for turning ordinary plans into unforgettable memories. Every climb, every laugh, every tired step became part of a story we'll always remember.",
    tags: ["#karnalafort", "#adventure", "#unforgettable"],
  },
  {
    id: 3,
    emoji: "🚴",
    caption: "Chapter 3",
    imageUrl: "images/WhatsApp Image 2026-08-11 at 10.55.27 AM.jpeg",
    title: "Midnight Rides & Endless Conversations",
    date: "Marine Drive & Worli Sea Face",
    story: "Those late-night cycling rides weren't just about the roads we travelled — they were about the conversations that never seemed to end. Sitting by Marine Drive or Worli Sea Face, watching the waves, feeling the cool breeze, and singing our favorite retro songs... those moments felt timeless. Sometimes the simplest nights become the most unforgettable memories.",
    tags: ["#marinedrive", "#midnightrides", "#timeless"],
  },
  {
    id: 4,
    emoji: "🌊",
    caption: "Chapter 4",
    imageUrl: "images/IMG_1790.JPG.jpeg",
    title: "Vitamin Sea",
    date: "A day by the sea",
    story: "What started as an unexpected plan turned into one of the most memorable days. Between endless laughter, heartfelt conversations, and sharing pieces of our lives with each other, the sea quietly became a witness to a friendship growing stronger. Some places become special not because of where they are, but because of who you're with.",
    tags: ["#vitaminsea", "#friendship", "#goodvibes"],
  },
  {
    id: 5,
    emoji: "☕",
    caption: "Chapter 5",
    imageUrl: "images/IMG_1791.JPG.jpeg",
    title: "Chai, Coffee & Endless Talks",
    date: "Every ordinary evening",
    story: "Some of our best memories weren't made on big trips — they were created over a cup of coffee or chai. Hours would pass without us noticing as we shared stories, laughed over the silliest things, discussed life, dreams, and everything in between. Those conversations turned ordinary evenings into unforgettable moments.",
    tags: ["#chai", "#coffee", "#endlesstalks"],
  },
  {
    id: 6,
    emoji: "🎵",
    caption: "Chapter 6",
    imageUrl: "images/IMG_1792.JPG.jpeg",
    title: "The Spotify Sessions",
    date: "Whenever boredom struck",
    story: "Some of the best moments didn't need a destination — just a good playlist. Whenever boredom struck, one of us would hit play on Spotify, and suddenly an ordinary day became a mini concert. Sometimes it was singing along at the top of our lungs, and other times it was sending just one line of a song over chat, waiting for the other person to complete the next line. Those little musical moments became our own inside language, turning simple conversations into memories worth smiling about.",
    tags: ["#spotify", "#musicmoments", "#insidelanguage"],
  },
  {
    id: 7,
    emoji: "🌊",
    caption: "Chapter 7",
    imageUrl: "images/WhatsApp Image 2026-08-11 at 9.02.32 AM (1).jpeg",
    title: "The Konkan Chronicles 🌊",
    date: "Konkan Trip",
    story: "It started from the office with endless songs, terrible singing, and a journey that somehow felt way too short. From visiting temples and chasing waterfalls to enjoying sunsets while singing retro songs, dancing, and making countless beach reels — Konkan gave us another bunch of memories we'll always smile about. 🌊❤️",
    tags: ["#konkan", "#beachvibes", "#retrosongsandreels", "#unforgettable"],
  },
  {
    id: 8,
    emoji: "🌟",
    caption: "Chapter 8",
    imageUrl: "images/WhatsApp Image 2026-08-11 at 9.02.32 AM (2).jpeg",
    title: "A Friend Like You",
    date: "Every single day",
    story: "They say some people enter your life for a reason. You came into mine unexpectedly, but your kindness, support, crazy energy, and countless laughs made this friendship truly special. Thank you for being someone I can always count on — for the smiles, the encouragement, and the memories we've created together.",
    tags: ["#grateful", "#truefriend", "#alwayshere"],
  },
  {
    id: 9,
    emoji: "🌸",
    caption: "Chapter 9",
    imageUrl: "images/IMG_1785.JPG.jpeg",
    title: "To Be Continued...",
    date: "The chapters still unwritten",
    story: "This chapter doesn't have a photo yet... because our best memories are still waiting to happen. More adventures, more random plans, more late-night rides, more laughter, and many more birthdays together. This isn't the end of our story — it's just the beginning of many more beautiful chapters.",
    tags: ["#tobecontinued", "#moretocome", "#always"],
  },
];

// ── STATE ──────────────────────────────────────────────────
const mwState = {
  flipped:     new Set(),
  modalOpen:   false,
  celebrationShown: false,
};

// ── START MEMORY WALL ──────────────────────────────────────
window.startMemoryWall = function () {
  sfx_openWall();
  track("screen_memory_wall"); // ← invisible tracking
  mwState.flipped.clear();
  mwState.modalOpen = false;
  mwState.celebrationShown = false;

  // Switch screen
  screens.mwIntro.classList.remove("active");
  screens.mwWall.classList.add("active");
  gsap.fromTo(screens.mwWall, { opacity: 0 }, { opacity: 1, duration: 0.5 });

  // Scroll to top
  screens.mwWall.scrollTop = 0;

  // Reset header
  updateMWHeader();
  document.getElementById("mw-done-btn").disabled = true;
  document.getElementById("mw-celebrate-banner").classList.remove("show");

  // Build grid
  setTimeout(() => buildMemoryGrid(), 200);
};

// ── BUILD GRID ─────────────────────────────────────────────
function buildMemoryGrid() {
  const grid = document.getElementById("mw-grid");
  grid.innerHTML = "";

  MEMORIES.forEach((mem, i) => {
    const wrap = document.createElement("div");
    wrap.className       = "mw-card-wrap";
    wrap.dataset.id      = mem.id;
    wrap.style.opacity   = "0";
    wrap.style.transform = "translateY(30px)";

    wrap.innerHTML = `
      <div class="mw-card">
        <!-- Front: polaroid -->
        <div class="mw-card-front">
          <div class="mw-polaroid-img">
            ${mem.imageUrl
              ? `<img src="${mem.imageUrl}" alt="${mem.caption}" loading="lazy"/>`
              : mem.emoji}
          </div>
          <div class="mw-polaroid-caption">${mem.caption}</div>
          <div class="mw-flip-hint"></div>
        </div>
        <!-- Back: memory preview -->
        <div class="mw-card-back">
          <div class="mw-back-emoji">${mem.emoji}</div>
          <div class="mw-back-title">${mem.title}</div>
          <div class="mw-back-preview">${mem.story}</div>
          <div class="mw-read-more">Tap to read more →</div>
        </div>
      </div>
    `;

    // Flip on click
    wrap.addEventListener("click", () => handleCardClick(wrap, mem));

    grid.appendChild(wrap);

    // Stagger reveal animation
    gsap.to(wrap, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      delay: i * 0.08,
      ease: "power2.out",
    });
  });
}

// ── CARD CLICK ─────────────────────────────────────────────
function handleCardClick(wrap, mem) {
  const wasFlipped = wrap.classList.contains("flipped");

  // Flip the card
  if (!wasFlipped) {
    sfx_cardFlip();
    wrap.classList.add("flipped");
    mwState.flipped.add(mem.id);
    track("memory_card_flipped", { card: mem.id, total_flipped: mwState.flipped.size }); // ← invisible tracking
    updateMWHeader();

    // Small confetti burst on flip
    const rect  = wrap.getBoundingClientRect();
    const originX = (rect.left + rect.width  / 2) / window.innerWidth;
    const originY = (rect.top  + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 18,
      spread: 50,
      origin: { x: originX, y: originY },
      colors: ["#ff6ec7", "#a855f7", "#facc15"],
      scalar: 0.7,
    });

    // Don't trigger celebration immediately — let user read the card first
  }

  // Open modal on back-click (already flipped)
  if (wasFlipped) {
    openMemoryModal(mem);
  }
}

// ── ALL CARDS FLIPPED ──────────────────────────────────────
function onAllCardsFlipped() {
  // Show celebration banner
  const banner = document.getElementById("mw-celebrate-banner");
  banner.classList.add("show");

  // Enable continue button
  const btn = document.getElementById("mw-done-btn");
  btn.disabled = false;
  gsap.fromTo(btn, { scale: 0.85 }, { scale: 1, duration: 0.5, ease: "back.out(2)" });

  // Golden confetti waves
  const goldColors = ["#facc15","#fde68a","#f59e0b","#fbbf24","#fff","#fb923c"];

  confetti({ particleCount: 200, spread: 120, origin: { y: 0.5 }, colors: goldColors, scalar: 1.3 });

  setTimeout(() => {
    confetti({ particleCount: 100, angle: 60,  spread: 80, origin: { x: 0, y: 0.5 }, colors: goldColors });
    confetti({ particleCount: 100, angle: 120, spread: 80, origin: { x: 1, y: 0.5 }, colors: goldColors });
  }, 400);

  setTimeout(() => {
    confetti({ particleCount: 120, spread: 100, origin: { y: 0.3 }, colors: goldColors, scalar: 1.1, gravity: 0.4, ticks: 300 });
  }, 900);

  setTimeout(() => {
    confetti({ particleCount: 80, spread: 360, startVelocity: 15, origin: { x: 0.5, y: 0.5 }, colors: goldColors, scalar: 0.8 });
  }, 1500);
}

// ── UPDATE HEADER ──────────────────────────────────────────
function updateMWHeader() {
  document.getElementById("mw-flipped-count").textContent =
    `${mwState.flipped.size} / ${MEMORIES.length} flipped`;
}

// ── MODAL ──────────────────────────────────────────────────
function openMemoryModal(mem) {
  sfx_modalOpen();
  document.getElementById("mw-modal-emoji").textContent  = mem.emoji;
  document.getElementById("mw-modal-title").textContent  = mem.title;
  document.getElementById("mw-modal-date").textContent   = mem.date;
  document.getElementById("mw-modal-story").textContent  = mem.story;

  // Tags
  const tagsEl = document.getElementById("mw-modal-tags");
  tagsEl.innerHTML = mem.tags
    .map((t) => `<span class="mw-tag">${t}</span>`)
    .join("");

  // Open
  const overlay = document.getElementById("mw-modal-overlay");
  overlay.classList.add("open");
  mwState.modalOpen = true;
}

window.closeMemoryModal = function () {
  sfx_modalClose();
  const overlay = document.getElementById("mw-modal-overlay");
  overlay.classList.remove("open");
  mwState.modalOpen = false;

  // Check if all cards are flipped — trigger celebration after user closes modal
  if (mwState.flipped.size === MEMORIES.length && !mwState.celebrationShown) {
    mwState.celebrationShown = true;
    track("all_cards_flipped"); // ← invisible tracking
    setTimeout(() => onAllCardsFlipped(), 800); // Give 800ms after modal closes
  }
};

// Close modal on Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && mwState.modalOpen) closeMemoryModal();
});

// ── FINISH MEMORY WALL ─────────────────────────────────────
window.finishMemoryWall = function () {
  sfx_continueWall();
  gsap.to(screens.mwWall, {
    opacity: 0, duration: 0.5,
    onComplete: () => {
      screens.mwWall.classList.remove("active");
      goToMilestone6();
    },
  });
};

// ── MILESTONE 6 → Grand Finale ─────────────────────────────
window.goToMilestone6 = function () {
  // Make sure we're coming from mwWall
  screens.mwWall.classList.remove("active");
  screens.finale.classList.add("active");
  screens.finale.scrollTop = 0;
  gsap.fromTo(screens.finale, { opacity: 0 }, { opacity: 1, duration: 0.8 });
  track("screen_finale"); // ← invisible tracking 🎉

  // Kick off the whole finale sequence
  setTimeout(() => launchGrandFinale(), 400);
};

/* =========================================================
   PART 6 — GRAND FINALE ENGINE
   ========================================================= */

// ── WISHES DATA ────────────────────────────────────────────
const WISHES = [
  { emoji: "✨", text: "May every day feel as magical as you make others' days feel." },
  { emoji: "😂", text: "Wishing you a year with zero bad hair days and infinite good vibes." },
  { emoji: "💪", text: "May you achieve everything you set your mind to — which is basically everything." },
  { emoji: "🌸", text: "Here's to more late nights, more laughter, and more adventures together." },
  { emoji: "👑", text: "You were born to stand out. Keep being unashamedly, brilliantly you." },
  { emoji: "💜", text: "Wishing you all the love you so freely give to everyone around you." },
  { emoji: "🚀", text: "This is your year, Sneha. Go out there and absolutely own it." },
  { emoji: "🥂", text: "To new memories, new milestones, and one absolutely iconic birthday queen." },
];

// ── LETTER TEXT ────────────────────────────────────────────
// Written in Prasad's voice — flirty/funny with an emotional ending
const LETTER_LINES = [
  "Hey Sneha,\n\n",
  "First of all — you actually made it through every single mission. Honestly? Prasad is shook. 😂\n\n",
  "But in all seriousness...\n\n",
  "Thank you. For being the kind of person who makes everything more fun just by being there. ",
  "For the 2am conversations that turned into 4am. ",
  "For the chaos, the laughs, the random voice notes, the absolutely unhinged takes on everything. 💀\n\n",
  "I don't say it enough, but — you matter. A lot. ",
  "Not just to me, but to everyone whose life you've walked into. ",
  "You have this ridiculous ability to make people feel seen and heard and just... better.\n\n",
  "So on your birthday, I just want you to know:\n",
  "You deserve everything this year has to offer. ",
  "All the good things. The big moments and the tiny perfect ones. ",
  "Every single bit of joy that exists.\n\n",
  "Happy Birthday, Sneha. 🎂\n",
  "Don't let anyone dim your sparkle. Especially not me. 😌✨",
];

// ── MUSIC STATE ────────────────────────────────────────────
let musicPlaying = false;
const audio = document.getElementById("birthday-audio");

window.toggleMusic = function () {
  if (!audio) return;

  if (musicPlaying) {
    sfx_musicToggle(false);
    audio.pause();
    musicPlaying = false;
    document.getElementById("music-play-btn").textContent = "▶";
    document.getElementById("music-disc").classList.remove("spinning");
    document.getElementById("music-player").classList.remove("playing");
  } else {
    sfx_musicToggle(true);
    audio.play().catch(() => {});
    musicPlaying = true;
    document.getElementById("music-play-btn").textContent = "⏸";
    document.getElementById("music-disc").classList.add("spinning");
    document.getElementById("music-player").classList.add("playing");
  }
};

// ── SCROLL-REVEAL OBSERVER ─────────────────────────────────
function initFinaleScrollReveal() {
  const blocks = document.querySelectorAll(".finale-block");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          // Trigger block-specific actions when revealed
          onBlockVisible(entry.target.id);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  blocks.forEach((b) => observer.observe(b));
}

// ── BLOCK-SPECIFIC TRIGGERS ────────────────────────────────
const blockTriggered = {};

function onBlockVisible(id) {
  if (blockTriggered[id]) return;
  blockTriggered[id] = true;

  switch (id) {
    case "finale-block-1":
      triggerOpeningConfetti();
      tryAutoplayMusic();
      break;
    case "finale-block-2":
      animateMusicPlayer();
      break;
    case "finale-block-3":
      startLetterTypewriter();
      break;
    case "finale-block-4":
      revealWishCards();
      break;
    case "finale-block-5":
      triggerFinalConfetti();
      launchFireworks();
      break;
  }
}

// ── MAIN LAUNCH ────────────────────────────────────────────
function launchGrandFinale() {
  // Reset all block triggered flags
  Object.keys(blockTriggered).forEach((k) => delete blockTriggered[k]);

  // Start scroll observer
  initFinaleScrollReveal();

  // Scroll to top smoothly — first block triggers immediately
  screens.finale.scrollTo({ top: 0, behavior: "smooth" });
}

// ── BLOCK 1: OPENING CONFETTI ──────────────────────────────
function triggerOpeningConfetti() {
  const colors = ["#ff6ec7", "#a855f7", "#facc15", "#60a5fa", "#f472b6", "#86efac"];

  // Big burst from center
  confetti({
    particleCount: 200,
    spread: 100,
    origin: { y: 0.45 },
    colors,
    scalar: 1.2,
  });

  // Side cannons
  setTimeout(() => {
    confetti({ particleCount: 80, angle: 60,  spread: 70, origin: { x: 0,   y: 0.5 }, colors });
    confetti({ particleCount: 80, angle: 120, spread: 70, origin: { x: 1,   y: 0.5 }, colors });
  }, 300);

  // Second wave
  setTimeout(() => {
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.4 }, colors, scalar: 1.0 });
  }, 700);

  // Slow falling stars
  setTimeout(() => {
    confetti({
      particleCount: 60,
      spread: 120,
      origin: { y: 0 },
      colors: ["#facc15", "#fff", "#f472b6"],
      scalar: 0.6,
      gravity: 0.4,
      ticks: 300,
    });
  }, 1200);
}

// ── BLOCK 2: MUSIC AUTOPLAY ────────────────────────────────
function tryAutoplayMusic() {
  if (!audio || musicPlaying) return;

  audio.volume = 0.65;
  audio.play()
    .then(() => {
      musicPlaying = true;
      document.getElementById("music-play-btn").textContent = "⏸";
      document.getElementById("music-disc").classList.add("spinning");
      document.getElementById("music-player").classList.add("playing");
    })
    .catch(() => {
      // Autoplay blocked by browser — leave it for user to click
    });
}

function animateMusicPlayer() {
  gsap.fromTo(
    "#music-player",
    { scale: 0.85, opacity: 0 },
    { scale: 1, opacity: 1, duration: 0.7, ease: "back.out(1.8)" }
  );

  // Add sound wave bars to player dynamically
  const player = document.getElementById("music-player");
  if (!player.querySelector(".sound-wave")) {
    const wave = document.createElement("div");
    wave.className = "sound-wave";
    wave.innerHTML = Array(5).fill('<div class="sound-bar"></div>').join("");
    player.appendChild(wave);
  }
}

// ── BLOCK 3: LETTER TYPEWRITER ─────────────────────────────
function startLetterTypewriter() {
  const body   = document.getElementById("letter-body");
  const sign   = document.getElementById("letter-sign");

  // Add cursor
  const cursor = document.createElement("span");
  cursor.className = "letter-cursor";
  body.appendChild(cursor);

  const fullText  = LETTER_LINES.join("");
  let   charIndex = 0;
  const speed     = 38; // ms per character — slightly slower for dot-matrix feel

  function typeNext() {
    if (charIndex < fullText.length) {
      // Insert character before cursor
      const char = document.createTextNode(fullText[charIndex]);
      body.insertBefore(char, cursor);
      charIndex++;

      // Scroll letter into view as text grows
      cursor.scrollIntoView({ block: "nearest", behavior: "smooth" });

      // Dot-matrix rhythm: newlines pause longer, punctuation pauses mid-sentence
      const delay = fullText[charIndex - 1] === "\n" ? 260
                  : fullText[charIndex - 1] === "." ? 220
                  : fullText[charIndex - 1] === "," ? 130
                  : fullText[charIndex - 1] === "!" ? 200
                  : fullText[charIndex - 1] === "?" ? 200
                  : fullText[charIndex - 1] === " " ? speed - 8
                  : speed + Math.floor(Math.random() * 18); // mechanical jitter

      setTimeout(typeNext, delay);
    } else {
      // Done typing — remove cursor, show signature
      cursor.remove();
      sign.classList.add("visible");

      // Small confetti burst when letter finishes
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#ff6ec7", "#a855f7", "#facc15"],
        scalar: 0.8,
      });
    }
  }

  // Small delay before typing starts
  setTimeout(typeNext, 500);
}

// ── BLOCK 4: WISH CARDS ────────────────────────────────────
function revealWishCards() {
  const grid = document.getElementById("wishes-grid");
  grid.innerHTML = "";

  WISHES.forEach((wish, i) => {
    const card = document.createElement("div");
    card.className = "wish-card";
    card.innerHTML = `
      <span class="wish-emoji">${wish.emoji}</span>
      <p class="wish-text">${wish.text}</p>
    `;
    grid.appendChild(card);

    // Staggered reveal
    setTimeout(() => {
      card.classList.add("revealed");
      // Tiny confetti on each card pop
      confetti({
        particleCount: 8,
        spread: 40,
        origin: { y: 0.65 },
        colors: ["#ff6ec7", "#facc15", "#a855f7"],
        scalar: 0.5,
      });
    }, i * 180);
  });
}

// ── BLOCK 5: FINAL CONFETTI ────────────────────────────────
function triggerFinalConfetti() {
  const colors = ["#ff6ec7", "#a855f7", "#facc15", "#60a5fa", "#f472b6"];

  // Massive burst
  for (let i = 0; i < 3; i++) {
    setTimeout(() => {
      confetti({
        particleCount: 160,
        spread: 120,
        origin: { y: 0.5 },
        colors,
        scalar: 1.3,
      });
      confetti({ particleCount: 80, angle: 60,  spread: 80, origin: { x: 0, y: 0.5 }, colors });
      confetti({ particleCount: 80, angle: 120, spread: 80, origin: { x: 1, y: 0.5 }, colors });
    }, i * 600);
  }
}

// ── FIREWORKS ──────────────────────────────────────────────
function launchFireworks() {
  const layer  = document.getElementById("fireworks-layer");
  const colors = ["#ff6ec7", "#a855f7", "#facc15", "#60a5fa", "#f472b6", "#86efac", "#fff"];
  let   count  = 0;

  function spawnFirework() {
    if (count >= 30) return;
    count++;

    const x = 10 + Math.random() * 80;  // % from left
    const y = 10 + Math.random() * 60;  // % from top

    // Spawn 12 particles per firework
    for (let i = 0; i < 12; i++) {
      const p = document.createElement("div");
      p.className = "firework";

      const angle   = (i / 12) * 360;
      const dist    = 60 + Math.random() * 80;
      const rad     = (angle * Math.PI) / 180;
      const endX    = Math.cos(rad) * dist;
      const endY    = Math.sin(rad) * dist;
      const color   = colors[Math.floor(Math.random() * colors.length)];
      const dur     = 0.6 + Math.random() * 0.5;

      p.style.cssText = `
        left: ${x}%;
        top:  ${y}%;
        background: ${color};
        box-shadow: 0 0 6px ${color};
        --fw-end: translate(${endX}px, ${endY}px);
        animation-duration: ${dur}s;
      `;

      layer.appendChild(p);
      setTimeout(() => p.remove(), dur * 1000 + 100);
    }

    setTimeout(spawnFirework, 280 + Math.random() * 300);
  }

  spawnFirework();
}

// ── RESTART ────────────────────────────────────────────────
window.restartExperience = function () {
  sfx_restart();
  track("restart"); // ← invisible tracking
  if (audio && musicPlaying) {
    audio.pause();
    audio.currentTime = 0;
    musicPlaying = false;
  }

  // Fade out finale
  gsap.to(screens.finale, {
    opacity: 0, duration: 0.6,
    onComplete: () => {
      screens.finale.classList.remove("active");
      screens.finale.scrollTop = 0;

      // Reset to welcome
      screens.welcome.classList.add("active");
      gsap.set(screens.welcome, { opacity: 1 });

      // Re-run welcome entrance
      setTimeout(() => animateWelcomeEntrance(), 200);
    },
  });
};
