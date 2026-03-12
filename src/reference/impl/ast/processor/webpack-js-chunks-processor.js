import { findMarkersByName } from "../utils.js";

/////

export default function process(comparerResult) {
    const jsChunk = findMarkersByName(comparerResult, "jsChunk");
    const jsChunks = findMarkersByName(comparerResult, "jsChunks");

    /////

    const references = [];

    /////

    for (const marker of jsChunk) {
        // TODO: fix hardcoded value
        references.push(`/assets/${marker}`);
    }

    for (const marker of jsChunks) {
        for (const property of marker) {
            if (property.value.value.startsWith(".")) {
                if (property.value.value.endsWith(".js")) {
                    // TODO: fix hardcoded value
                    references.push(`/assets/${property.key.value}.${property.value.value}`);
                } else {
                    // TODO: fix hardcoded value
                    references.push(`/assets/${property.key.value}.${property.value.value}.js`);
                }
            } else {
                if (property.value.value.endsWith(".js")) {
                    // TODO: fix hardcoded value
                    references.push(`/assets/${property.value.value}`);
                } else {
                    // TODO: fix hardcoded value
                    references.push(`/assets/${property.value.value}.js`);
                }
            }
        }
    }

    /////

    return references;
}
