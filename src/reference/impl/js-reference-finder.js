import { parse } from "acorn";

/////

import { ReferenceFinder } from "../reference-finder.js";

/////

export class JsReferenceFinder extends ReferenceFinder {
    type() {
        return "text/javascript";
    }

    /////

    find(body) {
        const $ = parse(body, { ecmaVersion: "latest" });

        /////

        const references = [];

        /////

        /////

        return references;
    }
}
