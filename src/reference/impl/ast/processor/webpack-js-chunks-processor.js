import { findMarkersByName } from "../utils.js";

/////

export default function process(comparerResult) {
    const markers = findMarkersByName(comparerResult, "jsChunks");

    /////

    const references = [];

    /////

    for (const marker of markers) {
        for (const property of marker) {
            // TODO: fix hardcoded value
            references.push(`/assets/${property.value.value}.js`);
        }
    }

    /////

    return references;
}
