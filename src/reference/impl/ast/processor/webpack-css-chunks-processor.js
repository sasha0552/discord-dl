import { findMarkersByName } from "../utils.js";

/////

export default function process(comparerResult) {
    const cssChunk = findMarkersByName(comparerResult, "cssChunk");
    const cssChunks = findMarkersByName(comparerResult, "cssChunks");
    const cssChunksWithoutKeys = findMarkersByName(comparerResult, "cssChunksWithoutKeys");

    /////

    const references = [];

    /////

    for (const marker of cssChunk) {
        // TODO: fix hardcoded value
        references.push(`/assets/${marker}`);
    }

    for (const marker of cssChunks) {
        for (const property of marker) {
            // filter empty css chunks
            if (property.value.value === "31d6cfe0d16ae931b73c") {
                continue;
            }

            if (property.value.value.endsWith(".css")) {
                // TODO: fix hardcoded value
                references.push(`/assets/${property.key.value}.${property.value.value}`);
            } else {
                // TODO: fix hardcoded value
                references.push(`/assets/${property.key.value}.${property.value.value}.css`);
            }
        }
    }

    for (const marker of cssChunksWithoutKeys) {
        for (const property of marker) {
            // filter empty css chunks
            if (property.value.value === "31d6cfe0d16ae931b73c") {
                continue;
            }

            if (property.value.value.endsWith(".css")) {
                // TODO: fix hardcoded value
                references.push(`/assets/${property.value.value}`);
            } else {
                // TODO: fix hardcoded value
                references.push(`/assets/${property.value.value}.css`);
            }
        }
    }

    /////

    return references;
}
