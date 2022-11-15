// ==UserScript==
// @name        XI Scraper
// @version     1.0.2
// @description XI Scraper
// @author      Christian Ankowski
// @match       *://*.xing.com/profile/*
// @run-at      document-start
// @grant       GM_setValue
// @grant       GM_getValue
// @downloadURL https://github.com/ChrisAnkowski/xi-scraper/raw/main/user.js
// @updateURL   https://github.com/ChrisAnkowski/xi-scraper/raw/main/meta.js
// ==/UserScript==

const bundle = loadBundle();

document.addEventListener('DOMContentLoaded', async () => {
    eval(await bundle); // eslint-disable-line
});

async function loadBundle() {
    const bundleURL = 'https://raw.githubusercontent.com/ChrisAnkowski/xi-scraper/main/bundle.js?cache=' + new Date().getTime() + Math.random();
    const bundle = await (await fetch(bundleURL, { cache: 'no-store' })).text();

    GM_setValue('bundle', bundle);

    return bundle;
}