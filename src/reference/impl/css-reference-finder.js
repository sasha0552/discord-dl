import { parse, walk } from "css-tree";

/////

import { ReferenceFinder } from "../reference-finder.js";

/////

export class CssReferenceFinder extends ReferenceFinder {
    type() {
        return "text/css";
    }

    /////

    find(body) {
        const $ = parse(body);

        /////

        const references = [];

        /////

        walk($, (node) => {
            if (node.type === "Url" || node.type === "Raw") {
                let value = node.value;

                /////

                if (node.type === "Raw") {
                    const tmp = value.match(/url\((.+?)\)/);

                    /////

                    if (tmp !== null) {
                        value = tmp[1];
                    } else {
                        // skip invalid raw node
                        return;
                    }
                }

                /////

                // inline resources (data url)
                if (value.startsWith("data:")) {
                    return;
                }

                // inline resources (blob url)
                if (value.startsWith("blob:")) {
                    return;
                }

                // filter ids (#id)
                if (value.startsWith("#")) {
                    return;
                }

                // filter ids (file.svg#id)
                if (value.includes("#")) {
                    value = value.split("#")[0];
                }

                /////

                if (value.startsWith("/")) {
                    references.push(this.getBaseUrl() + value);
                } else {
                    references.push(value);
                }
            }
        });

        /////

        return references;
    }
}
