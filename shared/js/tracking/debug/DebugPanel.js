import { EVENTS } from "../events";

/**
 * Tracking debug layer, enabled with a `debug` URL parameter:
 *
 *     index.html?debug        index.html?debug=1        index.html?debug=true
 *
 * (`?debug=0`, `?debug=false` and `?debug=off` leave it off.) When the app is
 * embedded, put the parameter on the iframe's src.
 *
 * Shows, live:
 *   - each vendor's state (loading / ready / disabled / error) and what it
 *     loaded (DTM URL, GA4 ID, MTM container URL). For Matomo, also the
 *     events the loaded container actually has triggers for;
 *   - the static data Matomo events carry (pageName / siteSection / contentType);
 *   - Events tab: every tracked event, newest first, with what each vendor did
 *     with it (sent / queued / skipped / unreported / error) and the exact
 *     payload. Click a row to expand it;
 *   - Hits tab: the requests the vendors' own libraries really sent
 *     (Matomo matomo.php, Adobe b/ss, GA4 g/collect), decoded. This is the
 *     ground truth: a Matomo page view, "Element Click" or video event appears
 *     here only if Matomo was actually told about it.
 *
 * Buttons: Highlight outlines every tracked control on the page; Copy puts the
 * full log (events + hits) on the clipboard as JSON; Clear empties both lists;
 * ⇅ moves the panel to the next corner (it sits above the app, so move it off
 * whatever you need to click); "–" collapses it to a counter (the default on
 * phone-width screens, where it would otherwise cover the playlist).
 *
 * The panel lives in a shadow root so the projects' global CSS cannot restyle
 * it, and it never stops a click reaching the app.
 */

const OFF_VALUES = ["0", "false", "off", "no"];

// Injected by shared/vite/projectConfig.js from the project's package.json.
const APP_VERSION = typeof __APP_VERSION__ !== "undefined" ? __APP_VERSION__ : "?";

export function isDebugEnabled(search = window.location.search) {
    const params = new URLSearchParams(search);
    if (!params.has("debug")) return false;
    return !OFF_VALUES.includes(String(params.get("debug")).toLowerCase());
}

// Every element with a tracked click handler, across both players.
const DEFAULT_HIGHLIGHT = [
    ".startpage",
    "#skip-intro",
    ".btn-style",
    ".end-btn-style",
    ".thumb",
    ".nav-items",
    ".show-hide-btn",
    ".dot-style",
    ".swiper-button-next",
    ".swiper-button-prev",
    "#video-play-button", "#video-pause-button", "#video-mute-button", "#video-unmute-button",
    "#media-play-button", "#media-pause-button", "#media-mute-button", "#media-unmute-button",
    ".poster-frame-playBtn",
];

const STATUS_GLYPH = { sent: "✓", queued: "…", skipped: "–", unreported: "⚠ not reported", error: "✕" };
const VENDOR_LABEL = { adobe: "Adobe", ga4: "GA4", matomo: "Matomo" };

