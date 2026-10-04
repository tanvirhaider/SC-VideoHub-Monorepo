/**
 * Records the requests the analytics libraries actually send. Debug mode only.
 *
 * Our adapters know what they *pushed*; whether a vendor turned that into a
 * hit is decided by its own library (for Matomo, by the Tag Manager
 * container's triggers and tags). This watches the network side so the ?debug
 * panel can show what each vendor really received:
 *
 *   Matomo  .../matomo.php        page views, events (e_c / e_a / e_n), media
 *                                 analytics (ma_*), heatmaps, pings
 *   Adobe   .../b/ss/...          page views and custom links (pev2)
 *   GA4     .../g/collect         events (en)
 *
 * XHR, fetch and sendBeacon are wrapped to see URL and body. Images (Adobe's
 * beacons) are picked up through a PerformanceObserver. A request seen twice
 * (e.g. Matomo's http -> https redirect) is reported once.
 */

const VENDORS = [
    { name: "matomo", test: /\/(matomo|piwik)\.php/, parse: parseMatomo },
    { name: "adobe", test: /\/b\/ss\//, parse: parseAdobe },
    { name: "ga4", test: /\/g\/collect/, parse: parseGa4 },
];

function paramsOf(text) {
    return Object.fromEntries(new URLSearchParams(String(text || "").replace(/^[^?]*\?/, "")));
}

function queryOf(url) {
    const i = url.indexOf("?");
    return i === -1 ? "" : url.slice(i + 1);
}

function parseMatomo(url, body) {
    const requests = [];
    if (/idsite=/.test(queryOf(url))) requests.push(queryOf(url));

    if (body) {
        if (body.trim().startsWith("{")) {
            try { (JSON.parse(body).requests || []).forEach((r) => requests.push(r.replace(/^\?/, ""))); } catch (e) { /* not bulk JSON */ }
        } else {
            body.split("\n").filter((line) => /idsite=/.test(line)).forEach((line) => requests.push(line.replace(/^\?/, "")));
        }
    }

    return requests.map((request) => {
        const p = paramsOf(request);
        let type = "request";
        let summary = "";
        if (p.e_c) {
            type = "event";
            summary = [p.e_c, p.e_a, p.e_n].filter(Boolean).join(" › ");
        } else if (p.ping) {
            type = "ping";
            summary = "heartbeat";
        } else if (p.c_n) {
            type = "content";
            summary = [p.c_n, p.c_p, p.c_i].filter(Boolean).join(" › ");
        } else if (p.ma_id) {
            // Matomo Media Analytics: the container tracks <video> elements itself.
            type = "media";
            const file = String(p.ma_re || "").split("/").pop();
            summary = `${p.ma_ti || "(untitled)"} · ${file} · watched ${p.ma_st || 0}s of ${p.ma_le || "?"}s`;
        } else if (Object.keys(p).some((k) => k.startsWith("hsr_"))) {
            type = "heatmap";
            summary = "heatmap / session recording data";
        } else if (p.action_name !== undefined) {
            type = "pageview";
            summary = p.action_name || p.url;
        }
        // `r` is a per-request random value; together with the event fields it
        // identifies a hit across the redirect duplicate.
        return { key: `${p.r}|${p.pv_id}|${p.e_c}|${p.e_a}|${p.e_n}|${p.action_name}`, type, summary, params: p };
    });
}

function parseAdobe(url) {
    const p = paramsOf(url);
    const link = p.pe && p.pe.startsWith("lnk");
    return [{
        key: url,
        type: link ? "link" : "pageview",
        summary: link ? `${p.pev2 || "(link)"}${p.events ? ` · ${p.events}` : ""}` : (p.pageName || p.g || ""),
        params: p,
    }];
}

function parseGa4(url, body) {
    const shared = paramsOf(url);
    const lines = body ? body.split("\n").filter(Boolean) : [""];
    return lines.map((line) => {
        const p = { ...shared, ...paramsOf(line) };
        return {
            key: `${url}|${line}`,
            type: p.en === "page_view" ? "pageview" : "event",
            summary: [p.en, p["ep.event_label"]].filter(Boolean).join(" · "),
            params: p,
        };
    });
}

let started = false;

export function startHitSniffer(onHit) {
    if (started) return;
    started = true;

    const seen = new Set();

    const emit = (url, body, via) => {
        url = String(url || "");
        const vendor = VENDORS.find((v) => v.test.test(url));
        if (!vendor) return;
        vendor.parse(url, body || "").forEach((hit) => {
            const key = `${vendor.name}|${hit.key}`;
            if (seen.has(key)) return;
            seen.add(key);
            onHit({ vendor: vendor.name, via, time: new Date(), ...hit, url });
        });
    };

    const bodyText = (body, then) => {
        if (!body) return then("");
        if (typeof body === "string") return then(body);
        if (body instanceof URLSearchParams) return then(body.toString());
        if (typeof Blob !== "undefined" && body instanceof Blob) return body.text().then(then, () => then(""));
        return then("");
    };

    const safe = (fn) => { try { fn(); } catch (error) { /* never break the vendor's request */ } };

    const open = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url) {
        this.__vhUrl = url;
        return open.apply(this, arguments);
    };
    const send = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function (body) {
        const url = this.__vhUrl;
        safe(() => bodyText(body, (text) => emit(url, text, "xhr")));
        return send.apply(this, arguments);
    };

    if (navigator.sendBeacon) {
        const beacon = navigator.sendBeacon.bind(navigator);
        navigator.sendBeacon = function (url, data) {
            safe(() => bodyText(data, (text) => emit(url, text, "beacon")));
            return beacon(url, data);
        };
    }

    if (window.fetch) {
        const fetch = window.fetch;
        window.fetch = function (input, init) {
            safe(() => {
                const url = typeof input === "string" ? input : input && input.url;
                bodyText(init && init.body, (text) => emit(url, text, "fetch"));
            });
            return fetch.apply(this, arguments);
        };
    }

    if (typeof PerformanceObserver !== "undefined") {
        safe(() => new PerformanceObserver((list) => {
            list.getEntries().forEach((entry) => {
                // XHR/fetch/beacon are already covered above, with their bodies.
                if (["xmlhttprequest", "fetch", "beacon"].includes(entry.initiatorType)) return;
                emit(entry.name, "", entry.initiatorType);
            });
        }).observe({ type: "resource", buffered: true }));
    }
}
