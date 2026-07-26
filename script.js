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
  welcome:   document.getElementById("welcome-screen"),
  verify:    document.getElementById("verify-screen"),
  denied:    document.getElementById("denied-screen"),
  scan:      document.getElementById("scan-screen"),
  quizIntro: document.getElementById("quiz-intro-screen"),
  quiz:      document.getElementById("quiz-screen"),
  result:    document.getElementById("result-screen"),
  erIntro:   document.getElementById("er-intro-screen"),
  erPuzzle:  document.getElementById("er-puzzle-screen"),
  erSuccess: document.getElementById("er-success-screen"),
  hbIntro:   document.getElementById("hb-intro-screen"),
  hbPlay:    document.getElementById("hb-play-screen"),
  hbSuccess: document.getElementById("hb-success-screen"),
  hbTimeout: document.getElementById("hb-timeout-screen"),
  mwIntro:   document.getElementById("mw-intro-screen"),
  mwWall:    document.getElementById("mw-wall-screen"),
  finale:    document.getElementById("finale-screen"),
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
    .call(initTyped); // start typing only after animation
}

// ── BUTTON: Start Mission ──────────────────────
window.goToVerification = function () {
  // Little button pop before switching
  gsap.to("#start-btn", {
    scale: 0.9,
    duration: 0.1,
    yoyo: true,
    repeat: 1,
    onComplete: () => switchScreen("welcome", "verify", true),
  });
};

// ── BUTTON: Identity Verify ────────────────────
window.handleVerify = function (choice) {
  if (choice === "no") {
    switchScreen("verify", "denied", true);
  } else {
    switchScreen("verify", "scan", true);
    setTimeout(startScan, 400);
  }
};

// ── BUTTON: Go Back ────────────────────────────
window.goBack = function () {
  switchScreen("denied", "verify", true);
};

// ── FACE SCAN SEQUENCE ─────────────────────────
function startScan() {
  const bar       = document.getElementById("progress-bar");
  const label     = document.getElementById("progress-label");
  const scanLines = document.getElementById("scan-lines");
  const scanEmoji = document.getElementById("scan-emoji");
  const scanTitle = document.getElementById("scan-title");
  const result    = document.getElementById("scan-result");

  // Scan messages at different % points
  const messages = [
    { pct: 0,   emoji: "🤳", text: "Scanning Face..." },
    { pct: 20,  emoji: "🔍", text: "Detecting Birthday Vibes..." },
    { pct: 45,  emoji: "💅", text: "Analysing Main Character Energy..." },
    { pct: 70,  emoji: "✨", text: "Confirming Queen Status..." },
    { pct: 90,  emoji: "👑", text: "Almost there..." },
  ];

  let current = 0;
  scanLines.classList.add("active");

  // Animate progress bar with gsap
  gsap.to({ val: 0 }, {
    val: 100,
    duration: 4.5,
    ease: "power1.inOut",
    onUpdate: function () {
      const pct = Math.round(this.targets()[0].val);
      bar.style.width   = pct + "%";
      label.textContent = pct + "%";

      // Update message at milestones
      const next = messages[current + 1];
      if (next && pct >= next.pct) {
        current++;
        scanEmoji.textContent = messages[current].emoji;
        scanTitle.textContent = messages[current].text;

        // tiny bounce on emoji
        gsap.fromTo(scanEmoji,
          { scale: 1.4 },
          { scale: 1, duration: 0.3, ease: "back.out(2)" }
        );
      }
    },
    onComplete: () => {
      scanLines.classList.remove("active");

      // Hide progress elements
      gsap.to([bar.parentElement, label, scanEmoji, scanTitle], {
        opacity: 0,
        y: -10,
        duration: 0.4,
        onComplete: () => {
          bar.parentElement.style.display = "none";
          label.style.display = "none";
          scanEmoji.style.display = "none";
          scanTitle.style.display = "none";

          // Show result
          result.classList.add("visible");

          gsap.fromTo(
            result,
            { opacity: 0, scale: 0.85 },
            { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.8)" }
          );

          // Confetti burst!
          launchConfetti();
        },
      });
    },
  });
}

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

// ── START ADVENTURE (after scan) → goes to Quiz Intro ──
window.startAdventure = function () {
  gsap.to(screens.scan, {
    opacity: 0,
    duration: 0.5,
    onComplete: () => {
      screens.scan.classList.remove("active");
      screens.quizIntro.classList.add("active");
      gsap.fromTo(screens.quizIntro, { opacity: 0 }, { opacity: 1, duration: 0.5 });
      gsap.fromTo(
        "#quiz-intro-card",
        { y: 40, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.7, ease: "back.out(1.6)" }
      );
    },
  });
};

// ── INIT ───────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  // Small delay so fonts + libs load
  setTimeout(animateWelcomeEntrance, 150);
});

/* =========================================================
   PART 2 — BIRTHDAY QUIZ ENGINE
   ========================================================= */

// ── QUESTIONS ──────────────────────────────────────────────
// Personalised for Sneha — flirty/funny tone
const QUESTIONS = [
  {
    emoji: "🙋",
    text: "Who usually says sorry first?",
    options: [
      "🙋 Me",
      "🙋 You",
      "🤝 Both of us",
      "🤐 We forget why we argued",
    ],
    correct: 1,
    feedbackRight: "Aww... thank you! 😊 That's what good friends do.",
    feedbackWrong: {
      0: "That's what good friends do. 😄",
      2: "Teamwork! 🤝",
      3: "Honestly... that's probably true. 😂",
    },
  },
  {
    emoji: "🏢",
    text: "Where did we first meet?",
    options: [
      "🏫 School",
      "🏢 Office",
      "☕ Café",
      "🌐 Online",
    ],
    correct: 1,
    feedbackRight: "🎉 Exactly! That's where this amazing friendship started.",
    feedbackWrong: "😜 Nice try! Looks like someone needs a memory refresh.",
  },
  {
    emoji: "🌟",
    text: "What's your secret superpower?",
    options: [
      "😴 Sleeping anywhere",
      "😂 Laughing at silly things",
      "📱 Replying late",
      "🌟 Making everyone smile",
    ],
    correct: 3,
    feedbackRight: "🌟 Yes! That smile is literally your superpower. Never stop. ✨",
    feedbackWrong: {
      0: "Okay valid but that's a talent not a superpower 😂",
      1: "Laughing is great but your REAL superpower is bigger than that 💫",
      2: "WE ALL KNOW. 😤📵",
    },
  },
  {
    emoji: "🧑‍💻",
    text: "Who made this website just to make you smile?",
    options: [
      "🤖 AI",
      "👽 Aliens",
      "🧑‍💻 My best friend",
      "🐱 A very talented person",
    ],
    correct: 2,
    feedbackRight: "Exactly! Someone spent time making this just for you. ❤️",
    feedbackWrong: "Hmm... try again! 😄",
    retryOnWrong: true,
  },
  {
    emoji: "📞",
    text: "Who keeps the conversation going forever?",
    options: [
      "📞 Me",
      "📱 You",
      "😂 Both of us",
      "🔋 Someone calling... will talk later",
    ],
    correct: 2,
    feedbackRight: "That's why our calls never end. ❤️",
    feedbackWrong: {
      0: "I do have a lot to say. 😄",
      1: "You're impossible to stop! 😂",
      3: "The most practical answer. 😆",
    },
  },
  {
    emoji: "❤️",
    text: "Who is the best friend in your life?",
    options: [
      "🤖 God",
      "🐶 Family",
      "🌎 Everyone",
      "❤️ The one who made this website",
    ],
    correct: 3,
    feedbackRight: "🎉 Correct!\nFriendship Level: 9999+ ❤️\nMission Unlocked → Continue to the next level...",
    feedbackWrong: "🚫 Access Denied! Please reconsider your life choices. 😂",
    retryOnWrong: true,
  },
];

