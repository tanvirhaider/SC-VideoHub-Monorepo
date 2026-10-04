import { EVENTS } from "../events";
import { loadScript } from "../loadScript";

/**
 * Pushes events onto the Matomo Tag Manager data layer (`window._mtm`).
 * Modeled on AI-Assistant's shared/modules/Tracking/adapters/MatomoAdapter.js:
 * same container injection, same env vars, same trigger vocabulary.
 *
 * CONTAINER
 * Built from Vite env vars at build time:
 *
 *     VITE_MTM_HOST=analytics.sharecare.com
 *     VITE_MTM_CONTAINER=KpatjL22
 *
 * `.env` holds production; `.env.development` points `npm run dev` at the UAT
 * container so local clicks never land in the production Matomo site.
 * Injection is skipped when a container is already on the page, since a second
 * container double-counts every hit.
 *
 * PAYLOADS
 * Clicks (any event carrying `cta`, or mapped to ctaAction in events.js):
 *     { event: "ctaAction", ctaName, itemDetail, [videoName],
 *       pageName, siteSection, contentType }
 *
 * Video events:
 *     { event: "Video_Start", videoName, videoTopic, videoOwner, videoPlayer,
 *       pageName, siteSection, contentType }
 *
 * Event names come from the `matomo` column of events.js.
 *
 * WHAT ACTUALLY REPORTS
 * A push only becomes a Matomo hit if the container has a Custom Event
 * trigger with that exact name. As of 2026-10 both containers (production
 * KpatjL22, UAT fJuSGoCb) have custom triggers only for videoPct25/50/75 (plus
 * other products' events). So ctaAction, Video_Start, Video_Complete, … are
 * pushed but not reported until triggers are added in Matomo Tag Manager.
 * Clicks still reach Matomo through the container's generic AllElementsClick
 * trigger ("Element Click"), because shared/js/a11y/makeButtons.js gives every
 * control role="button".
 *
 * Once the container has loaded, this adapter reads its trigger list and
 * reports each push as "sent" (a trigger matches) or "unreported" (none does),
 * so the ?debug panel shows what Matomo really receives.
 * pageName/siteSection/contentType are static data. They are seeded from the
 * project config and replaced when the parent page posts a themeTitle (see
 * tracking/index.js); a value on the event itself always wins over static.
 */

// Module-level, not per-instance: two trackers on one page must not each
// inject a container.
let containerRequested = false;

function resolveContainerUrl(config) {
    if (config.containerUrl) return config.containerUrl;

    const env = import.meta.env || {};
    const host = config.mtmHost || env.VITE_MTM_HOST;
    const container = config.mtmContainer || env.VITE_MTM_CONTAINER;

    if (!host || !container) return "";

    return `https://${host}/js/container_${container}.js`;
}

/**
 * Custom Event names the loaded container(s) listen for, plus the built-in
 * trigger types. Null until a container has initialised.
 */
function containerTriggers() {
    const mtm = window.MatomoTagManager;
    if (!mtm || !mtm.containers) return null;

    const custom = new Set();
    const builtin = new Set();
    Object.values(mtm.containers).forEach((container) => {
        (container.triggers || []).forEach((trigger) => {
            if (trigger.type === "CustomEvent") custom.add(trigger.parameters?.eventName);
            else builtin.add(trigger.type);
        });
    });
    return { custom, builtin };
}

function containerOnPage() {
    return document.querySelector('script[src*="/js/container_"]') !== null;
}

/** Drop empty fields so the data layer only carries real values. */
function compact(object) {
    return Object.fromEntries(
        Object.entries(object).filter(([, value]) => value !== undefined && value !== null && value !== "")
    );
}

export default class MatomoAdapter {

    constructor(config = {}) {
        this.name = "matomo";
        this.context = config.context || {};
        this.STATIC = config.static || {};
        this.url = resolveContainerUrl(config);
        this.state = "loading";
        this.detail = this.url;

        // The container creates window._mtm when it loads; creating it first
        // means events fired before then are replayed once it does.
        window._mtm = window._mtm || [];

        if (!this.url) {
            this.state = "disabled";
            this.detail = "VITE_MTM_HOST / VITE_MTM_CONTAINER not set";
            console.warn(
                "MatomoAdapter: no container configured (set VITE_MTM_HOST and "
                + "VITE_MTM_CONTAINER in .env). Events will queue on window._mtm "
                + "but no request will be sent."
            );
            return;
        }

        if (containerRequested || containerOnPage()) {
            this.state = "ready";
            this.detail = `${this.url} (already on page)`;
            return;
        }

        containerRequested = true;

        if (!window._mtm.some((entry) => entry && entry["mtm.startTime"])) {
            window._mtm.push({ "mtm.startTime": Date.now(), event: "mtm.Start" });
        }

        loadScript(this.url)
            .then(() => { this.state = "ready"; })
            .catch((error) => {
                containerRequested = false;
                this.state = "error";
                this.detail = error.message;
                console.warn("Matomo container failed to load:", this.url);
            });
    }

    toPayload(event) {
        const isClick = event.cta || EVENTS[event.name]?.matomo === "ctaAction";

        if (isClick) {
            return compact({
                ...this.STATIC,
                event: "ctaAction",
                ctaName: event.cta ?? event.item,
                itemDetail: event.detail,
                // The video on screen when a generic click happened (e.g. the
                // player's Pause button), so clicks can be tied to content.
                videoName: event.name === "ctaAction" ? event.item : undefined,
            });
        }

        return compact({
            ...this.STATIC,
            event: EVENTS[event.name]?.matomo || event.name,
            videoName: event.item,
            videoTopic: this.context.videoTopic,
            videoOwner: this.context.videoOwner,
            videoPlayer: this.context.videoPlayer,
        });
    }

    track(event) {
        const payload = this.toPayload(event);
        window._mtm.push(payload);

        if (this.state === "error" || this.state === "disabled") {
            return { status: "error", payload, note: `not sent: ${this.detail}` };
        }

        const triggers = containerTriggers();
        if (!triggers) {
            return { status: "queued", payload, note: "container still loading" };
        }

        if (!triggers.custom.has(payload.event)) {
            const click = payload.event === "ctaAction"
                ? " The click itself is reported separately by the container's AllElementsClick trigger as \"Element Click\" (see the Hits tab)."
                : "";
            return {
                status: "unreported",
                payload,
                note: `Pushed to _mtm, but the container has no "${payload.event}" trigger, so Matomo receives nothing for this push.${click}`,
            };
        }

        return { status: "sent", payload, note: `container trigger "${payload.event}" fires` };
    }

    addStaticData(data) {
        this.STATIC = { ...this.STATIC, ...data };
    }

    status() {
        const triggers = containerTriggers();
        const extra = triggers
            ? `listens for: ${[...triggers.custom].join(", ") || "(no custom events)"} · built-in: ${[...triggers.builtin].join(", ")}`
            : undefined;
        return { state: this.state, detail: this.detail, extra };
    }

}
