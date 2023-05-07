export class ReferenceWalker {
    constructor(baseURL) {
        this.baseURL = baseURL;

        /////

        this.findersMap = new Map();
        this.extToTypeMap = new Map();
        this.resourceHashes = new Set();
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
            const result = this.findersMap
                .get(type)
                .find(content);

            /////

            for (const reference of result.references) {
                await this.walk(this.determineType(reference), reference, null);
            }

            if (result.resourceHashes) {
                for (const hash of result.resourceHashes) {
                    this.resourceHashes.add(hash);
                }
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

    missing() {
        const missing = new Set(this.resourceHashes);

        /////

        for (const url of this.walkedList) {
            const relative = url.substring(this.baseURL.length);

            /////

            const parts = relative.split(".");

            /////

            if (parts[0].length === 20) {
                if (missing.has(parts[0])) {
                    missing.delete(parts[0]);
                }                
            }
        }

        /////

        return Array.from(missing);
    }

    /////

    clear() {
        console.debug("reference-walker.js: Clearing visited pages");

        /////

        this.walkedList = [];
    }
}