// ── RESULT TIERS ───────────────────────────────────────────
const RESULT_TIERS = [
  {
    min: 0, max: 2,
    emoji: "💀",
    title: "Yikes, Sneha...",
    message: "You clearly weren't paying attention during this friendship. Go back and study Prasad. 😤 (He still loves you though. Probably.)",
    stars: "⭐",
  },
  {
    min: 3, max: 4,
    emoji: "😏",
    title: "Not Bad, Not Great",
    message: "You clearly pay *some* attention. Prasad is giving you a conditional pass. More than half is technically passing, so... 😂",
    stars: "⭐⭐⭐",
  },
  {
    min: 5, max: 5,
    emoji: "🔥",
    title: "So Close!",
    message: "Almost perfect! You know this friendship really well. Prasad is impressed (but won't admit it out loud). 😌✨",
    stars: "⭐⭐⭐⭐",
  },
  {
    min: 6, max: 6,
    emoji: "👑",
    title: "Perfect Score!",
    message: "Sneha knows Prasad better than he knows himself. Certified Best Bestie Award unlocked. 💎🎉 Screenshot this. NOW.",
    stars: "⭐⭐⭐⭐⭐⭐",
  },
];

// ── STATE ──────────────────────────────────────────────────
let quizState = {
  current:   0,
  score:     0,
  answered:  false,
};

// ── START QUIZ ─────────────────────────────────────────────
window.startQuiz = function () {
  quizState = { current: 0, score: 0, answered: false };

  switchScreen("quizIntro", "quiz", false);

  // Card entrance
  gsap.fromTo(
    "#quiz-card",
    { y: 50, opacity: 0, scale: 0.92 },
    { y: 0, opacity: 1, scale: 1, duration: 0.7, ease: "back.out(1.5)", delay: 0.1 }
  );

  setTimeout(() => renderQuestion(), 300);
};

// ── RENDER QUESTION ────────────────────────────────────────
function renderQuestion() {
  const q   = QUESTIONS[quizState.current];
  const idx = quizState.current;
  const total = QUESTIONS.length;

  // Update progress bar
  document.getElementById("quiz-progress-fill").style.width =
    ((idx / total) * 100) + "%";

  // Update counters
  document.getElementById("q-counter").textContent = `Q ${idx + 1} / ${total}`;
  document.getElementById("q-score").textContent   = `⭐ ${quizState.score}`;

  // Update question
  document.getElementById("question-emoji").textContent = q.emoji;
  document.getElementById("question-text").textContent  = q.text;

  // Clear feedback
  const bubble = document.getElementById("feedback-bubble");
  bubble.textContent = "";
  bubble.classList.remove("show");

  // Render options
  const grid = document.getElementById("options-grid");
  grid.innerHTML = "";

  q.options.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.className     = "option-btn";
    btn.textContent   = opt;
    btn.dataset.index = i;
    btn.addEventListener("click", () => handleAnswer(i));
    grid.appendChild(btn);
  });

  quizState.answered = false;

  // Animate question in
  gsap.fromTo(
    ".question-wrap",
    { opacity: 0, y: 15 },
    { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
  );
  gsap.fromTo(
    ".option-btn",
    { opacity: 0, y: 20, scale: 0.95 },
    { opacity: 1, y: 0, scale: 1, duration: 0.4, stagger: 0.07, ease: "back.out(1.4)" }
  );
}

// ── HANDLE ANSWER ──────────────────────────────────────────
function handleAnswer(selectedIndex) {
  if (quizState.answered) return;

  const q       = QUESTIONS[quizState.current];
  const correct = q.correct;
  const buttons = document.querySelectorAll(".option-btn");
  const bubble  = document.getElementById("feedback-bubble");

  const isCorrect = selectedIndex === correct;

  // ── retryOnWrong: don't lock the question, just show message ──
  if (!isCorrect && q.retryOnWrong) {
    bubble.textContent = "❌ " + (typeof q.feedbackWrong === "string"
      ? q.feedbackWrong
      : q.feedbackWrong[selectedIndex] || "❌ Try again! 😄");
    bubble.style.borderColor = "rgba(239,68,68,0.3)";
    bubble.classList.add("show");

    // Shake the wrong button
    buttons[selectedIndex].classList.add("wrong");
    setTimeout(() => {
      buttons[selectedIndex].classList.remove("wrong");
      bubble.textContent = "";
      bubble.classList.remove("show");
    }, 1200);
    return;   // don't mark as answered — let them retry
  }

  // ── Normal flow: lock question ─────────────────────────────
  quizState.answered = true;

  // Disable all buttons
  buttons.forEach((btn) => (btn.disabled = true));

  if (isCorrect) {
    quizState.score++;
    buttons[selectedIndex].classList.add("correct");

    // Score bump animation
    const scoreEl = document.getElementById("q-score");
    scoreEl.textContent = `⭐ ${quizState.score}`;
    scoreEl.classList.remove("bump");
    void scoreEl.offsetWidth;
    scoreEl.classList.add("bump");

    bubble.textContent = "✅ " + q.feedbackRight;
    bubble.style.borderColor = "rgba(34,197,94,0.3)";
  } else {
    buttons[selectedIndex].classList.add("wrong");
    buttons[correct].classList.add("reveal");

    // Per-option feedback or single string
    const wrongMsg = typeof q.feedbackWrong === "object"
      ? (q.feedbackWrong[selectedIndex] || "❌ Not quite! Try to remember. 😄")
      : q.feedbackWrong;

    bubble.textContent = "❌ " + wrongMsg;
    bubble.style.borderColor = "rgba(239,68,68,0.3)";
  }

  bubble.classList.add("show");

  // Next question after delay
  setTimeout(() => {
    if (quizState.current < QUESTIONS.length - 1) {
      quizState.current++;
      animateOutThenRender();
    } else {
      showResults();
    }
  }, 1800);
}

// ── SLIDE OUT → RENDER NEXT ────────────────────────────────
function animateOutThenRender() {
  gsap.to(".question-wrap, .options-grid, .feedback-bubble", {
    opacity: 0,
    y: -20,
    duration: 0.3,
    onComplete: () => {
      gsap.set(".question-wrap, .options-grid, .feedback-bubble", { opacity: 1, y: 0 });
      renderQuestion();
    },
  });
}

// ── SHOW RESULTS ───────────────────────────────────────────
function showResults() {
  const score = quizState.score;
  const tier  = RESULT_TIERS.find((t) => score >= t.min && score <= t.max);

  // Populate result card
  document.getElementById("result-big-emoji").textContent    = tier.emoji;
  document.getElementById("result-big-title").textContent    = tier.title;
  document.getElementById("result-score-display").textContent = `${score} / ${QUESTIONS.length}`;
  document.getElementById("result-message").textContent      = tier.message;
  document.getElementById("result-stars").textContent        = tier.stars;

  // Switch screen
  switchScreen("quiz", "result", true);

  // Confetti on perfect score
  if (score === QUESTIONS.length) {
    setTimeout(() => launchConfetti(), 600);
  }

  // Small confetti even on partial
  if (score >= 3) {
    setTimeout(() => {
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 },
        colors: ["#ff6ec7", "#a855f7", "#facc15"] });
    }, 500);
  }
}

