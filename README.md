# Sharecare Video-Hub

Five interactive "virtual assistant" video hubs for Sharecare. Each one is embedded in an iframe on a Sharecare page. An animated assistant (Jessica or Pam) introduces a condition, the viewer picks a topic, the assistant tees it up, and the topic video plays from a playlist.

This folder is an **npm-workspaces monorepo built with Vite**. All projects share one `node_modules`, one `shared/` folder of code, and one tracking layer that reports to **Adobe Analytics, GA4 and Matomo**. A `?debug` URL parameter shows every tracked event live.

---

## Projects

| Folder | Condition | Assistant | Topics | App code |
|---|---|---|---|---|
| `Csu/` | Chronic Spontaneous Urticaria | Jessica | 4 | shared Jessica engine |
| `Vms/` | Vasomotor Symptoms | Jessica | 4 | shared Jessica engine |
| `Type-2-Diabetes/` | Type 2 Diabetes | Jessica | 4 | shared Jessica engine |
| `Wet-Amd/` | Wet Age-related Macular Degeneration | Jessica | 4 | own fork (`src/main.js`) |
| `Pam/` | Early-stage breast cancer (patient stories) | Pam | 3 | own fork (`src/main.js`), Media player |

**Csu, Vms and Type-2-Diabetes** used to ship byte-identical copies of the same app code. That code now lives once in `shared/js/video-hub/jessicaHub.js`. Each project's `src/main.js` holds only its content data (topics, copy, video paths, timers).

**Wet-Amd and Pam** are older forks of that engine with real behavioral differences: mobile breakpoint (601 px / 450 px vs 768 px), timers, "Hide Jessica" logic, and Pam's different player. They keep their own `src/main.js` and use the same shared player, tracking and libraries.

## Folder layout

```
monoRepo/
├── package.json              workspaces + shared dependencies (one node_modules)
├── node_modules/             shared by every project
├── shared/
│   ├── css/swiper-6.0.0-bundle.css    Swiper styles the projects were built against
│   ├── js/
│   │   ├── player/
│   │   │   ├── BaymaxVideo.js         Baymax player (Csu, Vms, T2D, Wet-Amd)
│   │   │   └── BaymaxMedia.js         Baymax "Media" player (Pam)
│   │   ├── video-hub/jessicaHub.js    shared Jessica engine (Csu, Vms, T2D)
│   │   └── tracking/
│   │       ├── index.js               createTracker(): one-call setup per project
│   │       ├── Tracker.js             vendor facade
│   │       ├── events.js              event catalog + vendor mapping (source of truth)
│   │       ├── playerControls.js      click tracking for the player's own buttons
│   │       ├── adapters/              AdobeAnalyticsAdapter, GoogleAnalyticsAdapter, MatomoAdapter
│   │       └── debug/DebugPanel.js    the ?debug layer
│   ├── scripts/bump-version.mjs       prebuild patch-version bump
│   └── vite/projectConfig.js          Vite config every project uses
└── <Project>/
    ├── index.html            markup only, no vendor <script> tags
    ├── src/main.js           entry: data (+ app code for Wet-Amd/Pam)
    ├── src/css/main.css      project styles
    ├── public/assets/        images, fonts, posters, thumbnails, videos (copied as-is)
    ├── .env                  production tracking config
    ├── .env.development      dev tracking config (UAT / dev containers)
    ├── vite.config.js        one line: projectConfig(import.meta.url)
    └── package.json          scripts only; dependencies live at the root
```

Libraries come from npm and are shared: `gsap` (+ TextPlugin), `swiper` 7.4.1, `iframe-resizer` 4.3.2 (content-window script), and `vite`. They used to be concatenated into each `js/app.js` by CodeKit or loaded from CDNs.

## Getting started

```bash
npm install            # once, from monoRepo/ — installs the shared node_modules

npm run dev:csu        # also dev:vms, dev:t2d, dev:wet-amd, dev:pam
npm run build:csu      # also build:vms, build:t2d, build:wet-amd, build:pam
npm run build          # every project
```

Or from inside a project folder: `npm run dev`, `npm run build`, `npm run preview`.

| | |
|---|---|
| Dev server | `http://localhost:2001` (Vite takes the next free port if 2001 is busy) |
| Preview of the build | `http://localhost:3000` |
| Build output | `<Project>/dist/` plus `<Project>/dist.zip` (zipped by `postbuild`) |
| Version | `prebuild` bumps the patch version in the project's `package.json`. It's stamped on `#interactive-player` as `data-version` and shown in the debug panel. |

