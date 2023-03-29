import { ReferenceFinder } from "../reference-finder.js";

/////

const REGEX_LIST = [
    // styles: 40532.1b9a3a3bbfeff65114b9.css 
    /\d+\.[0-9a-f]{20}\.css/g,

    // scripts: afc25eadcf8ab9a4166c.js
    /[0-9a-f]{20}\.(js|worker.js)/g,

    // assets: c2620d71d0c18f7cbdf536c0e7d3a788.jpg
    /[0-9a-f]{32}\.\w+/g
];

/////

export class RegexReferenceFinder extends ReferenceFinder {
    type() {
        return "special/regex";
    }

    /////

    find(body) {
        const references = [];

        /////

        for (const regex of REGEX_LIST) {
            const $ = body.match(regex);

            /////

            if ($ !== null) {
                for (const match of $) {
                    references.push(this.baseURL + "/assets/" + match);
                }
            }
        }

        /////

        return references;
    }
}
