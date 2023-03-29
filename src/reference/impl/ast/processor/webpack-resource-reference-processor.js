import { findMarkersByName } from "../utils.js";

/////

export default function process(comparerResult) {
    const markers = findMarkersByName(comparerResult, "resourceReference");

    /////

    const references = [];

    /////

    for (const marker of markers) {
        // TODO: fix hardcoded value
        references.push(`/assets/${marker}`);
    }

    /////

    return references;
}