// ── NEXT MILESTONE → Escape Room Intro ────────────────────
window.goToNextMilestone = function () {
  gsap.to(screens.result, {
    opacity: 0,
    duration: 0.5,
    onComplete: () => {
      screens.result.classList.remove("active");
      screens.erIntro.classList.add("active");
      gsap.fromTo(screens.erIntro, { opacity: 0 }, { opacity: 1, duration: 0.5 });
      gsap.fromTo(
        "#er-intro-card",
        { y: 40, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.7, ease: "back.out(1.6)" }
      );
    },
  });
};

/* =========================================================
   PART 3 — ESCAPE ROOM ENGINE
   ========================================================= */

// ── PUZZLES DEFINITION — WISTERIA TRIAL ───────────────────
const ER_PUZZLES = [
  {
    id: 1,
    type: "memory-tiles",
    title: "🟦 Memory Tiles",
    desc: "Ten tiles hide letters. Reveal them, then select the ones that spell your name.",
    tiles: ["S","N","R","H","Z","E","Y","A","Q","R"],
    answer: ["S","N","E","H","A"],
    hint: "🌿 Your name has 5 letters. Not every tile is needed.",
    successMsg: "🌸 The tiles remember you. First seal broken.",
    failMsgs: [
      "🍃 Not quite... look again. The forest waits.",
      "🌙 Try once more. Your name is hidden there.",
      "✨ So close! You know your own name, Sneha. 😄",
    ],
  },
  {
    id: 2,
    type: "petal-collect",
    title: "🌸 Wisteria Petals",
    desc: "Petals fall from the forest canopy. Collect only those that spell your name — in order.",
    petalLetters: ["S","P","E","N","R","A","H","K"],
    answer: ["S","N","E","H","A"],
    hint: "🌿 Collect S → N → E → H → A. Ignore all other petals.",
    successMsg: "🌸 The Forest Spirit smiles. Second seal broken.",
    failMsgs: [
      "🍃 Wrong petal. The forest resets.",
      "🌙 The forest asks you to start over...",
      "✨ Almost! Focus on your name, one letter at a time.",
    ],
  },
  {
    id: 3,
    type: "bamboo-arrange",
    title: "🎋 Bamboo Puzzle",
    desc: "Five bamboo scrolls each hold one letter. Tap them in the correct order to spell your name.",
    scrollLetters: ["H","S","A","N","E"],
    answer: ["S","N","E","H","A"],
    hint: "🌿 Tap the scrolls in this order: S · N · E · H · A",
    successMsg: "🎋 The bamboo glows. Hidden path revealed. Third seal broken.",
    failMsgs: [
      "🍃 The scrolls resist... try a different order.",
      "🌙 Not yet. The bamboo waits for the correct arrangement.",
      "✨ Think about how your name is spelled. S-N-E-H-A.",
    ],
  },
  {
    id: 4,
    type: "memory-orbs",
    title: "💜 Demon's Illusion",
    desc: "A demon has stolen your memories. Five glowing orbs hold them. Recover the right one.",
    orbs: [
      { emoji: "📸", label: "First Selfie"        },
      { emoji: "🍕", label: "Favourite Food"      },
      { emoji: "😂", label: "Funniest Memory"     },
      { emoji: "🎂", label: "Birthday Memory"     },
      { emoji: "❤️", label: "Best Friend Message" },
    ],
    correctOrb: 4,
    hint: "🌿 The most powerful memory connects two hearts. ❤️",
    successMsg: "💜 Memory recovered. The demon retreats. Fourth seal broken.",
    failMsgs: [
      "👹 The demon laughs... that is not the right memory.",
      "🌙 Try again. Feel what matters most.",
      "✨ Think about what can never be stolen — friendship. ❤️",
    ],
  },
  {
    id: 5,
    type: "final-gate",
    title: "⛩️ Final Gate",
    desc: "The gate speaks one last question. Answer from your heart.",
    question: "What is stronger?",
    choices: ["⚔️ Strength", "❤️ Kindness", "💰 Money", "👑 Fame"],
    correctChoice: 1,
    hint: "🌿 A true warrior does not fight with steel alone.",
    successMsg: "❤️ A true warrior always chooses kindness.\n\n🌸 Gate Opened.",
    failMsgs: [
      "⛩️ The gate holds firm. Look into your heart.",
      "🌙 Not this path. The answer is gentler than you think.",
      "✨ The forest whispers: true strength is quiet.",
    ],
  },
];

// ── ESCAPE ROOM STATE ──────────────────────────────────────
const erState = {
  currentPuzzle: 0,
  hintUsed:      false,
  attempts:      0,
  timerInterval: null,
  elapsed:       0,
  tileSelected:  [],   // puzzle 1
  petalCollected:[],   // puzzle 2
  bambooOrder:   [],   // puzzle 3
};

// ── START ESCAPE ROOM ──────────────────────────────────────
window.startEscapeRoom = function () {
  erState.currentPuzzle  = 0;
  erState.elapsed        = 0;
  erState.hintUsed       = false;
  erState.attempts       = 0;
  erState.tileSelected   = [];
  erState.petalCollected = [];
  erState.bambooOrder    = [];

  switchScreen("erIntro", "erPuzzle", false);
  gsap.fromTo("#er-card",
    { y: 50, opacity: 0, scale: 0.92 },
    { y: 0, opacity: 1, scale: 1, duration: 0.7, ease: "back.out(1.5)", delay: 0.15 }
  );
  setTimeout(() => { startTimer(); renderPuzzle(0); }, 400);
};

// ── TIMER ──────────────────────────────────────────────────
function startTimer() {
  clearInterval(erState.timerInterval);
  erState.elapsed = 0;
  updateTimerDisplay();
  erState.timerInterval = setInterval(() => {
    erState.elapsed++;
    updateTimerDisplay();
    const el = document.getElementById("er-timer");
    if      (erState.elapsed >= 180) el.className = "er-timer danger";
    else if (erState.elapsed >= 120) el.className = "er-timer warning";
  }, 1000);
}

function stopTimer()  { clearInterval(erState.timerInterval); }

function updateTimerDisplay() {
  const m = String(Math.floor(erState.elapsed / 60)).padStart(2,"0");
  const s = String(erState.elapsed % 60).padStart(2,"0");
  document.getElementById("timer-display").textContent = `${m}:${s}`;
}

function formatElapsed() {
  const m = String(Math.floor(erState.elapsed / 60)).padStart(2,"0");
  const s = String(erState.elapsed % 60).padStart(2,"0");
  return `${m}:${s}`;
}

