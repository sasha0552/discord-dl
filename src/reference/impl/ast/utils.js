export function findMarkersByName(comparerResult, markerName) {
    let originalMarkerNames = [];

    for (const entry of comparerResult.markerNames) {
        if (entry[0] === markerName) {
            originalMarkerNames = originalMarkerNames.concat(entry[1]);
        }
    }

    /////

    let markerValues = [];

    for (const originalMarkerName of originalMarkerNames) {
        for (const entry of comparerResult.markers) {
            if (entry[0] === originalMarkerName) {
                markerValues.push(entry[1]);
            }
        }
    }

    /////

    return markerValues;
}
