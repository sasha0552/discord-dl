export async function fetchIdList(url) {
    const response = await fetch(`https://web.archive.org/cdx/search/cdx?url=${url}`);

    /////

    if (!response.ok) {
        throw new Error("HTTP request failed: " + response.status + " at " + response.url);
    }

    /////

    return (await response.text())
                          .split("\n")
                          .map(entry => entry.split(" "))
                          .filter(entry => entry[2] === url)
                          .filter(entry => entry[3] === "text/html")
                          .filter(entry => entry[4] === "200")
                          .map(entry => entry[1]);
}
