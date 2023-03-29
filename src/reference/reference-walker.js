export class ReferenceWalker {
    constructor(baseURL) {
        this.baseURL = baseURL;

        /////

        this.findersMap = new Map();
        this.extToTypeMap = new Map();
        this.walkedList = [];
    }

    /////

    addFinder(finder) {
        if (finder.getBaseUrl() != this.baseURL) {
            finder.setBaseUrl(this.baseURL);
        }

        /////

        this.findersMap.set(finder.type(), finder);

        /////

        console.debug("reference-walker.js: Registred finder for %s", finder.type());
    }

    /////

    bindExtenstionToType(ext, type) {
        this.extToTypeMap.set(ext, type);

        /////

        console.debug("reference-walker.js: Binding %s -> %s", ext, type);
    }

    /////

    determineType(url) {
        for (const entry of this.extToTypeMap.entries()) {
            if (url.endsWith(entry[0])) {
                return entry[1];
            }
        }

        /////

        throw new Error("Can't detect content type for url " + url);
    }

    async downloadContent(url) {
        const response = await fetch(url);

        /////
    
        if (!response.ok) {
            throw new Error("HTTP request failed: " + response.status + " at " + response.url);
        }
    
        /////
    
        return await response.text();
    }

    /////

    async walk(type, url, content, skipRevisitCheck) {
        if (this.walkedList.includes(url)) {
            console.debug("reference-walker.js: Skipping %s (%s)", url, type);

            /////

            return;
        } else {
            console.debug("reference-walker.js: Visiting %s (%s)", url, type);
        }

        /////

        if (!skipRevisitCheck) {
            this.walkedList.push(url);
        }

        /////

        if (type === "special/skip") {
            return;
        }

        if (!content) {
            content = await this.downloadContent(url);
        }

        /////

        if (this.findersMap.has(type)) {
            const references = this.findersMap
                .get(type)
                .find(content);

            /////

            for (const reference of references) {
                await this.walk(this.determineType(reference), reference, null);
            }
        }
    }

    /////

    list() {
        console.debug("reference-walker.js: Returning visited pages");

        /////

        return this.walkedList;
    }

    /////

    clear() {
        console.debug("reference-walker.js: Clearing visited pages");

        /////

        this.walkedList = [];
    }
}