The build uses a relative base (`base: ""`), so `dist/` works from any path inside the host page's iframe. Assets in `public/` are copied untouched. Video files are ~840 MB total and are git-ignored (see `.gitignore`); `dist.zip` includes them.

**Dev vs build tracking.** `npm run dev` loads `.env.development`: Matomo **UAT** container, Adobe **development** Launch library, **no GA4**. Local clicking never lands in production reports. `npm run build` uses `.env` (production).

---

## Tracking

### Vendors and configuration

Every interaction calls `Analytics({...})` in the app code, which forwards to the shared `Tracker`. The Tracker fans the event out to three adapters, each isolated so a failing vendor can't break the app or the other vendors. Vendor scripts are injected by the adapters; nothing is hard-coded in `index.html`.

| Vendor | Loaded from | `.env` (production) | `.env.development` |
|---|---|---|---|
| **Matomo** Tag Manager | `https://$VITE_MTM_HOST/js/container_$VITE_MTM_CONTAINER.js` | `analytics.sharecare.com` / `KpatjL22` | `analytics.uat.sharecare.com` / `fJuSGoCb` |
| **Adobe** Launch (DTM) | `$VITE_ADOBE_DTM_URL` | `launch-7b16fe6219ef.min.js` (production) | `launch-17e2a4a4ea61-development.min.js` |
| **GA4** (gtag.js) | `$VITE_GA4_ID` | per project, below | empty: GA4 off |