const PANEL_CSS = `
:host { all: initial; }
* { box-sizing: border-box; }
.panel {
  position: fixed; right: 12px; bottom: 12px; z-index: 2147483647;
  width: min(400px, calc(100vw - 24px)); max-height: min(55vh, 480px);
  display: flex; flex-direction: column;
  background: rgba(17, 20, 28, 0.96); color: #e6e9ef;
  border: 1px solid #3a4152; border-radius: 10px;
  box-shadow: 0 8px 28px rgba(0,0,0,.45);
  font: 12px/1.4 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
}
.panel.min { width: auto; max-height: none; }
.panel.top { bottom: auto; top: 12px; }
.panel.left { right: auto; left: 12px; }
.panel.min .body { display: none; }
header {
  display: flex; align-items: center; gap: 6px;
  padding: 8px 10px; border-bottom: 1px solid #2c3242; cursor: default;
}
.panel.min header { border-bottom: 0; }
.title { font-weight: 700; flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.count { background: #ff3e9a; color: #fff; border-radius: 9px; padding: 0 7px; font-weight: 700; }
button {
  font: inherit; color: #e6e9ef; background: #262c3a; border: 1px solid #3a4152;
  border-radius: 6px; padding: 2px 8px; cursor: pointer;
}
button:hover { background: #313949; }
button[aria-pressed="true"] { background: #ff3e9a; border-color: #ff3e9a; color: #fff; }
.body { display: flex; flex-direction: column; min-height: 0; }
.section { padding: 6px 10px; border-bottom: 1px solid #2c3242; }
.label { color: #8b93a7; text-transform: uppercase; font-size: 10px; letter-spacing: .06em; margin-bottom: 3px; }
.vendor { display: grid; grid-template-columns: 62px 70px 1fr; gap: 6px; align-items: baseline; }
.vendor .detail { color: #8b93a7; word-break: break-all; }
.state { font-weight: 700; }
.state.ready { color: #4ade80; } .state.loading { color: #facc15; }
.state.disabled { color: #8b93a7; } .state.error { color: #f87171; }
.kv { color: #c3c9d6; word-break: break-word; }
.kv b { color: #8b93a7; font-weight: 400; }
.log { overflow-y: auto; min-height: 140px; flex: 1; }
details.setup { border-bottom: 1px solid #2c3242; flex: none; }
details.setup[open] { max-height: 38vh; overflow-y: auto; }
details.setup summary { cursor: pointer; padding: 6px 10px; color: #c3c9d6; list-style: none; }
details.setup summary::-webkit-details-marker { display: none; }
details.setup summary::before { content: "▸ "; color: #8b93a7; }
details.setup[open] summary::before { content: "▾ "; }
.chip { margin-right: 8px; }
.chip.ready { color: #4ade80; } .chip.loading { color: #facc15; }
.chip.disabled { color: #8b93a7; } .chip.error { color: #f87171; }
.empty { padding: 14px 10px; color: #8b93a7; }
.row { padding: 6px 10px; border-bottom: 1px solid #222837; cursor: pointer; }
.row:hover { background: #1c2230; }
.row.flash { animation: flash 1.2s ease-out; }
@keyframes flash { from { background: rgba(255,62,154,.35); } to { background: transparent; } }
.line { display: flex; gap: 6px; align-items: baseline; }
.id { color: #8b93a7; } .time { color: #8b93a7; }
.name { font-weight: 700; color: #7dd3fc; }
.name.unknown { color: #f87171; }
.what { color: #e6e9ef; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1; }
.badges { display: flex; gap: 4px; margin-top: 3px; flex-wrap: wrap; }
.badge { border-radius: 4px; padding: 0 5px; font-size: 11px; border: 1px solid transparent; }
.badge.sent { background: rgba(74,222,128,.15); color: #4ade80; border-color: rgba(74,222,128,.35); }
.badge.queued { background: rgba(250,204,21,.12); color: #facc15; border-color: rgba(250,204,21,.35); }
.badge.skipped { background: rgba(139,147,167,.12); color: #8b93a7; border-color: rgba(139,147,167,.3); }
.badge.error { background: rgba(248,113,113,.15); color: #f87171; border-color: rgba(248,113,113,.4); }
.badge.warn { background: rgba(248,113,113,.15); color: #f87171; }
.badge.unreported { background: rgba(251,146,60,.15); color: #fb923c; border-color: rgba(251,146,60,.4); }
.vendor .extra { grid-column: 2 / -1; color: #8b93a7; font-size: 11px; word-break: break-word; }
.tabs { display: flex; gap: 4px; padding: 6px 10px 0; border-bottom: 1px solid #2c3242; }
.tabs button { border-bottom-left-radius: 0; border-bottom-right-radius: 0; border-bottom: 0; }
.tabs button[aria-selected="true"] { background: #3a4152; color: #fff; }
.hit-vendor { font-weight: 700; }
.hit-vendor.matomo { color: #fb923c; } .hit-vendor.adobe { color: #f87171; } .hit-vendor.ga4 { color: #facc15; }
.hit-type { color: #8b93a7; }
.details { display: none; margin-top: 6px; }
.row.open .details { display: block; }
.details .v { color: #8b93a7; margin-top: 4px; }
.details .note { color: #facc15; }
pre { margin: 2px 0 0; padding: 6px; background: #0c0f15; border-radius: 6px; white-space: pre-wrap; word-break: break-all; color: #c3c9d6; }
`;

const HIGHLIGHT_CSS = (selectors) => `
html.vh-debug-highlight :is(${selectors.join(", ")}) {
  outline: 2px dashed #ff3e9a !important; outline-offset: -2px !important;
}`;

function el(tag, attrs = {}, children = []) {
    const node = document.createElement(tag);
    Object.entries(attrs).forEach(([key, value]) => {
        if (key === "class") node.className = value;
        else if (key === "text") node.textContent = value;
        else node.setAttribute(key, value);
    });
    [].concat(children).forEach((child) => child && node.appendChild(child));
    return node;
}

function time(date) {
    return date.toTimeString().slice(0, 8);
}

export function mountDebugPanel(tracker, { project = "", highlight = DEFAULT_HIGHLIGHT } = {}) {
    const start = () => buildPanel(tracker, project, highlight);
    if (document.body) start();
    else document.addEventListener("DOMContentLoaded", start);
}

