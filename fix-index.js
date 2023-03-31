import { readFileSync, writeFileSync } from "fs";
import { load } from "cheerio";

///// ///// ///// ///// /////

function main() {
    const fileContent = readFileSync("index.html", "utf-8");

    ///// ///// /////

    const $ = load(fileContent);

    /////

    $("[nonce]").each(function (index, element) {
        $(this).removeAttr("nonce");
    });

    $("[integrity]").each(function (index, element) {
        $(this).removeAttr("integrity");
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

    ///// ///// /////

    writeFileSync("index.html", $.html());
}

///// ///// ///// ///// /////

main();
