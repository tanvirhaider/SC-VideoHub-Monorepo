import { loadScript, scriptOnPage } from "../loadScript";

/**
 * GA4 via gtag.js. Replaces the gtag snippet that used to sit in each
 * project's index.html; the measurement ID now comes from VITE_GA4_ID.
 *
 * Event shape is unchanged from the pre-migration Analytics() function:
 *
 *     gtag("event", "<name>", { event_label: "<item>", event_category: "<campaign>" });
 *
 * The generic `ctaAction` click event is labelled with the clicked control and
 * carries `video_name` when a video is loaded. Any click (`cta`) adds
 * `cta_detail` with where on the page it happened.
 *
 * .env.development leaves VITE_GA4_ID empty, so local development does not
 * report into the production GA4 property. Events still appear in ?debug.
 */
export default class GoogleAnalyticsAdapter {

    constructor(config = {}) {
        this.name = "ga4";
        this.context = config.context || {};
        this.id = config.measurementId ?? import.meta.env.VITE_GA4_ID ?? "";
        this.state = "loading";
        this.detail = this.id;

        if (!this.id) {
            this.state = "disabled";
            this.detail = "VITE_GA4_ID not set";
            return;
        }

        window.dataLayer = window.dataLayer || [];
        if (typeof window.gtag !== "function") {
            window.gtag = function gtag() { window.dataLayer.push(arguments); };
        }

        window.gtag("js", new Date());
        window.gtag("config", this.id, {
            cookie_flags: "Secure;SameSite=None",
            cookie_domain: "auto",
            cookie_update: true,
        });

        if (scriptOnPage("googletagmanager.com/gtag/js")) {
            this.state = "ready";
            return;
        }

        loadScript(`https://www.googletagmanager.com/gtag/js?id=${this.id}`)
            .then(() => { this.state = "ready"; })
            .catch((error) => {
                this.state = "error";
                this.detail = error.message;
            });
    }

    track(event) {
        if (!this.id) {
            return { status: "skipped", note: "VITE_GA4_ID not set" };
        }

        // Legacy events keep their historical label (the item); the generic
        // ctaAction is labelled by the control that was clicked.
        const isCta = event.name === "ctaAction";
        const params = {
            event_label: isCta ? event.cta : event.item,
            event_category: this.context.videoTopic,
        };
        if (event.cta && event.detail) params.cta_detail = event.detail;
        if (isCta && event.item) params.video_name = event.item;

        // gtag queues on dataLayer until gtag.js loads, so this never drops.
        window.gtag("event", event.name, params);
        const payload = ["event", event.name, params];
        if (this.state === "error") return { status: "error", payload, note: `not sent: ${this.detail}` };
        return { status: this.state === "ready" ? "sent" : "queued", payload };
    }

    status() {
        return { state: this.state, detail: this.detail };
    }

}
