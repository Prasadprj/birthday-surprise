/* ============================================================
   tracker.js — Invisible Firebase progress tracker
   Visitor (Sneha) sees NOTHING. Only Prasad sees the dashboard.
   ============================================================ */

// ── PASTE YOUR FIREBASE CONFIG HERE ─────────────────────────
// Get this from: Firebase Console → Project Settings → Your Apps → SDK setup
const FIREBASE_CONFIG = {
  apiKey:            "AIzaSyBEI_6lcRNyXMetkfY1EhB_Ll3kwE7opfI",
  authDomain:        "sneha-birthday-fca52.firebaseapp.com",
  databaseURL:       "https://sneha-birthday-fca52-default-rtdb.firebaseio.com",
  projectId:         "sneha-birthday-fca52",
  storageBucket:     "sneha-birthday-fca52.firebasestorage.app",
  messagingSenderId: "1008514992705",
  appId:             "1:1008514992705:web:40bcdbe8820bbd90fd54c0",
};
// ─────────────────────────────────────────────────────────────

// ── SCREEN LABELS (human-readable for the dashboard) ─────────
const SCREEN_LABELS = {
  "site_opened":          "🟢 Opened the site",
  "screen_welcome":       "👋 Welcome screen",
  "screen_verify":        "🔐 Identity verification",
  "screen_denied":        "🚫 Tried to deny being Sneha 😂",
  "screen_song":          "🎵 Song challenge",
  "song_correct":         "✅ Picked the right song!",
  "song_wrong":           "❌ Picked a wrong song",
  "screen_people_intro":  "💌 People intro",
  "screen_envelopes":     "📬 Envelope garden",
  "letter_opened":        "📖 Opened a letter",
  "all_letters_opened":   "🎉 Opened ALL letters!",
  "black_envelope":       "🖤 Opened the black envelope",
  "screen_memory_wall":   "📸 Memory wall",
  "memory_card_flipped":  "🔄 Flipped a memory card",
  "all_cards_flipped":    "🥹 Flipped all memory cards!",
  "screen_finale":        "🎊 REACHED THE FINALE!",
  "music_toggled":        "🎶 Toggled music",
  "restart":              "🔄 Restarted the experience",
};

// ── INTERNAL STATE ────────────────────────────────────────────
let _db        = null;   // Firebase database reference
let _sessionId = null;   // Unique session ID for this visit
let _ready     = false;  // Firebase initialized flag
let _queue     = [];     // Events queued before Firebase is ready

// ── SESSION ID ────────────────────────────────────────────────
function _getSessionId() {
  // Reuse within same tab session, new ID on fresh visit
  let sid = sessionStorage.getItem("_bday_sid");
  if (!sid) {
    sid = "sneha_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7);
    sessionStorage.setItem("_bday_sid", sid);
  }
  return sid;
}

// Force a new session (called when old session lacks device/IP info)
function _forceNewSession() {
  sessionStorage.removeItem("_bday_sid");
  return _getSessionId();
}