// ── RENDER PUZZLE ──────────────────────────────────────────
function renderPuzzle(index) {
  const p = ER_PUZZLES[index];
  erState.hintUsed       = false;
  erState.attempts       = 0;
  erState.tileSelected   = [];
  erState.petalCollected = [];
  erState.bambooOrder    = [];

  document.getElementById("er-puzzle-tag").textContent =
    `🌸 Trial ${index + 1} / ${ER_PUZZLES.length}`;

  const hintBtn  = document.getElementById("hint-btn");
  const hintText = document.getElementById("hint-text");
  hintBtn.disabled     = false;
  hintBtn.textContent  = "🌿 Whisper a Hint";
  hintText.textContent = "";
  hintText.classList.remove("visible");

  clearFeedback();
  document.getElementById("er-timer").className = "er-timer";

  const body = document.getElementById("er-puzzle-body");
  body.innerHTML = "";

  switch (p.type) {
    case "memory-tiles":    renderMemoryTiles(p, body);   break;
    case "petal-collect":   renderPetalCollect(p, body);  break;
    case "bamboo-arrange":  renderBambooArrange(p, body); break;
    case "memory-orbs":     renderMemoryOrbs(p, body);    break;
    case "final-gate":      renderFinalGate(p, body);     break;
  }

  gsap.fromTo(body, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" });
}

// ── PUZZLE 1: MEMORY TILES ────────────────────────────────
function renderMemoryTiles(p, body) {
  const tilesHTML = p.tiles.map((letter, i) =>
    `<button class="memory-tile" data-letter="${letter}" data-index="${i}" onclick="tileClick(this)">&nbsp;</button>`
  ).join("");

  body.innerHTML = `
    <p class="puzzle-title">${p.title}</p>
    <p class="tiles-instruction">${p.desc}</p>
    <div class="tiles-grid">${tilesHTML}</div>
    <div class="tiles-selected-row" id="tiles-selected"></div>
    <div class="tiles-actions">
      <button class="seq-clear-btn" onclick="clearTiles()">✕ Clear</button>
      <button class="er-submit-btn" onclick="submitTiles()">Seal Broken 🌸</button>
    </div>`;
}

window.tileClick = function (btn) {
  const letter = btn.dataset.letter;
  // Reveal tile
  if (!btn.classList.contains("revealed")) {
    btn.textContent = letter;
    btn.classList.add("revealed");
    gsap.fromTo(btn, { rotateY: 90 }, { rotateY: 0, duration: 0.35, ease: "back.out(1.4)" });
    return;
  }
  // Already revealed — select it
  if (btn.classList.contains("selected-correct")) return;
  const p = ER_PUZZLES[erState.currentPuzzle];
  if (erState.tileSelected.length >= p.answer.length) return;

  erState.tileSelected.push(letter);
  btn.classList.add("selected-correct");

  const row = document.getElementById("tiles-selected");
  const chip = document.createElement("div");
  chip.className = "tile-selected-letter";
  chip.textContent = letter;
  row.appendChild(chip);
};

window.clearTiles = function () {
  erState.tileSelected = [];
  document.querySelectorAll(".memory-tile.selected-correct").forEach(b => b.classList.remove("selected-correct"));
  const row = document.getElementById("tiles-selected");
  if (row) row.innerHTML = "";
  clearFeedback();
};

window.submitTiles = function () {
  const p = ER_PUZZLES[erState.currentPuzzle];
  const input = erState.tileSelected.join("");
  const correct = p.answer.join("");
  erCheckAnswer(input, correct);
};

// ── PUZZLE 2: PETAL COLLECT ───────────────────────────────
function renderPetalCollect(p, body) {
  body.innerHTML = `
    <p class="puzzle-title">${p.title}</p>
    <p class="petal-instruction">${p.desc}</p>
    <div class="petal-stage" id="petal-stage"></div>
    <div class="petal-collected-row" id="petal-collected"></div>
    <div class="tiles-actions">
      <button class="seq-clear-btn" onclick="resetPetals()">✕ Reset</button>
    </div>`;

  setTimeout(() => spawnPetals(p), 200);
}

function spawnPetals(p) {
  const stage = document.getElementById("petal-stage");
  if (!stage) return;

  p.petalLetters.forEach((letter, i) => {
    const el = document.createElement("div");
    el.className = "falling-petal";
    el.textContent = letter;
    el.dataset.letter = letter;

    const leftPct  = 5 + Math.random() * 85;
    const duration = 4 + Math.random() * 4;
    const delay    = i * 0.7;

    el.style.left            = leftPct + "%";
    el.style.animationDuration = duration + "s";
    el.style.animationDelay    = `-${delay}s`;
    el.addEventListener("click", () => collectPetal(el, letter, p));
    stage.appendChild(el);
  });
}

function collectPetal(el, letter, p) {
  if (el.classList.contains("collected")) return;

  const needed = p.answer[erState.petalCollected.length];
  if (letter !== needed) {
    erState.attempts++;
    const msg = p.failMsgs[(erState.attempts - 1) % p.failMsgs.length];
    showFeedback(msg, "error");
    resetPetals();
    return;
  }

  el.classList.add("collected");
  erState.petalCollected.push(letter);

  const row = document.getElementById("petal-collected");
  const chip = document.createElement("div");
  chip.className = "petal-letter-chip";
  chip.textContent = letter;
  row.appendChild(chip);
  clearFeedback();

  if (erState.petalCollected.join("") === p.answer.join("")) {
    showFeedback(p.successMsg, "success");
    flashUnlock();
    setTimeout(() => advancePuzzle(), 1800);
  }
}

window.resetPetals = function () {
  erState.petalCollected = [];
  const row = document.getElementById("petal-collected");
  if (row) row.innerHTML = "";
  const stage = document.getElementById("petal-stage");
  if (stage) {
    stage.innerHTML = "";
    const p = ER_PUZZLES[erState.currentPuzzle];
    spawnPetals(p);
  }
  clearFeedback();
};

// ── PUZZLE 3: BAMBOO ARRANGE ──────────────────────────────
function renderBambooArrange(p, body) {
  const scrollsHTML = p.scrollLetters.map((letter, i) =>
    `<button class="bamboo-scroll" data-letter="${letter}" onclick="tapBamboo(this)">${letter}</button>`
  ).join("");

  const slotsHTML = p.answer.map((_, i) =>
    `<div class="bamboo-slot" id="bslot-${i}"><span style="font-size:0.65rem;color:rgba(134,239,172,0.3)">${i+1}</span></div>`
  ).join("");

  body.innerHTML = `
    <p class="puzzle-title">${p.title}</p>
    <p class="bamboo-instruction">${p.desc}</p>
    <p style="font-size:0.78rem;color:rgba(134,239,172,0.6);margin-bottom:0.8rem;">Tap scrolls in order 👇</p>
    <div class="bamboo-scrolls" id="bamboo-scrolls">${scrollsHTML}</div>
    <p style="font-size:0.72rem;color:rgba(221,214,254,0.4);margin:0.4rem 0;">↓ Your arrangement</p>
    <div class="bamboo-slots">${slotsHTML}</div>
    <div class="tiles-actions">
      <button class="seq-clear-btn" onclick="clearBamboo()">✕ Clear</button>
      <button class="er-submit-btn" onclick="submitBamboo()">Reveal Path 🎋</button>
    </div>`;
}

window.tapBamboo = function (btn) {
  const p = ER_PUZZLES[erState.currentPuzzle];
  if (erState.bambooOrder.length >= p.answer.length) return;
  if (btn.disabled) return;

  const letter = btn.dataset.letter;
  erState.bambooOrder.push(letter);
  btn.disabled = true;
  btn.classList.add("glowing");

  const slotIdx = erState.bambooOrder.length - 1;
  const slot = document.getElementById(`bslot-${slotIdx}`);
  if (slot) {
    slot.innerHTML = `<span style="font-size:1.3rem;font-weight:900;color:#86efac">${letter}</span>`;
    slot.classList.add("filled");
  }
};

window.clearBamboo = function () {
  erState.bambooOrder = [];
  document.querySelectorAll(".bamboo-scroll").forEach(b => { b.disabled = false; b.classList.remove("glowing"); });
  const p = ER_PUZZLES[erState.currentPuzzle];
  p.answer.forEach((_, i) => {
    const slot = document.getElementById(`bslot-${i}`);
    if (slot) { slot.innerHTML = `<span style="font-size:0.65rem;color:rgba(134,239,172,0.3)">${i+1}</span>`; slot.classList.remove("filled"); }
  });
  clearFeedback();
};

window.submitBamboo = function () {
  const p = ER_PUZZLES[erState.currentPuzzle];
  const input   = erState.bambooOrder.join("");
  const correct = p.answer.join("");
  erCheckAnswer(input, correct);
};

// ── PUZZLE 4: MEMORY ORBS ─────────────────────────────────
function renderMemoryOrbs(p, body) {
  const orbsHTML = p.orbs.map((orb, i) =>
    `<div class="memory-orb" onclick="selectOrb(${i})">
       <span class="orb-emoji">${orb.emoji}</span>
       <span class="orb-label">${orb.label}</span>
     </div>`
  ).join("");

  body.innerHTML = `
    <p class="puzzle-title">${p.title}</p>
    <p class="orbs-instruction">${p.desc}</p>
    <div class="orbs-grid">${orbsHTML}</div>`;
}

window.selectOrb = function (index) {
  const p = ER_PUZZLES[erState.currentPuzzle];
  const orbs = document.querySelectorAll(".memory-orb");

  if (index === p.correctOrb) {
    orbs[index].classList.add("correct-orb");
    showFeedback(p.successMsg, "success");
    flashUnlock();
    orbs.forEach(o => o.style.pointerEvents = "none");
    setTimeout(() => advancePuzzle(), 1800);
  } else {
    orbs[index].classList.add("wrong-orb");
    erState.attempts++;
    const msg = p.failMsgs[(erState.attempts - 1) % p.failMsgs.length];
    showFeedback(msg, "error");
    setTimeout(() => orbs[index].classList.remove("wrong-orb"), 600);
  }
};

// ── PUZZLE 5: FINAL GATE ──────────────────────────────────
function renderFinalGate(p, body) {
  const choicesHTML = p.choices.map((choice, i) =>
    `<button class="gate-choice-btn" onclick="selectGateChoice(${i})">${choice}</button>`
  ).join("");

  body.innerHTML = `
    <p class="puzzle-title">${p.title}</p>
    <p class="gate-instruction">${p.desc}</p>
    <p class="gate-question">${p.question}</p>
    <div class="gate-choices">${choicesHTML}</div>`;
}

window.selectGateChoice = function (index) {
  const p = ER_PUZZLES[erState.currentPuzzle];
  const btns = document.querySelectorAll(".gate-choice-btn");
  btns.forEach(b => b.disabled = true);

  if (index === p.correctChoice) {
    btns[index].classList.add("gate-correct");
    showFeedback(p.successMsg, "success");
    flashUnlock();
    setTimeout(() => advancePuzzle(), 2000);
  } else {
    btns[index].classList.add("gate-wrong");
    erState.attempts++;
    const msg = p.failMsgs[(erState.attempts - 1) % p.failMsgs.length];
    showFeedback(msg, "error");
    setTimeout(() => {
      btns.forEach(b => { b.disabled = false; b.classList.remove("gate-wrong"); });
      clearFeedback();
    }, 1200);
  }
};

// ── GENERIC ANSWER CHECKER (tiles/bamboo) ─────────────────
function erCheckAnswer(input, correct) {
  const p = ER_PUZZLES[erState.currentPuzzle];
  if (input === correct) {
    showFeedback(p.successMsg, "success");
    flashUnlock();
    document.querySelectorAll(".er-submit-btn").forEach(b => b.disabled = true);
    setTimeout(() => advancePuzzle(), 1800);
  } else {
    erState.attempts++;
    const msg = p.failMsgs[(erState.attempts - 1) % p.failMsgs.length];
    showFeedback(msg, "error");
  }
}

// ── ADVANCE PUZZLE ────────────────────────────────────────
function advancePuzzle() {
  const next = erState.currentPuzzle + 1;
  if (next >= ER_PUZZLES.length) {
    stopTimer();
    showEscapeSuccess();
  } else {
    erState.currentPuzzle = next;
    const body = document.getElementById("er-puzzle-body");
    gsap.to(body, {
      opacity: 0, x: -40, duration: 0.3,
      onComplete: () => { gsap.set(body, { x: 0 }); renderPuzzle(next); },
    });
  }
}

// ── HINT ─────────────────────────────────────────────────
window.useHint = function () {
  if (erState.hintUsed) return;
  erState.hintUsed = true;
  const p        = ER_PUZZLES[erState.currentPuzzle];
  const hintText = document.getElementById("hint-text");
  const hintBtn  = document.getElementById("hint-btn");
  hintText.textContent = p.hint;
  hintText.classList.add("visible");
  hintBtn.disabled    = true;
  hintBtn.textContent = "🌿 Whispered";
  gsap.fromTo(hintText, { opacity: 0, y: 5 }, { opacity: 1, y: 0, duration: 0.4 });
};

// ── FEEDBACK ─────────────────────────────────────────────
function showFeedback(msg, type) {
  const fb = document.getElementById("er-feedback");
  fb.textContent = msg;
  fb.className   = `er-feedback show ${type}`;
}

function clearFeedback() {
  const fb = document.getElementById("er-feedback");
  if (fb) { fb.textContent = ""; fb.className = "er-feedback"; }
}

// ── UNLOCK FLASH ─────────────────────────────────────────
function flashUnlock() {
  const card  = document.getElementById("er-card");
  const flash = document.createElement("div");
  flash.className = "unlock-flash";
  card.appendChild(flash);
  gsap.to(flash, { opacity: 1, duration: 0.15,
    onComplete: () => gsap.to(flash, { opacity: 0, duration: 0.5,
      onComplete: () => flash.remove() }) });
}

// ── WISTERIA VICTORY CEREMONY ─────────────────────────────
function showEscapeSuccess() {
  document.getElementById("final-time").textContent = formatElapsed();

  // Switch screen
  screens.erPuzzle.classList.remove("active");
  screens.erSuccess.classList.add("active");
  gsap.fromTo(screens.erSuccess, { opacity: 0 }, { opacity: 1, duration: 0.8 });

  // Start all ambient effects
  setTimeout(() => {
    startFireflies();
    startLanterns();
    startBlossomCanvas();
    startVictoryTyping();
  }, 500);
}

// ── FIREFLIES ─────────────────────────────────────────────
function startFireflies() {
  const layer = document.getElementById("fireflies-layer");
  if (!layer) return;
  for (let i = 0; i < 22; i++) {
    const ff = document.createElement("div");
    ff.className = "firefly";
    const x   = Math.random() * 100;
    const y   = 10 + Math.random() * 80;
    const dur = 5 + Math.random() * 7;
    const mx  = (Math.random() - 0.5) * 120;
    const my  = (Math.random() - 0.5) * 100;
    const ex  = (Math.random() - 0.5) * 200;
    const ey  = (Math.random() - 0.5) * 180;
    ff.style.cssText = `
      left:${x}%; top:${y}%;
      animation-duration:${dur}s;
      animation-delay:-${Math.random()*dur}s;
      --ff-mid:translate(${mx}px,${my}px) scale(1);
      --ff-end:translate(${ex}px,${ey}px) scale(0.5);
    `;
    layer.appendChild(ff);
  }
}

// ── SKY LANTERNS ──────────────────────────────────────────
function startLanterns() {
  const layer = document.getElementById("lanterns-layer");
  if (!layer) return;
  const emojis = ["🏮","🪔","✨","🌟"];
  for (let i = 0; i < 10; i++) {
    const ln = document.createElement("div");
    ln.className  = "sky-lantern";
    ln.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    const x   = 5 + Math.random() * 90;
    const dur = 8 + Math.random() * 8;
    ln.style.cssText = `
      left:${x}%; bottom:-60px;
      font-size:${1.5 + Math.random()}rem;
      animation-duration:${dur}s;
      animation-delay:-${Math.random() * dur * 0.5}s;
    `;
    layer.appendChild(ln);
  }
}

// ── CHERRY BLOSSOM CANVAS ─────────────────────────────────
function startBlossomCanvas() {
  const canvas = document.getElementById("blossom-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  const petals = Array.from({ length: 35 }, () => ({
    x:     Math.random() * canvas.width,
    y:     Math.random() * canvas.height - canvas.height,
    size:  4 + Math.random() * 6,
    speed: 0.8 + Math.random() * 1.2,
    drift: (Math.random() - 0.5) * 0.8,
    rot:   Math.random() * Math.PI * 2,
    rotS:  (Math.random() - 0.5) * 0.04,
    alpha: 0.6 + Math.random() * 0.4,
  }));

  function drawBlossom() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    petals.forEach(p => {
      p.y   += p.speed;
      p.x   += p.drift;
      p.rot += p.rotS;
      if (p.y > canvas.height + 20) { p.y = -20; p.x = Math.random() * canvas.width; }

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = "#f9a8d4";
      ctx.shadowBlur = 6;
      ctx.shadowColor = "rgba(249,168,212,0.6)";
      // Draw simple petal oval
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size, p.size * 1.6, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
    requestAnimationFrame(drawBlossom);
  }
  drawBlossom();
}

