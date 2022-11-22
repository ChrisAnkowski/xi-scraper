// Vorname ✅
// Nachname ✅
// Aktuelle Position ✅
// Gehaltswunsch ✅
// Berufserfahrung
// Ausbildung / Qualifikation
// Ort


// const string = url;
// const regexp = /(\d{0,2}) Jahr/g;
// const matches = string.matchAll(regexp);
// let test = [];
// for (const match of matches) {
// 	test.push(match[1]);
// }

let userData = {};
ready(() => {
    const button = document.createElement('button');
    button.innerText = 'Profilinformationen kopieren';
    button.onclick = scrapeInformation;
    const moreButton = document.querySelector('*[data-qa="more-button"]');
    insertAfter(button, moreButton);
});

function getLocation() {
    const locationPin = document.querySelector('*[data-xds="IconLocationPin"]');
    const locationString = locationPin.parentNode.lastElementChild.textContent;
    addInformationToResult('city', locationString);
}

function extractYearsAsMonths(string) {
    const regexp = /(\d{0,2}) Jahr/g;
    const matches = string.matchAll(regexp);
    let months = [];
    for (const match of matches) {
    	months.push(Number(match[1]) * 12);
    }
    return months
}

function extractMonths(string) {
    const regexp = /(\d{0,2}) Monat/g;
    const matches = string.matchAll(regexp);
    let months = [];
    for (const match of matches) {
    	months.push(Number(match[1]));
    }
    return months
}

function getJobExpirience() {
    const section = document.getElementById('ProfileTimelineModule');
    const headline = [...section.querySelectorAll('*[data-xds="Headline"]')].filter(element => element.innerText.includes("Berufliche Stationen")).at(0);
    const ersteStationen = [...headline.parentNode.querySelectorAll(':scope > div')];
    const mehrAnzeigenStationen = [...headline.parentNode.nextSibling.querySelectorAll('*[data-qa="bucket"]:first-child > div')];
    let jobDuration = [];
    ersteStationen.forEach((element) => {
        jobDuration.push(element.querySelector('p[data-xds="BodyCopy"]').nextElementSibling.innerText);
    })
    mehrAnzeigenStationen.forEach((element) => {
        jobDuration.push(element.querySelector('p[data-xds="BodyCopy"]').nextElementSibling.innerText);
    })
    const extractedYearsAsMonths = extractYearsAsMonths(jobDuration.join(' '));
    const extractedMonths = extractMonths(jobDuration.join(' '));
    const expirience = extractedYearsAsMonths.concat(extractedMonths).reduce((partialSum, a) => partialSum + a, 0);
    addInformationToResult('expirience', getYearsString(expirience));
}

function getYearsString(monthCount) {
    function getPlural(number, word) {
        return number === 1 && word.one || word.other;
    }

    var months = { one: 'Monat', other: 'Monate' },
        years = { one: 'Jahr', other: 'Jahre' },
        m = monthCount % 12,
        y = Math.floor(monthCount / 12),
        result = [];

    y && result.push(y + ' ' + getPlural(y, years));
    m && result.push(m + ' ' + getPlural(m, months));
    return result.join(' und ');
}

function scrapeInformation() {
    searchForName();
    searchForSalaryWish();
    searchForJobTitle();
    getJobExpirience();
    getLocation();
    getJobExpirience();
    console.log(userData);
}

function searchForSalaryWish() {
    const allH2Array = [...document.querySelectorAll("h2")];
    const salaryHeadline = allH2Array.filter((element) => element.textContent.includes("Gehaltsvorstellung"));
    if (salaryHeadline.length > 0) {
        const salaryHeadlineSibling = salaryHeadline[0].nextElementSibling;
        const salaryWish = salaryHeadlineSibling.textContent;
        addInformationToResult('salary', salaryWish);
    } else {
        addInformationToResult('salary', 'Nicht angegeben');
    }
}

function searchForName() {
    const name = document.querySelector('#XingIdModule *[data-xds="Hero"]').innerText.replace(/<(.|\n)*?>/g, '').split('\n')[0].trim();
    const nameSplit = name.split(' ');
    let nachname = nameSplit.pop();
    let vorname = typeof nameSplit === 'string' ? nameSplit : nameSplit.join(' ');
    addInformationToResult('firstname', vorname);
    addInformationToResult('lastname', nachname);
}

function searchForJobTitle() {
    const jobTitleString = document.querySelector('#XingIdModule *[data-xds="Hero"]').parentElement.nextElementSibling.querySelector('section p').textContent.split(',');
    let jobTitle = jobTitleString[1];
    if (jobTitleString.includes('Student')) {
        jobTitle = jobTitleString[0] + ' ' + jobTitleString[1];
    }
    addInformationToResult('currentJob', jobTitle.trim());
}

function addInformationToResult(key, info) {
    userData[key] = info;
}

function insertAfter(newNode, referenceNode) {
    if (referenceNode && referenceNode.parentNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }
}

function ready(fn) {
    if (document.readyState === "complete" || document.readyState === "interactive") {
        setTimeout(fn, 1500);
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}

if( typeof Element.prototype.clearChildren === 'undefined' ) {
    Object.defineProperty(Element.prototype, 'clearChildren', {
        configurable: true,
        enumerable: false,
        value: function() {
            while(this.firstChild) this.removeChild(this.lastChild);
        }
    });
}