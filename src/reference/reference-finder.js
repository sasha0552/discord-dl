export class ReferenceFinder {
    getBaseUrl() {
        return this.baseURL;
    }

    setBaseUrl(baseURL) {
        this.baseURL = baseURL;
    }

    /////

    type() {
        throw new Error("Not implemented");
    }

    /////

    find() {
        throw new Error("Not implemented");
    }
}
