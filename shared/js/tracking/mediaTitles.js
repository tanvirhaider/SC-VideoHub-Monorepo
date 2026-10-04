/**
 * Give every <video> a title for Matomo Media Analytics.
 *
 * The Matomo container tracks <video> elements on its own (plays, pauses,
 * seconds watched, completion; the ma_* requests in the ?debug Hits tab). It
 * takes the media title from the element's `data-matomo-title` attribute.
 * Without one, every video reports untitled, identified only by file URL.
 *
 * The hubs reuse the same three <video> elements (desktop assistant, mobile
 * assistant, topic player) for every clip, swapping `src`. So the title is set
 * each time a new source starts loading, from whatever the app is playing then.
 *
 * Matomo registers every <video> when its container starts, before the
 * assistant has a source, and keeps reporting the first clip under that entry.
 * So titles are also applied right away (the container loads after this runs),
 * and `data-matomo-resource` is set once a real source exists. Without that,
 * the intro clip reported untitled, with the page URL as its file.
 *
 * @param {(video: HTMLVideoElement) => string} titleFor
 */
export function titleVideosForMatomo(titleFor) {
    const apply = (event) => {
        const video = event.target;
        if (!(video instanceof HTMLVideoElement)) return;
        try {
            const title = titleFor(video);
            if (title) video.setAttribute("data-matomo-title", title);
            const resource = video.currentSrc || video.getAttribute("src");
            if (resource) video.setAttribute("data-matomo-resource", new URL(resource, document.baseURI).href);
        } catch (error) {
            // A title is nice to have; never let it break playback.
        }
    };

    // Media events don't bubble, but they do pass through the capture phase.
    document.addEventListener("loadstart", apply, true);
    document.addEventListener("play", apply, true);

    document.querySelectorAll("video").forEach((video) => apply({ target: video }));
}
