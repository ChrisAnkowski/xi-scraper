// ==UserScript==
// @name         XI Scraper
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  XI Scraper
// @author       Christian Ankowski
// @match        https://www.xing.com/profile/*
// @downloadURL  https://github.com/ChrisAnkowski/xi-scraper/raw/main/user.js
// @updateURL    https://github.com/ChrisAnkowski/xi-scraper/raw/main/meta.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xing.com
// @grant        none
// ==/UserScript==

const bundle = loadBundle();
ready(async () => {
    eval(await bundle); // eslint-disable-line
    eval('console.log("pohuj");'); // eslint-disable-line
});

async function loadBundle() {
    const bundleURL = 'https://raw.githubusercontent.com/ChrisAnkowski/xi-scraper/main/dist/index.js';
    return await (await fetch(bundleURL, { cache: 'no-store' })).text();
}

function ready(fn) {
    if (document.readyState === "complete" || document.readyState === "interactive") {
        setTimeout(fn, 1500);
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}