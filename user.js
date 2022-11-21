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

document.addEventListener('DOMContentLoaded', async () => {
    eval(await bundle); // eslint-disable-line
    eval('console.log("pohuj");')
});

async function loadBundle() {
    const bundleURL = 'https://raw.githubusercontent.com/ChrisAnkowski/xi-scraper/main/dist/index.js';
    const bundle = await (await fetch(bundleURL, { cache: 'no-store' })).text();

    GM_setValue('bundle', bundle);

    return bundle;
}