// ── VICTORY TYPING ────────────────────────────────────────
const VICTORY_LINES = [
  { text: "Congratulations, Sneha.",        highlight: false, pause: 800  },
  { text: "",                               highlight: false, pause: 400  },
  { text: "You completed",                  highlight: false, pause: 500  },
  { text: "The Wisteria Trial.",            highlight: true,  pause: 900  },
  { text: "",                               highlight: false, pause: 600  },
  { text: "The greatest treasure...",       highlight: false, pause: 700  },
  { text: "was never hidden.",              highlight: false, pause: 700  },
  { text: "",                               highlight: false, pause: 400  },
  { text: "It has always been",             highlight: false, pause: 500  },
  { text: "the memories we made together.", highlight: true,  pause: 1000 },
  { text: "",                               highlight: false, pause: 600  },
  { text: "Happy Birthday ❤️",             highlight: true,  pause: 500  },
];

function startVictoryTyping() {
  const container = document.getElementById("victory-message");
  if (!container) return;
  container.innerHTML = "";

  let i = 0;
  function showNext() {
    if (i >= VICTORY_LINES.length) {
      // All lines shown — reveal next button and fire confetti
      const btn = document.getElementById("victory-next-btn");
      if (btn) {
        gsap.to(btn, { opacity: 1, duration: 0.6, ease: "power2.out" });
        btn.style.pointerEvents = "all";
      }
      launchConfetti();
      setTimeout(() => launchConfetti(), 600);
      return;
    }

    const lineData = VICTORY_LINES[i];
    const span = document.createElement("span");
    span.className = "victory-line" + (lineData.highlight ? " highlight" : "");
    span.textContent = lineData.text || "\u00A0"; // non-breaking space for empty lines
    container.appendChild(span);

    // Trigger reveal after a tiny paint delay
    requestAnimationFrame(() => {
      requestAnimationFrame(() => span.classList.add("show"));
    });

    i++;
    setTimeout(showNext, lineData.pause);
  }

  setTimeout(showNext, 600);
}

