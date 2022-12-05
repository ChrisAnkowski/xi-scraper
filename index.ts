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

(function () {
    var script = document.createElement('script');
    script.src = '//code.jquery.com/jquery-3.6.1.slim.min.js';
    document.getElementsByTagName('head')[0].appendChild(script);
})();

jQuery(document).ready(($) => {
    console.log('jQuery ready');
});
