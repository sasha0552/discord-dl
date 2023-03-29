import { findMarkersByName } from "../utils.js";

/////

export default function process(comparerResult) {
    const markers = findMarkersByName(comparerResult, "cssChunks");

    /////

    const references = [];

    /////

    for (const marker of markers) {
        for (const property of marker) {
            // TODO: fix hardcoded value
            // TODO: how to determine css chunk (maybe id)?
            references.push(`/assets/???.${property.value.value}.css`);
        }
    }

    /////

    return references;
}