// ── MILESTONE 4 → Hidden Button Intro ─────────────────────
window.goToMilestone4 = function () {
  gsap.to(screens.erSuccess, {
    opacity: 0, duration: 0.5,
    onComplete: () => {
      screens.erSuccess.classList.remove("active");
      screens.hbIntro.classList.add("active");
      gsap.fromTo(screens.hbIntro, { opacity: 0 }, { opacity: 1, duration: 0.5 });
      gsap.fromTo("#hb-intro-card",
        { y: 40, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.7, ease: "back.out(1.6)" }
      );
    },
  });
};

/* =========================================================
   PART 4 — HIDDEN BUTTON CHALLENGE ENGINE
   ========================================================= */

// ── CONFIG ─────────────────────────────────────────────────
const HB_CONFIG = {
  total:       5,
  timeLimit:   60,       // seconds
  buttonSize:  48,       // px, width & height
  // Each button has a label (shown on find toast) and a colour
  buttons: [
    { emoji: "🎂", label: "Birthday Cake!",    color: "rgba(255,110,199,0.85)" },
    { emoji: "💜", label: "A little love!",    color: "rgba(168,85,247,0.85)"  },
    { emoji: "✨", label: "Sparkle found!",    color: "rgba(250,204,21,0.85)"  },
    { emoji: "🎉", label: "Party time!",       color: "rgba(96,165,250,0.85)"  },
    { emoji: "👑", label: "The Crown! +Bonus", color: "rgba(251,191,36,0.85)"  },
  ],
  // Score per button (last one is bonus)
  scores:   [100, 100, 100, 100, 200],
  // Personalised messages on each find (index matches button)
  findMsgs: [
    "🎂 Found the cake! Now eat one IRL too, Sneha 😂",
    "💜 Found the love button! Prasad approves.",
    "✨ Sparkle found! Matches your personality fr.",
    "🎉 Party button! You ARE the party, Sneha.",
    "👑 THE CROWN! Bonus 200 pts! Queen behaviour. 👑",
  ],
  // Clue ribbons that rotate as time ticks
  clues: [
    "🕵️ Psst... look everywhere. Corners, edges, the middle... 👀",
    "💡 Try the very edge of the screen...",
    "🤫 One of them is hiding near the top...",
    "👀 Bottom corners are suspicious...",
    "🎯 The crown is worth double points! Find it!",
  ],
};

// ── STATE ──────────────────────────────────────────────────
const hbState = {
  found:         0,
  score:         0,
  timeLeft:      HB_CONFIG.timeLimit,
  timerInterval: null,
  clueInterval:  null,
  clueIndex:     0,
  active:        false,
};

// ── START ──────────────────────────────────────────────────
window.startHiddenButtons = function () {
  // Reset state
  hbState.found    = 0;
  hbState.score    = 0;
  hbState.timeLeft = HB_CONFIG.timeLimit;
  hbState.active   = true;
  hbState.clueIndex = 0;

  // Switch to play screen
  screens.hbIntro.classList.remove("active");
  screens.hbPlay.classList.add("active");
  gsap.fromTo(screens.hbPlay, { opacity: 0 }, { opacity: 1, duration: 0.4 });

  // Reset HUD
  updateHBHud();
  document.getElementById("hb-timer-display").className = "";

  // Place buttons after screen is visible
  setTimeout(() => {
    placeHiddenButtons();
    startHBTimer();
    startClueRotation();
  }, 300);
};

// ── PLACE HIDDEN BUTTONS ───────────────────────────────────
function placeHiddenButtons() {
  // Remove any old buttons
  document.querySelectorAll(".hb-btn").forEach((b) => b.remove());

  const W    = window.innerWidth;
  const H    = window.innerHeight;
  const size = HB_CONFIG.buttonSize;
  const hud  = 100;   // keep below HUD height
  const pad  = size;  // minimum padding from edges

  // Pre-defined zone grid to avoid overlap
  const zones = generateNonOverlappingPositions(
    HB_CONFIG.total, W, H, size, hud, pad
  );

  HB_CONFIG.buttons.forEach((btn, i) => {
    const el = document.createElement("button");
    el.className         = "hb-btn";
    el.dataset.index     = i;
    el.dataset.found     = "false";
    el.textContent       = btn.emoji;
    el.style.width       = size + "px";
    el.style.height      = size + "px";
    el.style.left        = zones[i].x + "px";
    el.style.top         = zones[i].y + "px";
    el.style.background  = btn.color;
    el.style.boxShadow   = `0 0 18px ${btn.color}`;

    el.addEventListener("click", () => handleButtonFound(i, el));
    document.body.appendChild(el);
  });
}

