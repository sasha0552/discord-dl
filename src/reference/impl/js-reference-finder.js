import { parse } from "acorn";
import { full } from "acorn-walk";

/////

import { ReferenceFinder } from "../reference-finder.js";

/////

function createAstComparer(object) {
    const statements = [];

    /////

    let markerNames = [];
    let markers = [];

    /////

    function walk(object, path = "node", isArray = false) {
        for (const key in object) {
            const newPath = isArray ? path + "[" + key + "]" : path + "." + key;
            const value = object[key];

            /////

            if (key.startsWith(";")) {
                if (key === ";special:marker") {
                    let values = value;

                    if (typeof values === "string") {
                        values = [ value ];
                    }

                    if (typeof values === "object" && Array.isArray(values)) {
                        const pathes = [];

                        /////

                        for (const name of values) {
                            pathes.push(path + "." + name);
                        }

                        /////

                        if (typeof object[";special:name"] === "string") {
                            markerNames.push([ object[";special:name"], pathes ]);
                        }

                        if (typeof object[";special:test"] === "string") {
                            const regex = object[";special:test"];

                            if (regex.startsWith("/") && regex.endsWith("/")) {
                                for (const path of pathes) {
                                    statements.push(
                                        `if (!${regex}.test(${path})) {\n` +
                                        "    return false;\n"              +
                                        "}\n"
                                    )
                                }
                            } else {
                                console.warn("Invalid regex \"%s\" passed as special:test", regex);
                            }
                        }

                        /////

                        markers = markers.concat(pathes);
                    }
                }

                continue;
            }

            /////

            if (typeof value === "object") {
                if (Array.isArray(value)) {
                    statements.push(
                        `if (!Array.isArray(${newPath})) {\n` +
                        "    return false;\n"                 +
                        "}\n"
                    )
                } else {
                    if (value === null) {
                        statements.push(
                            `if (typeof ${newPath} !== null) {\n` +
                            "    return false;\n"                 +
                            "}\n"
                        )
                    }

                    statements.push(
                        `if (typeof ${newPath} !== "object") {\n` +
                        "    return false;\n"                     +
                        "}\n"
                    )
                }

                /////

                walk(value, newPath, Array.isArray(value));
            }

            if (typeof value === "string") {
                statements.push(
                    `if (${newPath} !== "${value}") {\n` +
                    "    return false;\n"                +
                    "}\n"
                )
            }

            if (typeof value === "number" || typeof value === "boolean") {
                statements.push(
                    `if (${newPath} !== ${value}) {\n` +
                    "    return false;\n"              +
                    "}\n"
                )
            }
        }
    }

    /////

    walk(object);

    /////

    statements.push("const markers = [];\n");

    /////

    for (const marker of markers) {
        statements.push(
            "markers.push(\n"                  +
            `    [ "${marker}", ${marker} ]\n` +
            ");\n"
        );
    }

    /////

    statements.push(
        // find another way to pass [ string, string[] ]?
        `const markerNames = JSON.parse('${JSON.stringify(markerNames)}')\n`
    );

    /////

    statements.push("return { markerNames, markers };\n");

    /////

    return new Function("node", statements.join("\n"));
}

/////

export class JsReferenceFinder extends ReferenceFinder {
    constructor(processors) {
        super();

        /////

        this.processors = [];

        /////

        for (const entry of processors) {
            this.processors.push({
                name: entry[0],
                detector: entry[1],
                comparer: createAstComparer(entry[2]),
                processor: entry[3],
                additional: entry[4],
            });
        }
    }

    /////

    type() {
        return "text/javascript";
    }

    /////

    find(body) {
        let shouldContinue = false;

        for (const { name, detector } of this.processors) {
            if (detector(body)) {
                shouldContinue = true;
                console.debug("js-reference-finder.js: detector for %s returned true", name)
            }
        }

        /////

        if (!shouldContinue) {
            return [];
        }

        /////

        const $ = parse(body, { ecmaVersion: "latest" });

        /////

        const references = [];

        /////

        const additionalObject = {};

        /////

        for (const { additional } of this.processors) {
            if (additional === "resourceHashes") {
                additionalObject.resourceHashes = [];
            }
        }

        /////

        full($, (node) => {
            for (const { comparer, processor, additional } of this.processors) {
                const result = comparer(node);

                /////

                if (!result) {
                    continue;
                }

                /////

                for (const reference of processor(result)) {
                    if (additional === "resourceHashes") {
                        additionalObject.resourceHashes.push(reference);
                    } else {
                        if (reference.startsWith("/")) {
                            references.push(this.getBaseUrl() + reference);
                        } else {
                            references.push(reference);
                        }
                    }
                }
            }
        });

        /////

        return { references, ... additionalObject };
    }
}
