## Spàrsh — Open-source browser UI (web + Windows + Android)

Spàrsh faithfully reproduces the visual design, layout, interactions, and UX of Comet Browser while using the Spàrsh brand (logo, name, colors). It prioritizes pixel-accurate UI, smooth animations, and the same information architecture (tabs, address bar, new-tab shortcuts, private mode, downloads, history, settings).

Built as a web app (React + Vite) embedded into Electron (Windows) and Capacitor (Android).

### Features
- Tabs with private mode
- Omnibox (search or URL) with Google/Duck/Brave engines
- New Tab page with shortcuts
- History and Downloads panels
- Settings panel

### Quickstart

Prereqs: Node 18+, npm.

Install deps and build web:

```bash
npm install
npm run build:web
```

Run web dev server:

```bash
npm run dev:web
```

Run Electron (Windows packaging supported via electron-builder):

```bash
npm run dev # starts web + launches Electron once Vite is up
npm run package:windows # builds Windows portable .exe (run on Windows)
```

Android (requires Android Studio and SDKs on your machine):

```bash
npm run build:web
npm run cap:android:sync
npm --workspace apps/android run open # opens Android Studio project
```

### Repository structure

```
apps/
  web/       # React UI (Vite)
  desktop/   # Electron wrapper + packaging
  android/   # Capacitor project and config
```

### License

This project is licensed under the Apache License 2.0. See `LICENSE`.