// Generate positions that don't overlap each other
function generateNonOverlappingPositions(count, W, H, size, hudH, pad) {
  const positions = [];
  const minDist   = size * 2.5;  // minimum distance between buttons
  let attempts    = 0;

  while (positions.length < count && attempts < 500) {
    attempts++;
    const x = pad + Math.random() * (W - size - pad * 2);
    const y = hudH + pad + Math.random() * (H - size - hudH - pad * 2);

    // Check distance from existing positions
    const tooClose = positions.some((p) => {
      const dx = p.x - x;
      const dy = p.y - y;
      return Math.sqrt(dx * dx + dy * dy) < minDist;
    });

    if (!tooClose) positions.push({ x, y });
  }

  return positions;
}

// ── HANDLE BUTTON FOUND ────────────────────────────────────
function handleButtonFound(index, el) {
  if (!hbState.active) return;
  if (el.dataset.found === "true") return;

  el.dataset.found = "true";
  hbState.found++;
  hbState.score += HB_CONFIG.scores[index];

  // Pop animation then hide
  el.classList.add("found");

  // Screen flash
  flashHBFound(HB_CONFIG.buttons[index].color);

  // Toast notification
  showHBToast(HB_CONFIG.findMsgs[index], HB_CONFIG.buttons[index].color);

  // Update HUD
  updateHBHud();

  // Bounce found count
  gsap.fromTo(
    "#hb-found-count",
    { scale: 1.5, color: "#ffffff" },
    { scale: 1, color: "#facc15", duration: 0.4, ease: "back.out(2)" }
  );

  // Check if all found
  if (hbState.found >= HB_CONFIG.total) {
    setTimeout(() => endHiddenButtons("success"), 600);
  }
}

// ── FLASH OVERLAY ──────────────────────────────────────────
function flashHBFound(color) {
  const flash = document.getElementById("hb-found-flash");
  flash.style.background = color;
  gsap.fromTo(flash,
    { opacity: 0.35 },
    { opacity: 0, duration: 0.5, ease: "power2.out" }
  );
}

// ── TOAST ──────────────────────────────────────────────────
function showHBToast(msg, color) {
  // Remove any existing toast
  const old = document.querySelector(".hb-toast");
  if (old) old.remove();

  const toast = document.createElement("div");
  toast.className   = "hb-toast";
  toast.textContent = msg;
  toast.style.top   = "80px";
  document.body.appendChild(toast);

  gsap.timeline()
    .to(toast, { opacity: 1, y: 0,   duration: 0.3, ease: "back.out(1.5)" })
    .to(toast, { opacity: 0, y: -15, duration: 0.4, delay: 1.6 })
    .call(() => toast.remove());
}

// ── HUD UPDATE ─────────────────────────────────────────────
function updateHBHud() {
  document.getElementById("hb-found-count").textContent =
    `${hbState.found} / ${HB_CONFIG.total}`;
  document.getElementById("hb-score-display").textContent = hbState.score;
}

// ── TIMER ──────────────────────────────────────────────────
function startHBTimer() {
  clearInterval(hbState.timerInterval);

  hbState.timerInterval = setInterval(() => {
    hbState.timeLeft--;

    const el = document.getElementById("hb-timer-display");
    el.textContent = hbState.timeLeft;

    if (hbState.timeLeft <= 15 && hbState.timeLeft > 5) {
      el.className = "warning";
    } else if (hbState.timeLeft <= 5) {
      el.className = "danger";
    }

    if (hbState.timeLeft <= 0) {
      endHiddenButtons("timeout");
    }
  }, 1000);
}

function stopHBTimer() {
  clearInterval(hbState.timerInterval);
}

// ── CLUE ROTATION ──────────────────────────────────────────
function startClueRotation() {
  clearInterval(hbState.clueInterval);

  hbState.clueInterval = setInterval(() => {
    hbState.clueIndex = (hbState.clueIndex + 1) % HB_CONFIG.clues.length;
    const ribbon = document.getElementById("hb-clue-ribbon");
    if (!ribbon) return;

    gsap.to(ribbon, {
      opacity: 0, duration: 0.3,
      onComplete: () => {
        ribbon.textContent = HB_CONFIG.clues[hbState.clueIndex];
        gsap.to(ribbon, { opacity: 1, duration: 0.4 });
      },
    });
  }, 8000);
}

function stopClueRotation() {
  clearInterval(hbState.clueInterval);
}

// ── END GAME ───────────────────────────────────────────────
function endHiddenButtons(outcome) {
  hbState.active = false;
  stopHBTimer();
  stopClueRotation();

  // Remove all hidden buttons
  document.querySelectorAll(".hb-btn").forEach((b) => b.remove());
  document.querySelectorAll(".hb-toast").forEach((t) => t.remove());

  if (outcome === "success") {
    showHBSuccess();
  } else {
    showHBTimeout();
  }
}

// ── SUCCESS SCREEN ─────────────────────────────────────────
function showHBSuccess() {
  const timeUsed  = HB_CONFIG.timeLimit - hbState.timeLeft;
  const timeBonus = hbState.timeLeft > 0 ? hbState.timeLeft * 5 : 0;
  const total     = hbState.score + timeBonus;

  document.getElementById("hb-final-score").textContent = total;
  document.getElementById("hb-time-left").textContent   = hbState.timeLeft;

  // Dynamic message based on time left
  let msg, icon;
  if (hbState.timeLeft >= 30) {
    icon = "🚀"; msg = "Lightning fast! Sneha has eagle eyes AND speed. Dangerous combo. 😤👑";
  } else if (hbState.timeLeft >= 15) {
    icon = "🔥"; msg = "Solid performance! You found them all with time to spare. Prasad is impressed. 😏";
  } else {
    icon = "😅"; msg = "Just made it! A few more seconds and Prasad would never let you forget. 😂💜";
  }

  document.getElementById("hb-success-icon").textContent = icon;
  document.getElementById("hb-success-msg").textContent  = msg;

  // Trophy row — one trophy per button found
  const trophyRow = document.getElementById("hb-trophy-row");
  trophyRow.innerHTML = HB_CONFIG.buttons
    .map((b, i) => `<span style="animation-delay:${i * 0.12}s">${b.emoji}</span>`)
    .join("");

  // Transition
  screens.hbPlay.classList.remove("active");
  screens.hbSuccess.classList.add("active");
  gsap.fromTo(screens.hbSuccess, { opacity: 0 }, { opacity: 1, duration: 0.5 });
  gsap.fromTo(
    "#hb-success-card",
    { y: 40, opacity: 0, scale: 0.92 },
    { y: 0, opacity: 1, scale: 1, duration: 0.7, ease: "back.out(1.6)" }
  );

  // Confetti!
  setTimeout(() => launchConfetti(), 400);
}

// ── TIMEOUT SCREEN ─────────────────────────────────────────
function showHBTimeout() {
  document.getElementById("hb-timeout-found").textContent = hbState.found;

  screens.hbPlay.classList.remove("active");
  screens.hbTimeout.classList.add("active");
  gsap.fromTo(screens.hbTimeout, { opacity: 0 }, { opacity: 1, duration: 0.5 });
  gsap.fromTo(
    "#hb-timeout-card",
    { y: 40, opacity: 0, scale: 0.92 },
    { y: 0, opacity: 1, scale: 1, duration: 0.7, ease: "back.out(1.6)" }
  );
}

