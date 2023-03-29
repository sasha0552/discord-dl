import { writeFile } from "fs/promises";

import { ReferenceWalker } from "./reference/reference-walker.js";

import { CssReferenceFinder } from "./reference/impl/css-reference-finder.js";
import { HtmlReferenceFinder } from "./reference/impl/html-reference-finder.js";
import { JsReferenceFinder } from "./reference/impl/js-reference-finder.js";
import { RegexReferenceFinder } from "./reference/impl/regex-reference-finder.js";

import { fetchIdList } from "./archive/archived-pages.js";

/////

const DISCORD_URL = "https://discord.com"
const DISCORDAPP_URL = DISCORD_URL + "/app";

/////

function ariaEntry(url, filename) {
    return `${url}\n out=${filename}`;
}

async function walkAndSave(referenceWalker, url, id) {
    const ariaList = [];

    /////

    await referenceWalker.walk("text/html", url, null, true);

    /////

    ariaList.push(ariaEntry(url, id + ".html"));

    /////

    for (const assetUrl of referenceWalker.list()) {
        ariaList.push(ariaEntry(assetUrl, assetUrl.substr(DISCORD_URL.length + 1)));
    }

    /////

    referenceWalker.clear();

    /////

    await writeFile(id + ".txt", ariaList.join("\n"));
}

async function main() {
    const referenceWalker = new ReferenceWalker(DISCORD_URL);

    /////

    referenceWalker.addFinder(new CssReferenceFinder());
    referenceWalker.addFinder(new HtmlReferenceFinder());
    referenceWalker.addFinder(new JsReferenceFinder());
    referenceWalker.addFinder(new RegexReferenceFinder());

    /////

    //referenceWalker.bindExtenstionToType(".css", "text/css");
    //referenceWalker.bindExtenstionToType(".js", "text/javascript");

    referenceWalker.bindExtenstionToType(".css", "text/css");
    referenceWalker.bindExtenstionToType(".html", "text/html");
    referenceWalker.bindExtenstionToType(".js", "special/regex");

    /////

    referenceWalker.bindExtenstionToType(".ico", "special/skip");
    referenceWalker.bindExtenstionToType(".png", "special/skip");
    referenceWalker.bindExtenstionToType(".svg", "special/skip");
    referenceWalker.bindExtenstionToType(".woff2", "special/skip");
    referenceWalker.bindExtenstionToType(".jpg", "special/skip");
    referenceWalker.bindExtenstionToType(".gif", "special/skip");
    referenceWalker.bindExtenstionToType(".mp4", "special/skip");
    referenceWalker.bindExtenstionToType(".mp3", "special/skip");
    referenceWalker.bindExtenstionToType(".webm", "special/skip");
    referenceWalker.bindExtenstionToType(".mov", "special/skip");
    referenceWalker.bindExtenstionToType(".webp", "special/skip");
    referenceWalker.bindExtenstionToType(".woff", "special/skip");

    /////

    //for (const id of [ "latest" ].concat(await fetchIdList(DISCORDAPP_URL))) {
    for (const id of [ "20230101015410" ]) {
        console.log("index.js: Start of fetching version with id %s", id);
        await walkAndSave(referenceWalker, id === "latest" ? DISCORDAPP_URL : `https://web.archive.org/web/${id}id_/${DISCORDAPP_URL}`, id);
        console.log("index.js: End of fetching version with id %s", id);
    }
}

/////

main();
