import { readFileSync, writeFileSync } from "fs";

/////

import { load } from "cheerio";

///// ///// ///// ///// /////

function main() {
    const fileContent = readFileSync("index.html", "utf-8");

    ///// ///// /////

    const $ = load(fileContent);

    /////

    $("link[rel=icon]").each(function (index, element) {
        $(this).remove();
    });

    $("link[rel=prefetch]").each(function (index, element) {
        $(this).remove();
    });

    /////

    $("[nonce]").each(function (index, element) {
        $(this).removeAttr("nonce");
    });

    $("[integrity]").each(function (index, element) {
        $(this).removeAttr("integrity");
    });

    /////

    $("meta").each(function (index, element) {
        if (element.attribs["charset"]) {
            return;
        }

        if (element.attribs["name"] === "viewport") {
            return;
        }

        /////

        $(this).remove();
    });

    /////

    $("script").each(function (index, element) {
        if (element.children.length !== 1) {
            return;
        }

        /////

        const content = element.children[0].data;

        /////

        if (content.startsWith("window.GLOBAL_ENV")) {
            $(this).remove();
        }

        if (content.includes("/cdn-cgi/")) {
            $(this).remove();
        }
    });

    /////

    $.root()
        .find("*")
        .contents()
        .filter(function() {
            return this.type === "comment";
        })
        .remove();

    ///// ///// /////

    writeFileSync("index.html", $.html());
}

///// ///// ///// ///// /////

main();
