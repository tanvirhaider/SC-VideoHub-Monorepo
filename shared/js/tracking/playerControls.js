/**
 * Report clicks on the Baymax player's own buttons as CTA events.
 *
 * Both players (BaymaxVideo and Pam's BaymaxMedia) build their buttons at
 * runtime with fixed ids, so one delegated listener on the player container
 * covers both. The player's callbacks (onPlay, onPause, onMute, ...) keep
 * reporting playback *state*; this reports the *click*.
 *
 * @param {string}   containerId - id of the element the player was mounted in
 * @param {Function} analytics   - the project's Analytics() function
 * @param {Function} currentItem - returns the name of the video now loaded
 */
const CONTROLS = {
    "video-play-button": "Play",
    "media-play-button": "Play",
    "poster-play-button": "Play",
    "video-pause-button": "Pause",
    "media-pause-button": "Pause",
    "video-mute-button": "Mute",
    "media-mute-button": "Mute",
    "video-unmute-button": "Unmute",
    "media-unmute-button": "Unmute",
};

const SELECTOR = Object.keys(CONTROLS).map((id) => `#${id}`).join(", ");

export function trackPlayerControls(containerId, analytics, currentItem) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.addEventListener("click", (event) => {
        const button = event.target.closest(SELECTOR);
        if (!button || !container.contains(button)) return;

        analytics({
            "name": "ctaAction",
            "cta": CONTROLS[button.id],
            "detail": "video-player",
            "item": currentItem(),
        });
    });
}
