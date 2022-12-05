// ==UserScript==
// @name         CRM Scraper Script
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://meincrm.proselection.de/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=proselection.de
// @grant        none
// ==/UserScript==

let data = {};
ready(() => {
    const wrapper = document.createElement('div');
    const input = document.createElement('input');
    const label = document.createElement('label');
    const inputWrapper = document.createElement('div');
    input.id = 'information_json';
    input.oninput = inputChange;
    input.style.width = '100%';
    label.htmlFor = 'information_json';
    label.innerText = 'Profilinformationen JSON';
    wrapper.appendChild(label);
    inputWrapper.appendChild(input);
    wrapper.appendChild(inputWrapper);
    insertAfter(wrapper, document.querySelector('.card-content h2'));
});

let fieldMap = {
    Vorname: 'firstname',
    Nachname: 'lastname',
    Gehaltswunsch: 'salary',
    'Aktuelle Position': 'currentJob',
    Berufserfahrung: 'experience',
    'Ausbildung/Qualifikation': 'education',
    Ort: 'city'
};

function objectEquals(x, y) {
    'use strict';

    if (x === null || x === undefined || y === null || y === undefined) {
        return x === y;
    }
    // after this just checking type of one would be enough
    if (x.constructor !== y.constructor) {
        return false;
    }
    // if they are functions, they should exactly refer to same one (because of closures)
    if (x instanceof Function) {
        return x === y;
    }
    // if they are regexps, they should exactly refer to same one (it is hard to better equality check on current ES)
    if (x instanceof RegExp) {
        return x === y;
    }
    if (x === y || x.valueOf() === y.valueOf()) {
        return true;
    }
    if (Array.isArray(x) && x.length !== y.length) {
        return false;
    }

    // if they are dates, they must had equal valueOf
    if (x instanceof Date) {
        return false;
    }

    // if they are strictly equal, they both need to be object at least
    if (!(x instanceof Object)) {
        return false;
    }
    if (!(y instanceof Object)) {
        return false;
    }

    // recursive object equality check
    var p = Object.keys(x);
    return (
        Object.keys(y).every(function (i) {
            return p.indexOf(i) !== -1;
        }) &&
        p.every(function (i) {
            return objectEquals(x[i], y[i]);
        })
    );
}

function inputChange(event) {
    if (event.target.value) {
        const parsedValue = JSON.parse(event.target.value);
        if (!objectEquals(parsedValue, data)) {
            data = parsedValue;
        }
        fillInForm();
    }
}

function findAncestor(el, sel) {
    while ((el = el.parentElement) && !(el.matches || el.matchesSelector).call(el, sel));
    return el;
}

function fillInForm() {
    const allInputs = [...document.querySelectorAll('#card-Allgemeines section input')];
    let timeout = 0;
    allInputs.forEach((input) => {
        const labelName = findAncestor(input, '.field').innerText;
        if (fieldMap[labelName] !== undefined) {
            timeout++;
            input.value = '.';
            const labelKey = fieldMap[labelName];
            const dataValue = data[labelKey];
            if (!dataValue) {
                return;
            }
            input.focus();
            setTimeout(() => {
                input.blur();
                setTimeout(() => {
                    input.value = '';
                    input.value = dataValue;
                    input.blur();
                    input.value = dataValue;
                    input.blur();
                }, 10);
            }, 10);
        }
    });
    setTimeout(() => {
        document.body.scrollTo({ top: 0 });
    }, 1);
}

async function getClipboardContent() {
    try {
        const permission = await navigator.permissions.query({
            name: 'clipboard-read'
        });
        if (permission.state === 'denied') {
            throw new Error('Not allowed to read clipboard.');
        }
        const clipboardContents = await navigator.clipboard.read();
        console.log(clipboardContents);
    } catch (error) {
        console.error(error.message);
    }
}

function ready(fn) {
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(fn, 1500);
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

function insertAfter(newNode, referenceNode) {
    if (referenceNode && referenceNode.parentNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }
}
