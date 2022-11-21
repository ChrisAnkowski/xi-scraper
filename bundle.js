// Vorname ✅
// Nachname ✅
// Aktuelle Position ✅
// Gehaltswunsch ✅
// Berufserfahrung
// Ausbildung / Qualifikation
// Ort

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
    addInformationToResult('ort', locationString);
}

function getJobExpirience() {
    const jobs = getAllJobs();
}

function getAllJobs() {
    const section = document.getElementById('ProfileTimelineModule');
    const headline = [...section.querySelectorAll('*')].filter(element => element.textContent.includes("Berufliche Stationen"));
    console.log(headline)
}

function scrapeInformation() {
    searchForName();
    searchForSalaryWish();
    searchForJobTitle();
    getJobExpirience();
    getLocation();
    console.log(userData);
}

function searchForSalaryWish() {
    const allH2Array = [...document.querySelectorAll("h2")];
    const salaryHeadline = allH2Array.filter((element) => element.textContent.includes("Gehaltsvorstellung"));
    if (salaryHeadline.length > 0) {
        const salaryHeadlineSibling = salaryHeadline[0].nextElementSibling;
        const salaryWish = salaryHeadlineSibling.textContent;
        addInformationToResult('gehalt', salaryWish);
    } else {
        addInformationToResult('gehalt', 'Nicht angegeben');
    }
}

function searchForName() {
    const name = document.querySelector('#XingIdModule *[data-xds="Hero"]').innerText.replace(/<(.|\n)*?>/g, '').split('\n')[0].trim();
    const nameSplit = name.split(' ');
    let nachname = nameSplit.pop();
    let vorname = typeof nameSplit === 'string' ? nameSplit : nameSplit.join(' ');
    addInformationToResult('vorname', vorname);
    addInformationToResult('nachname', nachname);
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