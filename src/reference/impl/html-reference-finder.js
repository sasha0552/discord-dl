import { load } from "cheerio";

/////

import { ReferenceFinder } from "../reference-finder.js";

/////

export class HtmlReferenceFinder extends ReferenceFinder {
    type() {
        return "text/html";
    }

    /////

    find(body) {
        const $ = load(body);

        /////

        const references = [];

        /////

        $("script").each((index, element) => {
            const scriptSrc = element.attribs["src"];

            /////

            if (scriptSrc !== undefined) {
                if (scriptSrc.startsWith("/")) {
                    references.push(this.getBaseUrl() + scriptSrc);
                } else {
                    references.push(scriptSrc);
                }
            }
        });

        /////

        $("link").each((index, element) => {
            const linkHref = element.attribs["href"];

            /////

            if (linkHref !== undefined) {
                if (linkHref.startsWith("/")) {
                    references.push(this.getBaseUrl() + linkHref);
                } else {
                    references.push(linkHref);
                }
            }
        });

        /////

        return references;
    }
}