function buildPanel(tracker, project, highlight) {
    const host = el("div", { id: "vh-tracking-debug" });
    const root = host.attachShadow({ mode: "open" });
    root.appendChild(el("style", { text: PANEL_CSS }));

    const highlightStyle = el("style", { text: HIGHLIGHT_CSS(highlight) });
    document.head.appendChild(highlightStyle);

    const count = el("span", { class: "count", text: "0" });
    const btnHighlight = el("button", { type: "button", "aria-pressed": "false", text: "Highlight" });
    const btnCopy = el("button", { type: "button", text: "Copy" });
    const btnClear = el("button", { type: "button", text: "Clear" });
    const btnDock = el("button", { type: "button", "aria-label": "Move panel to the next corner", title: "Move panel to the next corner", text: "⇅" });
    const btnMin = el("button", { type: "button", "aria-label": "Collapse", text: "–" });

    const vendors = el("div", { class: "section" });
    const statics = el("div", { class: "section" });
    // Vendors + context are reference info; collapsed by default so the event
    // and hit lists keep the panel's height. The summary line shows each
    // vendor's state at a glance.
    const setupSummary = el("summary", { text: "Setup" });
    const setup = el("details", { class: "setup" }, [setupSummary, vendors, statics]);
    const log = el("div", { class: "log" });
    const empty = el("div", { class: "empty", text: "No events yet — interact with the page." });
    log.appendChild(empty);

    const hitsLog = el("div", { class: "log", hidden: "" });
    const hitsEmpty = el("div", { class: "empty", text: "No requests seen yet. Page views and clicks the vendors report show up here." });
    hitsLog.appendChild(hitsEmpty);

    const tabEvents = el("button", { type: "button", role: "tab", "aria-selected": "true", text: "Events (0)" });
    const tabHits = el("button", { type: "button", role: "tab", "aria-selected": "false", text: "Hits sent (0)" });
    const tabs = el("div", { class: "tabs", role: "tablist" }, [tabEvents, tabHits]);

    const panel = el("div", { class: "panel" }, [
        el("header", {}, [
            el("span", { class: "title", text: `${project} v${APP_VERSION}`, title: `Tracking debug · ${project} v${APP_VERSION} (${import.meta.env.MODE} build)` }),
            count, btnHighlight, btnCopy, btnClear, btnDock, btnMin,
        ]),
        el("div", { class: "body" }, [setup, tabs, log, hitsLog]),
    ]);
    root.appendChild(panel);
    document.body.appendChild(host);

    // On phone-sized screens the open panel would cover the playlist, so it
    // starts collapsed to its counter; tap "+" to open it.
    if (window.innerWidth < 600) setCollapsed(true);

    // ---- vendors + static data, refreshed while loading settles ----
    const renderStatus = () => {
        setupSummary.replaceChildren(
            ...tracker.vendorStatus().map(({ name, state }) =>
                el("span", { class: `chip ${state}`, text: `${VENDOR_LABEL[name] || name} ${state === "ready" ? "✓" : state}` })),
            el("span", { class: "chip disabled", text: `· ${import.meta.env.MODE}` }),
        );
        vendors.replaceChildren(el("div", { class: "label", text: `Vendors · ${import.meta.env.MODE} build` }));
        tracker.vendorStatus().forEach(({ name, state, detail, pending, extra }) => {
            vendors.appendChild(el("div", { class: "vendor" }, [
                el("span", { text: VENDOR_LABEL[name] || name }),
                el("span", { class: `state ${state}`, text: state + (pending ? ` (${pending})` : "") }),
                el("span", { class: "detail", text: detail || "" }),
                extra ? el("span", { class: "extra", text: extra }) : null,
            ]));
        });

        statics.replaceChildren(el("div", { class: "label", text: "Context sent with events" }));
        const context = { ...tracker.static, ...tracker.context };
        Object.entries(context).forEach(([key, value]) => {
            const line = el("div", { class: "kv" });
            line.append(el("b", { text: `${key}: ` }), document.createTextNode(String(value)));
            statics.appendChild(line);
        });
    };
    renderStatus();
    setInterval(renderStatus, 1000);

    // ---- events ----
    const renderRecord = ({ event, results }) => {
        empty.remove();

        const what = [event.cta, event.item].filter(Boolean).join(" · ");
        const name = el("span", { class: `name${event.known ? "" : " unknown"}`, text: event.name });
        const badges = el("div", { class: "badges" });
        if (!event.known) badges.appendChild(el("span", { class: "badge warn", text: "not in events.js" }));

        const details = el("div", { class: "details" });
        const def = EVENTS[event.name];
        if (def) details.appendChild(el("div", { class: "v", text: def.description }));

        Object.entries(results).forEach(([vendor, result]) => {
            const label = VENDOR_LABEL[vendor] || vendor;
            badges.appendChild(el("span", {
                class: `badge ${result.status}`,
                title: result.note || result.status,
                text: `${label} ${STATUS_GLYPH[result.status] || result.status}`,
            }));

            details.appendChild(el("div", { class: "v", text: `${label}: ${result.status}` }));
            if (result.note) details.appendChild(el("div", { class: "note", text: result.note }));
            if (result.payload) details.appendChild(el("pre", { text: JSON.stringify(result.payload, null, 2) }));
        });

        const row = el("div", { class: "row flash" }, [
            el("div", { class: "line" }, [
                el("span", { class: "id", text: `#${event.id}` }),
                el("span", { class: "time", text: time(event.time) }),
                name,
                el("span", { class: "what", text: what, title: what }),
            ]),
            badges,
            details,
        ]);
        row.addEventListener("click", () => row.classList.toggle("open"));
        log.prepend(row);
        updateCounts();
    };

    tracker.log.forEach(renderRecord);
    tracker.onTrack(renderRecord);

    // ---- hits: what the vendors' libraries actually sent ----
    const renderHit = (hit) => {
        hitsEmpty.remove();
        const label = VENDOR_LABEL[hit.vendor] || hit.vendor;
        const row = el("div", { class: "row flash" }, [
            el("div", { class: "line" }, [
                el("span", { class: "time", text: time(hit.time) }),
                el("span", { class: `hit-vendor ${hit.vendor}`, text: label }),
                el("span", { class: "hit-type", text: hit.type }),
                el("span", { class: "what", text: hit.summary, title: hit.summary }),
            ]),
            el("div", { class: "details" }, [
                el("div", { class: "v", text: `via ${hit.via} → ${hit.url.split("?")[0]}` }),
                el("pre", { text: JSON.stringify(hit.params, null, 2) }),
            ]),
        ]);
        row.addEventListener("click", () => row.classList.toggle("open"));
        hitsLog.prepend(row);
        updateCounts();
    };

    tracker.hits.forEach(renderHit);
    tracker.onHit(renderHit);

    function updateCounts() {
        count.textContent = String(tracker.log.length);
        tabEvents.textContent = `Events (${tracker.log.length})`;
        tabHits.textContent = `Hits sent (${tracker.hits.length})`;
    }

    function showTab(hits) {
        tabEvents.setAttribute("aria-selected", String(!hits));
        tabHits.setAttribute("aria-selected", String(hits));
        log.hidden = hits;
        hitsLog.hidden = !hits;
    }
    tabEvents.addEventListener("click", () => showTab(false));
    tabHits.addEventListener("click", () => showTab(true));

    // ---- controls ----
    btnHighlight.addEventListener("click", () => {
        const on = document.documentElement.classList.toggle("vh-debug-highlight");
        btnHighlight.setAttribute("aria-pressed", String(on));
    });

    btnCopy.addEventListener("click", async () => {
        const json = JSON.stringify({ events: tracker.log, hits: tracker.hits }, null, 2);
        try {
            await navigator.clipboard.writeText(json);
            btnCopy.textContent = "Copied";
        } catch (error) {
            console.log(json);
            btnCopy.textContent = "In console";
        }
        setTimeout(() => { btnCopy.textContent = "Copy"; }, 1500);
    });

    btnClear.addEventListener("click", () => {
        tracker.log.length = 0;
        tracker.hits.length = 0;
        log.replaceChildren(empty);
        hitsLog.replaceChildren(hitsEmpty);
        updateCounts();
    });

    function setCollapsed(min) {
        panel.classList.toggle("min", min);
        btnMin.textContent = min ? "+" : "–";
        btnMin.setAttribute("aria-label", min ? "Expand" : "Collapse");
        [btnHighlight, btnCopy, btnClear, btnDock].forEach((button) => { button.hidden = min; });
    }

    btnMin.addEventListener("click", () => setCollapsed(!panel.classList.contains("min")));

    // bottom-right -> top-right -> top-left -> bottom-left -> ...
    const CORNERS = [[], ["top"], ["top", "left"], ["left"]];
    let corner = 0;
    btnDock.addEventListener("click", () => {
        corner = (corner + 1) % CORNERS.length;
        panel.classList.remove("top", "left");
        panel.classList.add(...CORNERS[corner]);
    });
}
