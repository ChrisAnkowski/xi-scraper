// Vorname
// Nachname
// Telefon
// E-Mail
// Geburtsdatum
// Geschlecht
// Aktuelle Position
// Gehaltswunsch
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
    console.log('Neues Script')
});

function scrapeInformation() {
    const name = document.querySelector('#content *[data-xds="Hero"]').innerText.replace(/<(.|\n)*?>/g, '').split('\n')[0].trim();
    const nameSplit = name.split(' ');
    let nachname = nameSplit.pop();
    let vorname = nameSplit.concat(' ');
    addInformationToResult('vorname', vorname);
    addInformationToResult('nachname', nachname);
}

function addInformationToResult(key, info) {
    userData[key] = info;
    console.log(userData);
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