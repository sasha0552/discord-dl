import { findMarkersByName } from "../utils.js";

/////

export default function process(comparerResult) {
    const resourceReference = findMarkersByName(comparerResult, "resourceReference");
    const resourceReferenceWithPrefix = findMarkersByName(comparerResult, "resourceReferenceWithPrefix");

    /////

    const references = [];

    /////

    for (const marker of resourceReference) {
        // TODO: fix hardcoded value
        references.push(`/assets/${marker}`);
    }

    /////

    for (const marker of resourceReferenceWithPrefix) {
        references.push(marker);
    }

    /////

    return references;
}
