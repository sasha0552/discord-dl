import { findMarkersByName } from "../utils.js";

/////

export default function process(comparerResult) {
    const markers = findMarkersByName(comparerResult, "cssChunks");

    /////

    const references = [];

    /////

    for (const marker of markers) {
        for (const property of marker) {
            // filter empty css chunks
            if (property.value.value === "31d6cfe0d16ae931b73c") {
                continue;
            }

            // TODO: fix hardcoded value
            references.push(`/assets/${property.key.value}.${property.value.value}.css`);
        }
    }

    /////

    return references;
}
