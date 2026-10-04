/**
 * Every event name the Video-Hub apps send, and how each vendor sees it.
 *
 * Call sites only ever use the names on the left (via `Analytics({ name })`
 * in each project's main.js). The adapters read this table to decide what to
 * send:
 *
 *   adobe   - true: forwarded to Adobe in the legacy Video-Hub payload shape.
 *             Only events that existed before the Vite migration are sent, so
 *             Adobe reports keep receiving exactly what they always did. New
 *             events are Matomo/GA4 only.
 *   matomo  - Name pushed onto the Matomo Tag Manager data layer, using the
 *             AI-Assistant vocabulary (ctaAction, Video_Start, videoPct25/50/75,
 *             Video_Complete). A push only reports if the container has a
 *             Custom Event trigger of that name; today only videoPct25/50/75
 *             do. MatomoAdapter checks the live container and the ?debug panel
 *             marks the rest "unreported".
 *
 * Any event that carries a `cta` is reported to Matomo as `ctaAction`
 * (ctaName = cta, itemDetail = detail), whatever its name: in Matomo a click
 * is a click, while Adobe keeps its historical event name for it.
 */
export const EVENTS = {
    "intro-click": {
        adobe: true,
        matomo: "ctaAction",
        description: "Start screen button (Meet Jessica / Meet Pam) on desktop.",
    },
    videoStart: {
        adobe: true,
        matomo: "Video_Start",
        description: "A video started: the assistant clip for a topic, or the topic video itself.",
    },
    videoResume: {
        adobe: true,
        matomo: "Video_Resume",
        description: "Playback resumed after a pause (topic video, or the assistant via Resume).",
    },
    videoPause: {
        adobe: true,
        matomo: "Video_Pause",
        description: "Topic video paused, or the assistant paused via Pause Jessica/Pam.",
    },
    videoQuartile25: {
        adobe: false,
        matomo: "videoPct25",
        description: "Topic video reached 25%.",
    },
    videoHalfway: {
        adobe: true,
        matomo: "videoPct50",
        description: "Topic video reached 50%.",
    },
    videoQuartile75: {
        adobe: false,
        matomo: "videoPct75",
        description: "Topic video reached 75%.",
    },
    videoComplete: {
        adobe: true,
        matomo: "Video_Complete",
        description: "Topic video reached 90% / ended, or the whole playlist finished.",
    },
    videoMute: {
        adobe: true,
        matomo: "Video_Mute",
        description: "Mute button on the topic video player.",
    },
    videoUnMute: {
        adobe: true,
        matomo: "Video_Unmute",
        description: "Unmute button on the topic video player.",
    },
    videoShow: {
        adobe: true,
        matomo: "ctaAction",
        description: "Show Jessica/Pam button.",
    },
    videoHide: {
        adobe: true,
        matomo: "ctaAction",
        description: "Hide Jessica/Pam button.",
    },
    videoSkip: {
        adobe: true,
        matomo: "ctaAction",
        description: "Skip intro button (mobile).",
    },
    ctaAction: {
        adobe: false,
        matomo: "ctaAction",
        description: "Any other click: topic menu, playlist thumbnails, end-screen topics, back to topics, playlist toggle, dots, arrows.",
    },
};

export function isKnownEvent(name) {
    return Object.prototype.hasOwnProperty.call(EVENTS, name);
}
