import { EVENTS } from "../events";
import { loadScript, scriptOnPage } from "../loadScript";

/**
 * Sends Video-Hub events to Adobe through `window._analytics`, which the
 * Adobe Launch (DTM) library defines.
 *
 * The payload is the exact shape every Video-Hub project sent before the Vite
 * migration, so existing Adobe reports are unaffected:
 *
 *     window._analytics({
 *         Name: "videoStart",
 *         videoName: "<item>",
 *         videoTopic: "<campaign>",
 *         videoOwner: "Sharecare Video Team - Atlanta",
 *         videoPlayer: "Digital Citizen",
 *     });
 *
 * Only events flagged `adobe: true` in events.js are sent — the events added
 * for Matomo coverage would otherwise appear in Adobe as new, unplanned names.
 *
 * DTM used to be a hard-coded production <script> in each index.html. It is now
 * injected from VITE_ADOBE_DTM_URL, so `npm run dev` loads the development
 * Launch library (.env.development) and builds load production (.env).
 *
 * Events fired before `_analytics` exists are queued and replayed once it
 * does, instead of being dropped with a console error as before.
 */

const POLL_INTERVAL = 500;
const POLL_LIMIT = 40; // 20 s after the library loads

export default class AdobeAnalyticsAdapter {

    constructor(config = {}) {
        this.name = "adobe";
        this.context = config.context || {};
        this.pending = [];
        this.url = config.dtmUrl || import.meta.env.VITE_ADOBE_DTM_URL || "";
        this.state = "loading";
        this.detail = this.url;

        if (!this.url) {
            this.state = "disabled";
            this.detail = "VITE_ADOBE_DTM_URL not set";
            console.warn("AdobeAnalyticsAdapter: no DTM URL configured; Adobe events will queue but never send.");
            return;
        }

        if (scriptOnPage("assets.adobedtm.com")) {
            this.waitForAnalytics();
            return;
        }

        loadScript(this.url)
            .then(() => this.waitForAnalytics())
            .catch((error) => {
                this.state = "error";
                this.detail = error.message;
                console.warn("AdobeAnalyticsAdapter:", error.message);
            });
    }

    waitForAnalytics() {
        let tries = 0;
        const check = () => {
            if (typeof window._analytics === "function") {
                this.state = "ready";
                this.flush();
                return;
            }
            if (++tries >= POLL_LIMIT) {
                this.state = "error";
                this.detail = "DTM loaded but window._analytics never appeared";
                return;
            }
            setTimeout(check, POLL_INTERVAL);
        };
        check();
    }

    flush() {
        while (this.pending.length) {
            window._analytics(this.pending.shift());
        }
    }

    toPayload(event) {
        return {
            Name: event.name,
            videoName: event.item,
            videoTopic: this.context.videoTopic,
            videoOwner: this.context.videoOwner,
            videoPlayer: this.context.videoPlayer,
        };
    }

    track(event) {
        if (!EVENTS[event.name]?.adobe) {
            return { status: "skipped", note: "not an Adobe event (Matomo/GA4 only)" };
        }

        const payload = this.toPayload(event);

        if (typeof window._analytics === "function") {
            window._analytics(payload);
            return { status: "sent", payload };
        }

        this.pending.push(payload);
        if (this.state === "error" || this.state === "disabled") {
            return { status: "error", payload, note: `not sent: ${this.detail}` };
        }
        return { status: "queued", payload, note: "waiting for window._analytics" };
    }

    status() {
        return { state: this.state, detail: this.detail, pending: this.pending.length };
    }

}
