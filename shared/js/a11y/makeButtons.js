/**
 * Turn the hubs' div-based controls into real buttons.
 *
 * Why this matters for analytics: the Matomo container (both production
 * KpatjL22 and UAT fJuSGoCb) has no trigger for our custom click events. Its
 * generic AllElementsClick trigger does report every click, but only on
 * elements matching
 *
 *     a, button, [role="button"], div[class*="btn"], ...
 *
 * Bare divs such as the playlist thumbnails, nav items, dots and player buttons
 * didn't match, so those clicks never reached Matomo. Each control here gets
 * `role="button"` and `tabindex="0"`, Enter/Space activation, and an
 * aria-label when it has no visible text. The container labels a click with
 * the element's text, falling back to aria-label.
 *
 * Children are made non-clickable in shared/css/interactive.css, so the button
 * itself is the click target. AllElementsClick matches the clicked element
 * only, not its ancestors.
 *
 * Same approach as AI-Assistant's shared/js/asButton.js. Safe to call
 * repeatedly: the keydown listener is bound once, but role/label are
 * re-applied, because Swiper sets role="group" on its slides when it starts.
 */

const bound = new WeakSet();

export function asButton(el, label = null) {
    if (!el) return el;

    el.setAttribute("role", "button");
    if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "0");
    if (label) el.setAttribute("aria-label", label);

    if (!bound.has(el)) {
        bound.add(el);
        el.addEventListener("keydown", (event) => {
            if (event.key !== "Enter" && event.key !== " " && event.key !== "Spacebar") return;
            event.preventDefault();
            el.click();
        });
    }

    return el;
}

// selector -> aria-label for icon-only controls (null: the visible text is the label)
const CONTROLS = [
    [".startpage .bigplaybutton", null],
    ["#skip-intro", null],
    [".btn-style", null],
    [".end-btn-style", null],
    [".thumb", null],
    [".nav-items", null],
    [".show-hide-btn", "Show or hide playlist"],
    [".dot-style", (el) => `Topic ${el.dataset.indexNumber}`],
    ["#video-play-button, #media-play-button, .poster-frame-playBtn", "Play video"],
    ["#video-pause-button, #media-pause-button", "Pause video"],
    ["#video-mute-button, #media-mute-button", "Mute video"],
    ["#video-unmute-button, #media-unmute-button", "Unmute video"],
];

/** Apply asButton to every tracked control currently in the DOM. */
export function makeButtons(root = document) {
    CONTROLS.forEach(([selector, label]) => {
        root.querySelectorAll(selector).forEach((el) => {
            asButton(el, typeof label === "function" ? label(el) : label);
        });
    });
}
