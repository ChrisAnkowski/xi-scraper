// ==UserScript==
// @name         XI Scraper
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  XI Scraper
// @author       Christian Ankowski
// @match        https://www.xing.com/profile/*
// @match        https://www.linkedin.com/in/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xing.com
// @grant        none
// ==/UserScript==

// @ts-nocheck
import Controller from './Classes/Controller';

ready(() => {
    new Controller();
});

function ready(eventListener: EventListener): void {
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(eventListener, 1500);
    } else {
        document.addEventListener('DOMContentLoaded', eventListener);
    }
}