| Project | GA4 measurement ID |
|---|---|
| Csu | `G-3J58CD3PKZ` |
| Vms | `G-XZS7C6FHD7` |
| Type-2-Diabetes | `G-RT7YJZ67KM` |
| Wet-Amd | `G-SR16HSNHEH` |
| Pam | `G-328790698` ⚠️ see [Known issues](#known-issues) |

The Matomo setup follows the AI-Assistant monorepo (`../../AI-Assistant/monoRepo/shared/modules/Tracking`): same container, same env variable names, same "don't inject a second container" guard, and the same event vocabulary (`ctaAction`, `Video_Start`, `videoPct25/50/75`, `Video_Complete`). Only part of that vocabulary has triggers in the container; see [What actually reaches Matomo](#what-actually-reaches-matomo).

### What each vendor receives

**Adobe** gets the exact payload it got before the migration, and only for the events it got before. New events are Matomo and GA4 only, so Adobe reports don't change shape.

```js
window._analytics({
  Name: "videoStart",
  videoName: "new-treatment Virtual Assistant",
  videoTopic: "Chronic-Spontaneous-Uticaria",   // allData.campaign
  videoOwner: "Sharecare Video Team - Atlanta",
  videoPlayer: "Digital Citizen",
});
```

**GA4** keeps the old shape for old events and adds a few parameters:

```js
gtag("event", "videoStart", { event_label: "<videoName>", event_category: "<campaign>" });
gtag("event", "ctaAction",  { event_label: "Pause", event_category: "<campaign>",
                              cta_detail: "video-player", video_name: "new-treatment" });
```

**Matomo** gets one data-layer push per event. Clicks become `ctaAction`; playback becomes `Video_*` / `videoPct*`:

```js
_mtm.push({ event: "ctaAction", ctaName: "Show Jessica", itemDetail: "nav",
            pageName: "sharecare.com|Video Hub VMS", siteSection: "VMS", contentType: "Video Hub" });

_mtm.push({ event: "videoPct25", videoName: "hot-flashes", videoTopic: "VMS",
            videoOwner: "Sharecare Video Team - Atlanta", videoPlayer: "Digital Citizen",
            pageName: "sharecare.com|Video Hub VMS", siteSection: "VMS", contentType: "Video Hub" });
```

`pageName` / `siteSection` / `contentType` are seeded from the project's campaign. If the parent page posts a `themeTitle` into the iframe (as a JSON string or object, as on the AI-Assistant pages), they're rebuilt from that title.

### What actually reaches Matomo

A data-layer push only becomes a Matomo hit if the Tag Manager container has a trigger for it. Both containers (production `KpatjL22`, UAT `fJuSGoCb`, checked 2026-10-03) have **Custom Event triggers only for `videoPct25`, `videoPct50` and `videoPct75`**, among our names. Everything Matomo records from these hubs today comes from:

| Source | Matomo event | What it covers |
|---|---|---|
| Container `PageView` trigger | page view | each load of the hub |
| Container `AllElementsClick` trigger | **Element Click › Click › *label*** | **every click.** The label is the control's text, or its `aria-label` when it has none (e.g. "Mute video", "Show or hide playlist", "Topic 2"). |
| Matomo **Media Analytics** (built into the container) | MediaVideo › play / pause / resume, plus `ma_*` progress | every `<video>`: assistant clips and topic videos, with seconds watched and length. Titled from `data-matomo-title`, e.g. "new-treatment" or "new-treatment Virtual Assistant". |
| Our `videoPct25/50/75` pushes | Video › videoPct25 … | topic-video milestones |
| Container `ScrollReach` triggers | Scroll › 50% / 100% | page scroll |

Three code-side changes make this work:

- **`shared/js/a11y/makeButtons.js`** gives every tracked control `role="button"`, `tabindex="0"`, Enter/Space activation, and an `aria-label` if it has no text. `AllElementsClick` matches `[role="button"]`; the playlist thumbnails, nav items, dots and player buttons were bare divs and were silently skipped before. The same fix is in AI-Assistant (`shared/js/asButton.js`).
- **`shared/css/interactive.css`** makes a button's children non-clickable (`[role="button"] > * { pointer-events: none }`), so the button itself is the clicked element; the trigger doesn't look at ancestors. It also draws the thumbnails' "NOW PLAYING" badge with CSS, so it isn't part of the click label.
- **`shared/js/tracking/mediaTitles.js`** sets `data-matomo-title` / `data-matomo-resource` on the three reused `<video>` elements whenever a new clip loads.

**Our richer pushes (`ctaAction`, `Video_Start`, `Video_Complete`, `Video_Pause`, `Video_Resume`, `Video_Mute`, `Video_Unmute`) are not reported yet.** They carry more than the generic tags: `ctaName` + `itemDetail` (where on the page), the video name with every click, and assistant-clip vs topic-video starts. To start reporting them, add one Custom Event trigger per name in Matomo Tag Manager, with a Matomo event tag reading the Data Layer Variables. The container already defines `itemDetail`, `videoName`, `videoOwner`, `siteSection` and `contentType`; `ctaName` and `videoTopic` would need adding. Nothing in the code has to change. Note that once a `ctaAction` trigger exists, each click is reported twice: as "Element Click" and as your new CTA event.

The debug panel reads the live container, so it always reflects whatever triggers exist at that moment.

### Event catalog

The source of truth is `shared/js/tracking/events.js`. **Rule:** any event carrying a `cta` (a clicked control) is sent to Matomo as `ctaAction`; Adobe keeps its historical event name for it.

| Event (`name`) | Fired when | Adobe | Matomo `event` | GA4 |
|---|---|---|---|---|
| `intro-click` | Desktop start button (Meet Jessica / Meet Pam) | ✓ | `ctaAction` | ✓ |
| `videoStart` | An assistant clip starts for a topic, or a topic video starts | ✓ | `Video_Start` † | ✓ |
| `videoQuartile25` | Topic video reaches 25% | – | `videoPct25` | ✓ |
| `videoHalfway` | Topic video reaches 50% | ✓ | `videoPct50` | ✓ |
| `videoQuartile75` | Topic video reaches 75% | – | `videoPct75` | ✓ |
| `videoComplete` | Topic video reaches 90% / ends, or the playlist finishes | ✓ | `Video_Complete` † | ✓ |
| `videoPause` | Topic video paused | ✓ | `Video_Pause` † | ✓ |
| `videoResume` | Topic video resumed | ✓ | `Video_Resume` † | ✓ |
| `videoMute` / `videoUnMute` | Mute / unmute on the topic video player | ✓ | `Video_Mute` / `Video_Unmute` † | ✓ |
| `videoPause` + cta | **Pause Jessica/Pam** button | ✓ | `ctaAction` | ✓ |
| `videoResume` + cta | **Resume** button | ✓ | `ctaAction` | ✓ |
| `videoHide` | **Hide Jessica/Pam** | ✓ | `ctaAction` | ✓ |
| `videoShow` | **Show Jessica/Pam** | ✓ | `ctaAction` | ✓ |
| `videoSkip` | **Skip intro** (mobile) | ✓ | `ctaAction` | ✓ |
| `videoStart` + cta | **Back to Topics** on mobile (legacy "Menu Page") | ✓ | `ctaAction` | ✓ |
| `ctaAction` | Every other click (next table) | – | `ctaAction` | ✓ |

† No trigger exists for these names in the MTM container yet, and none for `ctaAction` either. They reach the data layer but report nothing until a Custom Event trigger is added (see [What actually reaches Matomo](#what-actually-reaches-matomo)). Clicks and video plays still reach Matomo through the container's own click and media tracking. The debug panel marks each unreported push.

### Every tracked click

| Control | `ctaName` | `itemDetail` |
|---|---|---|
| Start screen button (desktop + mobile) | "Meet Jessica" / "Meet Pam" | `intro` |
| Skip intro (mobile) | "Skip intro" | `intro` |
| Topic menu buttons (assistant's speech-bubble menu) | topic name | `topic-menu` |
| Playlist thumbnails (desktop) / slides (mobile) | topic name | `playlist` |
| Playlist arrows (mobile) | "Next" / "Previous" | `playlist` |
| Playlist show/hide toggle | "Show Playlist" / "Hide Playlist" | `playlist` |
| Playlist dots (mobile) | "Dot 1" … "Dot 4" | `playlist-dots` |
| End-screen topic buttons | topic name | `end-screen` |
| Back to Topics List / Back to Patient Stories | button text | `nav` |
| Pause Jessica/Pam, Resume, Hide, Show | button text | `nav` |
| Player Play / Pause / Mute / Unmute | "Play" / "Pause" / "Mute" / "Unmute" (+ `videoName`) | `video-player` |

Topic names come from each project's `trackingmap`, the same values Adobe has always received as `videoName`.

### Debug layer (`?debug`)

Add `debug` to the URL to open the tracking panel:

```
http://localhost:2001/?debug
https://<host>/<path>/index.html?debug          # also ?debug=1, ?debug=true
```

When the hub is embedded, put the parameter on the **iframe's `src`**. `?debug=0`, `false` or `off` leave it off. With no parameter, nothing is added to the page.

The panel shows:

- **Setup** (collapsed; the summary line shows each vendor's state at a glance). Expand it for:
  - each vendor's state (`loading` / `ready` / `disabled` / `error`) and exactly what it loaded (DTM URL, GA4 ID, MTM container URL);
  - for Matomo, the **events the loaded container has triggers for**;
  - the context sent with events (`pageName`, `siteSection`, `contentType`, `videoTopic`, …), live, so you can see a parent-page `themeTitle` take effect.
- **Events** tab: what our code tracked, newest first, with a badge per vendor:
  - `✓` sent (for Matomo: a container trigger fires for it)
  - `⚠ not reported` (Matomo only): pushed, but the container has no trigger for it
  - `…` queued (vendor still loading; replayed once it's ready)
  - `–` skipped (not that vendor's event, e.g. new events for Adobe, or GA4 in dev)
  - `✕` error (vendor failed to load)

  Click a row to see the event's description, each vendor's exact payload, and the reason for any status. Event names missing from `events.js` show in red.
- **Hits sent** tab: **what the vendors' libraries actually sent over the network**, decoded. This covers Matomo `matomo.php` page views, Element Clicks, Media Analytics and scroll; Adobe `b/ss` beacons; and GA4 `g/collect`. This is the ground truth for "did Matomo get it?". Click a row for every parameter.

Buttons:

| Button | Action |
|---|---|
| **Highlight** | Outlines every tracked control on the page, so you can spot anything that isn't covered |
| **Copy** | Copies events and hits as JSON |
| **Clear** | Empties both lists |
| **⇅** | Moves the panel to the next corner. It sits above the app, so move it off anything you need to click. |
| **–** / **+** | Collapses to a counter. Starts collapsed on phone-width screens so it doesn't cover the playlist. |

Debug mode also logs one collapsed console group per event (`<> :: tracking :: #n name`). In any mode, `window.VideoHubTracking` exposes the tracker: `.log`, `.vendorStatus()`, `.track({...})`.

**QA tip:** in `npm run dev`, events go to the Matomo **UAT** container and the Adobe **development** library. Matomo's own Tag Manager debug mode (`?mtmPreviewMode=<container>` from the MTM UI) can be used alongside `?debug` to confirm triggers fire.

---

## Working on the projects

**Change copy, topics or videos.** For Csu/Vms/T2D, edit the data in `<Project>/src/main.js` and put files in `public/assets/`. For Wet-Amd/Pam, the data is the `window.allData` object near the top of their `src/main.js`.

**Change app behavior for Csu/Vms/T2D.** Edit `shared/js/video-hub/jessicaHub.js` once and all three change. Check each in the browser.

**Add tracking for a new interaction:**

1. Call `Analytics({ "name": "ctaAction", "cta": "<label>", "detail": "<where>" })` in the click handler.
2. If it's a new event *name*, add it to `shared/js/tracking/events.js` with its `adobe` / `matomo` mapping, and add it to the tables above.
3. Run with `?debug`, click it, and check the badges and payloads.

**Add a project:**

1. Copy one of the Jessica projects.
2. Rename it in `package.json` and add it to the root `workspaces` and scripts.
3. Replace `public/assets/` and the data in `src/main.js`, and set `VITE_GA4_ID` in `.env`.

---

## What changed in the Vite migration (2026-10-03)

The original folders are archived, without videos, at `../_archive/monoRepo-pre-vite-2026-10-03.tar.gz`.

- **Build:** CodeKit-concatenated `js/app.js` files and CDN `<script>` tags replaced by Vite + npm workspaces. Libraries are de-duplicated into the root `node_modules` and `shared/`.
- **Tracking:**
  - Adobe DTM and GA4 moved out of `index.html` into adapters driven by `.env`. Dev builds now use the Adobe development library and no GA4.
  - Matomo added.
  - Clicks that weren't tracked before are now tracked (see the click table): topic menu, thumbnails, slides, arrows, dots, playlist toggle, end screen, back-to-topics on desktop, the player's own buttons, and the mobile start button.
  - 25% and 75% milestones added.
- **Fixes to existing behavior:**
  - **Thumbnails:** clicking a thumbnail's *text* did nothing, because the handler read `event.target` and the label covers the thumbnail. Thumbnail, menu and end-screen handlers now use `event.currentTarget`.
  - **Skip intro (mobile):** threw during the intro itself (it looked up a thumbnail for "intro"), so Skip only worked during topic clips. Guarded.
  - **Intro text:** when it finished (~15 s after start), it reset the app to the topics screen even if a topic was already playing, and blanked `videoName` on later events. It now only does that if the user is still on the intro.
  - **Progress milestones:** these only re-armed when a video *ended*, so switching topics mid-video skipped milestones on the next video. They now re-arm on every new video, in both players.
  - **Mobile assistant clips:** strict-mode/module fixes (e.g. the mobile assistant player was looked up as a `window` property that only existed in non-module scripts).
- **Pam's `demo-publisher-page.html`**, a local page that embeds `index.html` in an iframe to test the embed, moved to `Pam/public/` and is served at `/demo-publisher-page.html`. Its polyfill.io `<script>` was removed: that domain was taken over and served malware in 2024.
- **Shared Jessica engine:** Csu/Vms/T2D now run one copy of the app. The only per-project logic difference, the desktop idle timer, is data (`timers["desktop-idle"]`). Original values are kept: 42 s, 51 s and 40 s.

## Known issues

- **Pam's GA4 ID `G-328790698`** has the old numeric format, unlike the other projects' `G-XXXXXXXXXX` IDs, and may not be a valid GA4 measurement ID. It's carried over unchanged. Confirm or replace it in `Pam/.env`.
- **Pam's `trackingmap` names are MS topics** ("The importance of early treatment for MS", …), left over from another project. Adobe and Matomo receive these as `videoName` for Sabrina's, Renee's and Staci's stories. They're unchanged to keep reporting continuous; fix in `Pam/src/main.js` if the reports should show the story names.
- **`ctaAction`, `Video_Start`, `Video_Complete`, `Video_Pause`, `Video_Resume`, `Video_Mute`, `Video_Unmute`** need Custom Event triggers in the Matomo container before they report. Until then Matomo gets clicks as "Element Click" and videos through Media Analytics; see [What actually reaches Matomo](#what-actually-reaches-matomo).
- In Matomo Media Analytics, the assistant intro clip shows the page URL as its file. Matomo registers the `<video>` before it has a source; the title is still correct.
- **Matomo container choice:** the projects use the same container as AI-Assistant (`KpatjL22` / UAT `fJuSGoCb`). If Video-Hub should report into a separate Matomo site, change `VITE_MTM_CONTAINER` in each `.env`.
- **Swiper 7.4.1** (the version the projects always shipped) has a prototype-pollution advisory (GHSA-hmx5-qpq5-p643). Exploiting it requires attacker-controlled Swiper options; ours are static. The fix is Swiper 12+, a breaking upgrade that needs a visual check of the mobile playlist.
- `main.css` in every project references `thumb-*.jpg` files that don't exist. This predates the migration and is harmless; Vite prints a warning during build.
