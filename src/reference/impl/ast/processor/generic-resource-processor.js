import { findMarkersByName } from "../utils.js";

/////

export default function process(comparerResult) {
    const markers = findMarkersByName(comparerResult, "resourceString");

    /////

    const references = [];

    /////

    for (const marker of markers) {
        references.push(marker);
    }

    /////

    return references;
}
