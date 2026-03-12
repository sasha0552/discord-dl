import { parse } from "acorn";
import { full } from "acorn-walk";

/////

import { ReferenceFinder } from "../reference-finder.js";

/////

export function createAstComparer(object) {
    const statements = [];

    /////

    let markerNames = [];
    let markers = [];

    /////

    statements.push(
        "try {"
    );

    /////

    function walk(object, path = "node", isArray = false) {
        for (const key in object) {
            const newPath = isArray ? path + "[" + key + "]" : path + "." + key;
            const value = object[key];

            /////

            if (key === "_parent") {
                continue;
            }

            if (key.startsWith(";")) {
                if (key.startsWith(";special:marker")) {
                    let markerKey = null;

                    if (key.startsWith(";special:marker:")) {
                        markerKey = key.substring(";special:marker:".length);
                    }

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

                        if (typeof object[markerKey !== null ? ";special:name:" + markerKey : ";special:name"] === "string") {
                            markerNames.push([ object[markerKey !== null ? ";special:name:" + markerKey : ";special:name"], pathes ]);
                        }

                        if (typeof object[markerKey !== null ? ";special:test:" + markerKey : ";special:test"] === "string") {
                            const regex = object[markerKey !== null ? ";special:test:" + markerKey : ";special:test"];

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

                if (key.startsWith(";special:str_or:")) {
                    const orKey = key.substring(";special:str_or:".length);
                    const orNewPath = isArray ? path + "[" + orKey + "]" : path + "." + orKey;
                    const orValues = value;

                    statements.push(
                        `if (${orValues.map((orValue) => `${orNewPath} !== ${JSON.stringify(orValue)}`).join(" && ")}) {\n` +
                        "    return false;\n" +
                        "}\n"
                    );
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

                    statements.push(
                        `if (${newPath}.length < ${value.length}) {\n` +
                        "    return false;\n"                          +
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
                    `if (${newPath} !== ${JSON.stringify(value)}) {\n` +
                    "    return false;\n"                +
                    "}\n"
                )
            }

            if (typeof value === "number" || typeof value === "boolean") {
                statements.push(
                    `if (${newPath} !== ${JSON.stringify(value)}) {\n` +
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

    statements.push("return { markerNames, markers, node };\n");

    /////

    statements.push(
        "} catch (e) {\n" +
        "    return false;\n" +
        "}\n"
    );

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
        const detectedProcessors = [];

        for (const processor of this.processors) {
            if (processor.detector(body) || true) {
                shouldContinue = true;
                detectedProcessors.push(processor);
                //console.debug("js-reference-finder.js: detector for %s returned true", processor.name)
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

        for (const { additional } of detectedProcessors) {
            if (additional.split("+").includes("resourceHashes")) {
                additionalObject.resourceHashes = [];
            }

            if (additional.split("+").includes("astParent")) {
                additionalObject.astParent = true;
            }
        }

        if (additionalObject.astParent) {
            full($, (node) => {
                for (const key in node) {
                    if (key === "_parent") {
                        continue;
                    }

                    const value = node[key];

                    if (typeof value === "object" && value !== null) {
                        if (Array.isArray(value)) {
                            for (const element of value) {
                                if (typeof element.type === "string") {
                                    element._parent = node;
                                }
                            }
                        } else {
                            if (typeof value.type === "string") {
                                value._parent = node;
                            }
                        }
                    }
                }
            });
        }

        /////

        full($, (node) => {
            for (const { comparer, processor, additional } of detectedProcessors) {
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
