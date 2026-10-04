import AdobeAnalyticsAdapter from "./adapters/AdobeAnalyticsAdapter";
import GoogleAnalyticsAdapter from "./adapters/GoogleAnalyticsAdapter";
import MatomoAdapter from "./adapters/MatomoAdapter";
import { isKnownEvent } from "./events";

const ADAPTERS = {
    adobe: AdobeAnalyticsAdapter,
    ga4: GoogleAnalyticsAdapter,
    matomo: MatomoAdapter,
};

/**
 * Facade over the tracking vendors, after AI-Assistant's
 * shared/modules/Tracking/Tracker.js. Call sites depend only on track() and
 * addStaticData(). Adding a vendor means writing an adapter and listing it
 * in `vendor`.
 *
 *     new Tracker({ vendor: ["adobe", "ga4", "matomo"], context, static });
 *
 * Vendor-specific options go under a key named for the vendor:
 *
 *     new Tracker({ vendor: ["matomo"], matomo: { containerUrl: "..." } });
 *
 * Every track() returns, and broadcasts to listeners, a record of what each
 * adapter did with the event. The ?debug panel is built on those records.
 */
export default class Tracker {

    constructor(config = {}) {
        const { vendor = ["adobe", "ga4", "matomo"], ...rest } = config;
        const names = Array.isArray(vendor) ? vendor : [vendor];

        const shared = { ...rest };
        Object.keys(ADAPTERS).forEach((name) => delete shared[name]);

        this.context = shared.context || {};
        this.static = { ...(shared.static || {}) };
        this.listeners = [];
        this.log = [];
        // Requests the vendors actually sent (filled by debug/hitSniffer.js in ?debug mode).
        this.hits = [];
        this.hitListeners = [];
        this.sequence = 0;

        this.adapters = names.map((name) => {
            const Adapter = ADAPTERS[name];
            if (!Adapter) {
                throw new Error(`Tracker: no adapter registered for vendor "${name}"`);
            }
            return new Adapter({ ...shared, static: { ...this.static }, ...(rest[name] || {}) });
        });
    }

    /**
     * @param {object} data
     * @param {string} data.name    - event name from events.js
     * @param {string} [data.item]  - what the event is about (video name, ...)
     * @param {string} [data.cta]   - label of the clicked control, for clicks
     * @param {string} [data.detail]- where the click happened (nav, playlist, ...)
     */
    track(data) {
        const event = {
            id: ++this.sequence,
            time: new Date(),
            name: String(data.name || "").trim(),
            item: data.item,
            cta: data.cta,
            detail: data.detail,
            known: isKnownEvent(String(data.name || "").trim()),
        };

        const results = {};

        // Vendors are isolated: call sites run app logic on the line after a
        // track() call, so a failing vendor must never throw into caller code
        // or stop the others from reporting.
        this.adapters.forEach((adapter) => {
            try {
                results[adapter.name] = adapter.track(event);
            } catch (error) {
                results[adapter.name] = { status: "error", note: error.message };
                console.warn(`Tracker: ${adapter.name} failed, continuing`, error);
            }
        });

        const record = { event, results };
        this.log.push(record);
        this.listeners.forEach((listener) => {
            try { listener(record); } catch (error) { console.warn("Tracker: listener failed", error); }
        });

        return record;
    }

    addStaticData(data) {
        this.static = { ...this.static, ...data };
        this.adapters.forEach((adapter) => adapter.addStaticData?.(data));
    }

    onTrack(listener) {
        this.listeners.push(listener);
    }

    recordHit(hit) {
        this.hits.push(hit);
        this.hitListeners.forEach((listener) => {
            try { listener(hit); } catch (error) { console.warn("Tracker: hit listener failed", error); }
        });
    }

    onHit(listener) {
        this.hitListeners.push(listener);
    }

    vendorStatus() {
        return this.adapters.map((adapter) => ({ name: adapter.name, ...adapter.status() }));
    }

}