// ── RETRY ──────────────────────────────────────────────────
window.retryHiddenButtons = function () {
  gsap.to(screens.hbTimeout, {
    opacity: 0, duration: 0.4,
    onComplete: () => {
      screens.hbTimeout.classList.remove("active");
      // Go back to intro for a fresh start
      screens.hbIntro.classList.add("active");
      gsap.fromTo(screens.hbIntro, { opacity: 0 }, { opacity: 1, duration: 0.4 });
      gsap.fromTo(
        "#hb-intro-card",
        { y: 30, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.5)" }
      );
    },
  });
};

// ── MILESTONE 5 → Memory Wall Intro ───────────────────────
window.goToMilestone5 = function () {
  document.querySelectorAll(".hb-btn").forEach((b) => b.remove());

  const fromScreen = screens.hbSuccess.classList.contains("active")
    ? screens.hbSuccess
    : screens.hbTimeout;

  gsap.to(fromScreen, {
    opacity: 0, duration: 0.5,
    onComplete: () => {
      fromScreen.classList.remove("active");
      screens.mwIntro.classList.add("active");
      gsap.fromTo(screens.mwIntro, { opacity: 0 }, { opacity: 1, duration: 0.5 });
      gsap.fromTo(
        "#mw-intro-card",
        { y: 40, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.7, ease: "back.out(1.6)" }
      );
    },
  });
};

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
    imageUrl: "",
    title: "Where It All Began",
    date: "19 April 2025",
    story: "Rupal introduced us on 19 April 2025. I never imagined that an ordinary introduction would turn into one of the most meaningful friendships of my life. Looking back now, I'm really grateful that our paths crossed that day.",
    tags: ["#19april2025", "#beginnings", "#grateful"],
  },
  {
    id: 2,
    emoji: "🏔️",
    caption: "Chapter 2",
    imageUrl: "",
    title: "The Crazy Adventure",
    date: "Karnala Fort Trek",
    story: "Who knew a simple trek to Karnala Fort would become one of our favorite adventures? We somehow have this talent for turning ordinary plans into unforgettable memories. Every climb, every laugh, every tired step became part of a story we'll always remember.",
    tags: ["#karnalafort", "#adventure", "#unforgettable"],
  },
  {
    id: 3,
    emoji: "🚴",
    caption: "Chapter 3",
    imageUrl: "",
    title: "Midnight Rides & Endless Conversations",
    date: "Marine Drive & Worli Sea Face",
    story: "Those late-night cycling rides weren't just about the roads we travelled — they were about the conversations that never seemed to end. Sitting by Marine Drive or Worli Sea Face, watching the waves, feeling the cool breeze, and singing our favorite retro songs... those moments felt timeless. Sometimes the simplest nights become the most unforgettable memories.",
    tags: ["#marinedrive", "#midnightrides", "#timeless"],
  },
  {
    id: 4,
    emoji: "🌊",
    caption: "Chapter 4",
    imageUrl: "",
    title: "Vitamin Sea",
    date: "A day by the sea",
    story: "What started as an unexpected plan turned into one of the most memorable days. Between endless laughter, heartfelt conversations, and sharing pieces of our lives with each other, the sea quietly became a witness to a friendship growing stronger. Some places become special not because of where they are, but because of who you're with.",
    tags: ["#vitaminsea", "#friendship", "#goodvibes"],
  },
  {
    id: 5,
    emoji: "☕",
    caption: "Chapter 5",
    imageUrl: "",
    title: "Chai, Coffee & Endless Talks",
    date: "Every ordinary evening",
    story: "Some of our best memories weren't made on big trips — they were created over a cup of coffee or chai. Hours would pass without us noticing as we shared stories, laughed over the silliest things, discussed life, dreams, and everything in between. Those conversations turned ordinary evenings into unforgettable moments.",
    tags: ["#chai", "#coffee", "#endlesstalks"],
  },
  {
    id: 6,
    emoji: "🎵",
    caption: "Chapter 6",
    imageUrl: "",
    title: "The Spotify Sessions",
    date: "Whenever boredom struck",
    story: "Some of the best moments didn't need a destination — just a good playlist. Whenever boredom struck, one of us would hit play on Spotify, and suddenly an ordinary day became a mini concert. Sometimes it was singing along at the top of our lungs, and other times it was sending just one line of a song over chat, waiting for the other person to complete the next line. Those little musical moments became our own inside language, turning simple conversations into memories worth smiling about.",
    tags: ["#spotify", "#musicmoments", "#insidelanguage"],
  },
  {
    id: 7,
    emoji: "🌟",
    caption: "Chapter 7",
    imageUrl: "",
    title: "A Friend Like You",
    date: "Every single day",
    story: "They say some people enter your life for a reason. You came into mine unexpectedly, but your kindness, support, crazy energy, and countless laughs made this friendship truly special. Thank you for being someone I can always count on — for the smiles, the encouragement, and the memories we've created together.",
    tags: ["#grateful", "#truefriend", "#alwayshere"],
  },
  {
    id: 8,
    emoji: "🌸",
    caption: "Chapter 8",
    imageUrl: "",
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
};

// ── START MEMORY WALL ──────────────────────────────────────
window.startMemoryWall = function () {
  mwState.flipped.clear();
  mwState.modalOpen = false;

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
    wrap.classList.add("flipped");
    mwState.flipped.add(mem.id);
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

    // Check all flipped
    if (mwState.flipped.size === MEMORIES.length) {
      setTimeout(() => onAllCardsFlipped(), 400);
    }
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

  // Big confetti
  launchConfetti();
}

// ── UPDATE HEADER ──────────────────────────────────────────
function updateMWHeader() {
  document.getElementById("mw-flipped-count").textContent =
    `${mwState.flipped.size} / ${MEMORIES.length} flipped`;
}

// ── MODAL ──────────────────────────────────────────────────
function openMemoryModal(mem) {
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
  const overlay = document.getElementById("mw-modal-overlay");
  overlay.classList.remove("open");
  mwState.modalOpen = false;
};

// Close modal on Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && mwState.modalOpen) closeMemoryModal();
});

// ── FINISH MEMORY WALL ─────────────────────────────────────
window.finishMemoryWall = function () {
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
  "First of all — you actually made it through all 7 missions. Honestly? Prasad is shook. 😂\n\n",
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
    audio.pause();
    musicPlaying = false;
    document.getElementById("music-play-btn").textContent = "▶";
    document.getElementById("music-disc").classList.remove("spinning");
    document.getElementById("music-player").classList.remove("playing");
  } else {
    audio.play().catch(() => {
      // Autoplay blocked — that's fine, user can click the button
    });
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
  const speed     = 22; // ms per character

  function typeNext() {
    if (charIndex < fullText.length) {
      // Insert character before cursor
      const char = document.createTextNode(fullText[charIndex]);
      body.insertBefore(char, cursor);
      charIndex++;

      // Scroll letter into view as text grows
      cursor.scrollIntoView({ block: "nearest", behavior: "smooth" });

      // Slightly variable speed for realism
      const delay = fullText[charIndex - 1] === "\n" ? 200
                  : fullText[charIndex - 1] === "." ? 180
                  : fullText[charIndex - 1] === "," ? 100
                  : speed + Math.random() * 10;

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
  // Stop music
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
