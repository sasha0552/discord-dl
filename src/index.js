import { writeFile } from "fs/promises";

import { ReferenceWalker } from "./reference/reference-walker.js";

import { CssReferenceFinder } from "./reference/impl/css-reference-finder.js";
import { HtmlReferenceFinder } from "./reference/impl/html-reference-finder.js";
import { JsReferenceFinder } from "./reference/impl/js-reference-finder.js";

/////

import webpackCssChunksDetector from "./reference/impl/ast/detector/webpack-css-chunks-detector.js";
import webpackJsChunksDetector from "./reference/impl/ast/detector/webpack-js-chunks-detector.js";
import webpackResourceReferenceDetector from "./reference/impl/ast/detector/webpack-resource-reference-detector.js";
import webpackWorkerReferenceDetector from "./reference/impl/ast/detector/webpack-worker-reference-detector.js";
import genericResourceDetector from "./reference/impl/ast/detector/generic-resource-detector.js";

import webpackCssChunks from "./reference/impl/ast/compare/webpack-css-chunks.json" assert { type: "json"};
import webpackJsChunks from "./reference/impl/ast/compare/webpack-js-chunks.json" assert { type: "json"};
import webpackResourceReference from "./reference/impl/ast/compare/webpack-resource-reference.json" assert { type: "json"};
import webpackWorkerReference from "./reference/impl/ast/compare/webpack-worker-reference.json" assert { type: "json"};
import genericResource from "./reference/impl/ast/compare/generic-resource.json" assert { type: "json"};

import webpackCssChunksProcessor from "./reference/impl/ast/processor/webpack-css-chunks-processor.js";
import webpackJsChunksProcessor from "./reference/impl/ast/processor/webpack-js-chunks-processor.js";
import webpackResourceReferenceProcessor from "./reference/impl/ast/processor/webpack-resource-reference-processor.js";
import webpackWorkerReferenceProcessor from "./reference/impl/ast/processor/webpack-worker-reference-processor.js";
import genericResourceProcessor from "./reference/impl/ast/processor/generic-resource-processor.js";

/////

const DISCORD_URL = "https://discord.com"
const DISCORDAPP_URL = DISCORD_URL + "/app";

/////

function ariaEntry(url, filename) {
    return `${url}\n out=${filename}`;
}

async function walkAndSave(referenceWalker, url, id) {
    const ariaList = [];
    const missingList = [];

    /////

    await referenceWalker.walk("text/html", url, null, true);

    /////

    ariaList.push(ariaEntry(url, id + ".html"));

    /////

    for (const assetUrl of referenceWalker.list()) {
        ariaList.push(ariaEntry(assetUrl, assetUrl.substr(DISCORD_URL.length + 1)));
    }

    /////

    for (const missingHash of referenceWalker.missing()) {
        missingList.push(missingHash);
    }

    /////

    referenceWalker.clear();

    /////

    await writeFile(id + ".txt", ariaList.join("\n"));
    await writeFile(id + ".missing.txt", missingList.join("\n"));
}

async function main() {
    const referenceWalker = new ReferenceWalker(DISCORD_URL);

    /////

    referenceWalker.addFinder(new CssReferenceFinder());
    referenceWalker.addFinder(new HtmlReferenceFinder());
    referenceWalker.addFinder(
        new JsReferenceFinder(
            [
                [ "webpackJsChunks", webpackJsChunksDetector, webpackJsChunks, webpackJsChunksProcessor, "none" ],
                [ "webpackResourceReference", webpackResourceReferenceDetector,  webpackResourceReference,  webpackResourceReferenceProcessor, "none" ],
                [ "webpackWorkerReference", webpackWorkerReferenceDetector,  webpackWorkerReference,  webpackWorkerReferenceProcessor, "none" ],
                [ "genericResource", genericResourceDetector, genericResource, genericResourceProcessor, "resourceHashes" ],
            ]
        )
    );
    //referenceWalker.addFinder(new RegexReferenceFinder());

    /////

    referenceWalker.bindExtenstionToType(".css", "text/css");
    referenceWalker.bindExtenstionToType(".html", "text/html");
    referenceWalker.bindExtenstionToType(".js", "text/javascript");

    /////

    referenceWalker.bindExtenstionToType(".gif", "special/skip");
    referenceWalker.bindExtenstionToType(".ico", "special/skip");
    referenceWalker.bindExtenstionToType(".jpg", "special/skip");
    referenceWalker.bindExtenstionToType(".mov", "special/skip");
    referenceWalker.bindExtenstionToType(".mp3", "special/skip");
    referenceWalker.bindExtenstionToType(".mp4", "special/skip");
    referenceWalker.bindExtenstionToType(".png", "special/skip");
    referenceWalker.bindExtenstionToType(".svg", "special/skip");
    referenceWalker.bindExtenstionToType(".wasm", "special/skip");
    referenceWalker.bindExtenstionToType(".webm", "special/skip");
    referenceWalker.bindExtenstionToType(".webp", "special/skip");
    referenceWalker.bindExtenstionToType(".woff", "special/skip");
    referenceWalker.bindExtenstionToType(".woff2", "special/skip");

    /////

    // https://web.archive.org/cdx/search/cdx?url=${url}
    for (const id of [ "20230101015410", "20230201040033", "20230301005436" ]) {
        console.log("index.js: Start of fetching version with id %s", id);
        await walkAndSave(referenceWalker, id === "latest" ? DISCORDAPP_URL : `https://web.archive.org/web/${id}id_/${DISCORDAPP_URL}`, id);
        console.log("index.js: End of fetching version with id %s", id);
    }
}

/////

main();
