import Tracker from "./Tracker";
import { isDebugEnabled, mountDebugPanel } from "./debug/DebugPanel";
import { startHitSniffer } from "./debug/hitSniffer";

/**
 * One-call tracking setup for a Video-Hub project.
 *
 *     const tracker = createTracker({
 *         project: "CSU",
 *         context: {
 *             videoTopic: allData.campaign,
 *             videoOwner: allData.owner,
 *             videoPlayer: allData.player,
 *         },
 *     });
 *     tracker.track({ name: "videoStart", item: "new-treatment" });
 *
 * - Seeds Matomo static data (pageName/siteSection/contentType) from the
 *   campaign, so events carry usable values before the parent page says
 *   anything.
 * - Listens for the parent page's postMessage. When it carries a themeTitle
 *   (JSON string or object, as in AI-Assistant), static data is rebuilt from
 *   it. Messages without themeTitle are ignored and never overwrite it.
 * - With ?debug: records the requests the vendors really send (debug/hitSniffer.js)
 *   and mounts the tracking debug panel.
 */
export function createTracker({ project, context = {}, vendor, highlight, ...options } = {}) {
    const topic = context.videoTopic || project;
    const debug = isDebugEnabled();

    // Start watching the network before the adapters inject the vendor
    // libraries, so the very first requests (page views) are captured too.
    const earlyHits = [];
    let tracker = null;
    if (debug) {
        startHitSniffer((hit) => (tracker ? tracker.recordHit(hit) : earlyHits.push(hit)));
    }

    tracker = new Tracker({
        vendor,
        context,
        static: staticFor(topic),
        ...options,
    });

    window.addEventListener("message", (event) => {
        const data = parseMessage(event.data);
        if (data && data.themeTitle) {
            tracker.addStaticData(staticFor(data.themeTitle));
        }
    });

    earlyHits.forEach((hit) => tracker.recordHit(hit));

    if (debug) {
        tracker.onTrack(logToConsole);
        mountDebugPanel(tracker, { project, highlight });
    }

    // Handy for poking at tracking from the console, debug or not.
    window.VideoHubTracking = tracker;

    return tracker;
}

function staticFor(title) {
    return {
        pageName: `sharecare.com|Video Hub ${title}`,
        siteSection: title,
        contentType: "Video Hub",
    };
}

function parseMessage(raw) {
    try {
        if (typeof raw === "string") {
            const match = raw.match(/{[\s\S]*}/);
            return match ? JSON.parse(match[0]) : null;
        }
        if (raw && typeof raw === "object") return raw;
    } catch (error) {
        // iframeResizer and others post non-JSON strings; not for us.
    }
    return null;
}

function logToConsole({ event, results }) {
    console.groupCollapsed(`<> :: tracking :: #${event.id} ${event.name}${event.cta ? ` — ${event.cta}` : ""}`);
    console.log("event", event);
    Object.entries(results).forEach(([vendor, result]) => console.log(vendor, result));
    console.groupEnd();
}
