/**
 * Inject an async <script>. Resolves on load, rejects on network error.
 */
export function loadScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        script.onload = () => resolve(script);
        script.onerror = () => reject(new Error(`failed to load ${src}`));
        document.head.appendChild(script);
    });
}

/** True if a script whose src contains `fragment` is already on the page. */
export function scriptOnPage(fragment) {
    return document.querySelector(`script[src*="${fragment}"]`) !== null;
}