// ── DEVICE DETECTION ─────────────────────────────────────────
function _parseDevice(ua) {
  // OS / Device model
  let device = "Unknown Device";
  if (/iPhone/.test(ua))        device = "iPhone";
  else if (/iPad/.test(ua))     device = "iPad";
  else if (/Android/.test(ua)) {
    const m = ua.match(/Android[\s\d.]+;\s*([^)]+)\)/);
    device = m ? m[1].trim() : "Android Device";
  }
  else if (/Windows/.test(ua))  device = "Windows PC";
  else if (/Macintosh/.test(ua)) device = "Mac";
  else if (/Linux/.test(ua))    device = "Linux PC";

  // Browser
  let browser = "Unknown Browser";
  if (/CriOS/.test(ua))        browser = "Chrome (iOS)";
  else if (/FxiOS/.test(ua))   browser = "Firefox (iOS)";
  else if (/EdgA|EdgiOS/.test(ua)) browser = "Edge (Mobile)";
  else if (/SamsungBrowser/.test(ua)) browser = "Samsung Browser";
  else if (/OPR|Opera/.test(ua)) browser = "Opera";
  else if (/Edg\//.test(ua))   browser = "Edge";
  else if (/Chrome\//.test(ua)) browser = "Chrome";
  else if (/Firefox\//.test(ua)) browser = "Firefox";
  else if (/Safari\//.test(ua)) browser = "Safari";

  return { device, browser };
}

// ── INIT ─────────────────────────────────────────────────────
function _initTracker() {
  try {
    if (!firebase || !firebase.apps) return; // SDK not loaded yet

    // Only init once
    if (!firebase.apps.length) {
      firebase.initializeApp(FIREBASE_CONFIG);
    }

    _db        = firebase.database();
    _sessionId = _getSessionId();

    const { device, browser } = _parseDevice(navigator.userAgent);

    // Check if existing session is missing device info (old session from before tracking upgrade)
    // If so, force a new session so we get fresh IP + device data
    _db.ref(`sessions/${_sessionId}/device`).once("value", snap => {
      if (!snap.exists()) {
        // Old session — force a fresh one
        _sessionId = _forceNewSession();
        console.log("[tracker] Old session detected, starting fresh session:", _sessionId);
      }

      _ready = true;
      const sessionRef = _db.ref(`sessions/${_sessionId}`);

      // Always write base info
      sessionRef.update({
        started_at:  firebase.database.ServerValue.TIMESTAMP,
        user_agent:  navigator.userAgent.slice(0, 200),
        device,
        browser,
        screen:      `${screen.width}×${screen.height}`,
        last_seen:   firebase.database.ServerValue.TIMESTAMP,
      }).then(() => {
        console.log("[tracker] ✅ Base session written. Device:", device, "| Browser:", browser);
      }).catch(err => {
        console.error("[tracker] ❌ Base session write FAILED:", err.message);
      });

      // Fetch IP + location (ipwho.is — free, HTTPS, no key needed)
      fetch("https://ipwho.is/")
        .then(r => r.json())
        .then(geo => {
          if (geo.success !== false) {
            sessionRef.update({
              ip:       geo.ip                      || "unknown",
              city:     geo.city                    || "unknown",
              region:   geo.region                  || "unknown",
              country:  geo.country                 || "unknown",
              org:      (geo.connection && geo.connection.org) || geo.org || "unknown",
              timezone: (geo.timezone && geo.timezone.id) || "unknown",
            }).then(() => {
              console.log("[tracker] ✅ IP info written:", geo.ip, geo.city, geo.country);
            }).catch(err => {
              console.error("[tracker] ❌ IP write FAILED:", err.message);
            });
          } else {
            throw new Error("ipwho.is failed");
          }
        })
        .catch(err => {
          console.warn("[tracker] Primary IP lookup failed, trying fallback:", err.message);
          fetch("https://ipapi.co/json/")
            .then(r => r.json())
            .then(geo => {
              sessionRef.update({
                ip:       geo.ip           || "unknown",
                city:     geo.city         || "unknown",
                region:   geo.region       || "unknown",
                country:  geo.country_name || "unknown",
                org:      geo.org          || "unknown",
                timezone: geo.timezone     || "unknown",
              }).then(() => {
                console.log("[tracker] ✅ IP info written (fallback):", geo.ip);
              });
            })
            .catch(err2 => {
              console.warn("[tracker] Both IP lookups failed:", err2.message);
            });
        });

      // Flush any queued events
      console.log("[tracker] Flushing", _queue.length, "queued event(s).");
      _queue.forEach(e => _write(e.event, e.data));
      _queue = [];
    });

    _ready = false; // Will be set true inside the callback above

    // Update "last_seen" every 30s (so you know she's still active)
    setInterval(() => {
      if (_db && _sessionId) {
        _db.ref(`sessions/${_sessionId}/last_seen`)
           .set(firebase.database.ServerValue.TIMESTAMP);
      }
    }, 30000);

  } catch (err) {
    console.error("[tracker] ❌ Init failed:", err.message);
  }
}

// ── INTERNAL WRITE ───────────────────────────────────────────
function _write(event, data) {
  if (!_ready || !_db || !_sessionId) {
    console.log("[tracker] Queuing event (Firebase not ready yet):", event);
    _queue.push({ event, data });
    return;
  }
  try {
    const payload = {
      event,
      label:     SCREEN_LABELS[event] || event,
      ts:        firebase.database.ServerValue.TIMESTAMP,
      ...data,
    };

    console.log("[tracker] Writing event:", event);

    // Push to events log
    _db.ref(`sessions/${_sessionId}/events`).push(payload)
      .then(() => console.log("[tracker] ✅ Event written:", event))
      .catch(err => console.error("[tracker] ❌ Event write FAILED:", event, err.message, "— Check Firebase rules."));

    // Update current screen on session root (for live "where is she now")
    if (event.startsWith("screen_") || event === "screen_finale" || event === "site_opened") {
      _db.ref(`sessions/${_sessionId}`).update({
        current_screen: SCREEN_LABELS[event] || event,
        last_seen:      firebase.database.ServerValue.TIMESTAMP,
      });
    }

    // Also write to a flat "latest" node for instant dashboard reads
    _db.ref("latest").set({
      session_id:     _sessionId,
      current_screen: SCREEN_LABELS[event] || event,
      last_event:     SCREEN_LABELS[event] || event,
      last_seen:      firebase.database.ServerValue.TIMESTAMP,
    });

  } catch (err) {
    console.error("[tracker] ❌ Write threw an exception:", err.message);
  }
}

// ── PUBLIC API ───────────────────────────────────────────────
// Call track("event_name") anywhere in script.js
window.track = function (event, extraData = {}) {
  _write(event, extraData);
};

// ── AUTO-INIT (runs after Firebase SDK loads) ─────────────────
// Retry until Firebase SDK is available (loaded via CDN in index.html)
let _initAttempts = 0;
function _tryInit() {
  if (typeof firebase !== "undefined") {
    _initTracker();
  } else if (_initAttempts < 20) {
    _initAttempts++;
    setTimeout(_tryInit, 300);
  }
}
_tryInit();
