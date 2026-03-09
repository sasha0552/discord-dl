import { findMarkersByName } from "../utils.js";

/////

export default function process(comparerResult) {
    const markers = findMarkersByName(comparerResult, "wasmReference");

    /////

    const references = [];

    /////

    for (const marker of markers) {
        if (marker.endsWith(".module.wasm")) {
            // TODO: fix hardcoded value
            references.push(`/assets/${marker}`);
        } else {
            // TODO: fix hardcoded value
            references.push(`/assets/${marker}.module.wasm`);
        }
    }

    /////

    return references;
}
