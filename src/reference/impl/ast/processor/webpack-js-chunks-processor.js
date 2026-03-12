import { findMarkersByName } from "../utils.js";

/////

export default function process(comparerResult) {
    const markers = findMarkersByName(comparerResult, "jsChunks");

    /////

    const references = [];

    /////

    for (const marker of markers) {
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
