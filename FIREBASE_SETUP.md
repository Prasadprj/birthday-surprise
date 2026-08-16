# Firebase Setup — Birthday Surprise Tracker

> **This takes about 5 minutes.** Do this before you share the link with Sneha.

---

## Step 1 — Create a free Firebase project

1. Go to **https://console.firebase.google.com**
2. Click **"Add project"**
3. Name it anything — e.g. `sneha-birthday`
4. Disable Google Analytics (not needed) → **Create project**
5. Wait ~30 seconds for it to set up

---

## Step 2 — Enable Realtime Database

1. In the left sidebar, click **Build → Realtime Database**
2. Click **"Create database"**
3. Choose any location (pick the one closest to you)
4. When asked for security rules, select **"Start in test mode"**
   > ⚠️ Test mode is fine — this database only holds tracking events, no secrets
5. Click **Enable**

---

## Step 3 — Get your Firebase config

1. In the left sidebar, click the ⚙️ gear icon → **Project settings**
2. Scroll down to **"Your apps"**
3. Click the **`</>`** (web) icon to add a web app
4. Give it any nickname — e.g. `tracker`
5. **Do NOT** check "Firebase Hosting"
6. Click **"Register app"**
7. You'll see a `firebaseConfig` object like this:

```js
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "sneha-birthday.firebaseapp.com",
  databaseURL: "https://sneha-birthday-default-rtdb.firebaseio.com",
  projectId: "sneha-birthday",
  storageBucket: "sneha-birthday.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

Copy this entire block.

---

## Step 4 — Paste the config in two files

### In `tracker.js` (line ~12):

```js
const FIREBASE_CONFIG = {
  apiKey:            "AIzaSy...",        // ← paste your values
  authDomain:        "sneha-birthday.firebaseapp.com",
  databaseURL:       "https://sneha-birthday-default-rtdb.firebaseio.com",
  projectId:         "sneha-birthday",
  storageBucket:     "sneha-birthday.appspot.com",
  messagingSenderId: "123456789",
  appId:             "1:123456789:web:abc123",
};
```

### In `admin.html` (line ~245):

Paste the **same config** in the `FIREBASE_CONFIG` block at the top of the `<script>` tag.

---

## Step 5 — Test it locally

1. Open `index.html` in your browser
2. Open a second tab with `admin.html`
3. Click around on the birthday site
4. Watch events appear live in `admin.html`

---

## Step 6 — Deploy

Just upload all files to wherever you host the site (Netlify, GitHub Pages, Vercel, etc.).

- `index.html` — what Sneha visits
- `tracker.js` — loaded silently, invisible to Sneha
- `admin.html` — **your secret dashboard** (don't share this URL)
- `script.js`, `style.css`, `images/`, `assets/` — everything else

> **Important:** Sneha visits `yourdomain.com/index.html`  
> You watch `yourdomain.com/admin.html` — she has no reason to ever go there.

---

## What you'll see in admin.html

| What happened | When it fires |
|---|---|
| 🟢 Opened the site | First page load |
| 🔐 Identity verification | Clicked "Start Mission" |
| 🚫 Tried to deny being Sneha | Clicked "I'm not Sneha" 😂 |
| 🎵 Picked the right song! | Selected the correct song |
| 📖 Opened a letter | Each envelope opened (shows friend name) |
| 🎉 Opened all letters | After last letter closed |
| 🖤 Opened YOUR letter | The black envelope |
| 📸 Flipped a memory card | Each card flip (shows count) |
| 🎊 REACHED THE FINALE | Grand finale screen |

---

## Troubleshooting

**"Permission denied" error in console**  
→ Go to Firebase → Realtime Database → Rules → set both `read` and `write` to `true`

**No data appearing in admin**  
→ Double-check that `databaseURL` in your config ends with `.firebaseio.com` (not `.com/`)

**Config warning still showing in admin.html**  
→ Make sure you pasted the config in `admin.html`'s `<script>` section, not just in `tracker.js`
