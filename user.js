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
    const commitURL = 'https://api.github.com/repos/ChrisAnkowski/xi-scraper/commits?per_page=1';
    const lastModified = GM_getValue('lastModified') || 0;

    const commit = (await (await fetch(commitURL, { cache: 'no-store' })).json())[0].commit;
    const commitDate = new Date(commit.committer.date);
    console.log(commitDate > lastModified);
    if (commitDate > lastModified) return updateBundle(commitDate);

    return GM_getValue('bundle');
}

async function updateBundle(date) {
    const bundleURL = 'https://raw.githubusercontent.com/ChrisAnkowski/xi-scraper/main/bundle.js?cache=' + new Date().getTime() + Math.random();
    const bundle = await (await fetch(bundleURL, { cache: 'no-store' })).text();

    GM_setValue('bundle', bundle);
    GM_setValue('lastModified', date.toString());

    return bundle;
}