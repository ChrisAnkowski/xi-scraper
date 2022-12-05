var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(script) {
    const fetchOpts = {};
    if (script.integrity)
      fetchOpts.integrity = script.integrity;
    if (script.referrerpolicy)
      fetchOpts.referrerPolicy = script.referrerpolicy;
    if (script.crossorigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (script.crossorigin === "anonymous")
      fetchOpts.credentials = "omit";
    else
      fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
class Toast {
  constructor(timeout) {
    __publicField(this, "toast", null);
    __publicField(this, "timeout", 0);
    this.timeout = timeout;
    this.injectStyle();
  }
  show(message, type = "error") {
    this.toast = document.createElement("div");
    this.toast.classList.add("toast");
    this.toast.classList.add("toast-" + type);
    this.toast.onclick = this.close.bind(this);
    this.toast.textContent = message;
    document.body.appendChild(this.toast);
    setTimeout(() => {
      this.toast.classList.add("toast-show");
    }, 100);
    if (this.timeout > 0) {
      setTimeout(() => {
        this.toast.classList.remove("toast-show");
      }, this.timeout);
    }
  }
  injectStyle() {
    const style = document.createElement("style");
    style.textContent = `
            .toast {
              display: flex;
              align-items: center;
              position: fixed;
              top: 80px;
              right: -500px;
              border-radius: 5px;
              padding: 1rem 1.5rem;
              opacity: 0%;
              transition: all 0.5s linear;
              z-index: 99999;
            }
            
            .toast-error {
              background-color: #FF4136;
              color: #800600;
            }
            
            .toast-success {
              background-color: #2ECC40;
              color: #0e3e14;
            }
            
            .toast-show {
              right: 10px;
              opacity: 100%;
            }
        `;
    document.head.appendChild(style);
  }
  close() {
    this.toast.classList.remove("toast-show");
    setTimeout(() => {
      this.toast.remove();
    }, 1e3);
  }
}
class Scraper {
  constructor() {
    __publicField(this, "userData");
    __publicField(this, "moreButton");
    __publicField(this, "toast", new Toast(5e3));
  }
  scrape(moreButton) {
    this.userData = {};
    this.moreButton = moreButton;
    this.addScrapeButton();
  }
  addScrapeButton() {
    const button = document.createElement("button");
    button.innerText = "Profilinformationen kopieren";
    button.onclick = this.scrapeInformation.bind(this);
    console.log(this.moreButton);
    this.insertAfter(button, this.moreButton);
  }
  scrapeInformation() {
    try {
      this.getName();
      this.getSalaryWish();
      this.getJobTitle();
      this.getJobExperience();
      this.getEducation();
      this.getLocation();
      this.copyTextToClipboard(JSON.stringify(this.userData));
    } catch (e) {
      this.toast.show("Es gab einen Fehler!");
      console.error(e);
    }
  }
  addInformationToResult(key, info) {
    this.userData[key] = info;
  }
  fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand("copy");
      this.toast.show("Kopieren der Daten war erfolgreich!", "success");
    } catch (err) {
      this.toast.show("Es gab ein Fehler beim kopieren der Daten!");
    }
    document.body.removeChild(textArea);
  }
  copyTextToClipboard(text) {
    if (!navigator.clipboard) {
      this.fallbackCopyTextToClipboard(text);
      return;
    }
    navigator.clipboard.writeText(text).then(
      () => {
        this.toast.show("Kopieren der Daten war erfolgreich!", "success");
      },
      () => {
        this.toast.show("Es gab ein Fehler beim kopieren der Daten!");
      }
    );
  }
  insertAfter(newNode, referenceNode) {
    if (referenceNode && referenceNode.parentNode) {
      referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }
  }
}
class LinkedinScraper extends Scraper {
  constructor() {
    super(...arguments);
    __publicField(this, "userData", {});
  }
  getName() {
    const nameElement = document.querySelector("#main h1");
    if (nameElement) {
      const name = nameElement.innerText.replace(/<(.|\n)*?>/g, "").split("\n")[0].trim();
      const nameSplit = name.split(" ");
      const nachname = nameSplit.pop();
      const vorname = typeof nameSplit === "string" ? nameSplit : nameSplit.join(" ");
      this.addInformationToResult("firstname", vorname);
      this.addInformationToResult("lastname", nachname);
    } else {
      this.addInformationToResult("firstname", "Nicht angegeben");
      this.addInformationToResult("lastname", "Nicht angegeben");
    }
  }
  getSalaryWish() {
    this.addInformationToResult("salary", "Nicht angegeben");
  }
  getJobTitle() {
    const titleElement = document.querySelector("#main h1").parentNode.parentNode.lastElementChild;
    if (titleElement) {
      const jobTitle = titleElement.innerText.replace(/<(.|\n)*?>/g, "").split("\n")[0].trim();
      this.addInformationToResult("currentJob", jobTitle);
    } else {
      this.addInformationToResult("currentJob", "Nicht angegeben");
    }
  }
  getJobExperience() {
    this.addInformationToResult("experience", "Nicht gefunden");
  }
  getEducation() {
    const mainContainer = document.getElementById("main");
    const headline = [...mainContainer.querySelectorAll("h2 span")].filter((element) => element.innerText.includes("Ausbildung")).at(0);
    if (headline) {
      const section = headline.closest("section");
      const entry = [...section.querySelector(".pvs-list__outer-container > ul").children].at(0);
      const entryText = entry.querySelector("div div:last-of-type div a > span:first-of-type").textContent.trim();
      this.addInformationToResult("education", entryText);
    } else {
      this.addInformationToResult("education", "Nicht angegeben");
    }
  }
  getLocation() {
    const locationElement = document.querySelector("#main h1").parentElement.parentElement.parentElement.lastElementChild.querySelector("span:first-of-type");
    if (locationElement) {
      let locationString = locationElement.innerText.replace(/<(.|\n)*?>/g, "").split("\n")[0].trim();
      if (locationString.includes(",")) {
        locationString = locationString.split(",").at(0);
      }
      this.addInformationToResult("city", locationString);
    } else {
      this.addInformationToResult("city", "Nicht angegeben");
    }
  }
}
class XingScraper extends Scraper {
  constructor() {
    super(...arguments);
    __publicField(this, "userData", {});
  }
  getName() {
    const nameElement = document.querySelector('#XingIdModule *[data-xds="Hero"]');
    if (!nameElement) {
      throw new Error("Error");
    }
    const name = nameElement.innerText.replace(/<(.|\n)*?>/g, "").split("\n")[0].trim();
    const nameSplit = name.split(" ");
    const nachname = nameSplit.pop();
    const vorname = typeof nameSplit === "string" ? nameSplit : nameSplit.join(" ");
    this.addInformationToResult("firstname", vorname);
    this.addInformationToResult("lastname", nachname);
  }
  getSalaryWish() {
    const allH2Array = [...document.querySelectorAll("h2")];
    const salaryHeadline = allH2Array.filter((element) => element.textContent.includes("Gehaltsvorstellung"));
    if (salaryHeadline.length > 0) {
      const salaryHeadlineSibling = salaryHeadline[0].nextElementSibling;
      const salaryWish = salaryHeadlineSibling.textContent;
      this.addInformationToResult("salary", salaryWish);
    } else {
      this.addInformationToResult("salary", "Nicht angegeben");
    }
  }
  getJobTitle() {
    const jobTitleString = document.querySelector('#XingIdModule *[data-xds="Hero"]').parentElement.nextElementSibling.querySelector("section p").textContent.split(",");
    if (jobTitleString) {
      let jobTitle = jobTitleString[1];
      if (jobTitleString.includes("Student")) {
        jobTitle = jobTitleString[0] + " " + jobTitleString[1];
      }
      this.addInformationToResult("currentJob", jobTitle.trim());
    } else {
      throw new Error("Error");
    }
  }
  getJobExperience() {
    const section = document.getElementById("ProfileTimelineModule");
    const headline = [...section.querySelectorAll('*[data-xds="Headline"]')].filter((element) => element.innerText.includes("Berufliche Stationen")).at(0);
    const ersteStationen = [...headline.parentNode.querySelectorAll(":scope > div")];
    const mehrAnzeigenStationen = [...headline.parentNode.nextSibling.querySelectorAll('*[data-qa="bucket"]:first-child > div')];
    let jobDuration = [];
    ersteStationen.forEach((element) => {
      const durationElement = element.querySelector('p[data-xds="BodyCopy"]');
      if (durationElement) {
        const durationElementSibling = durationElement.nextElementSibling;
        if (durationElementSibling) {
          jobDuration.push(durationElementSibling.innerText);
        }
      }
    });
    if (mehrAnzeigenStationen.length > 0) {
      if (!mehrAnzeigenStationen.at(0).parentElement.querySelector("h2").textContent.includes("Studium")) {
        mehrAnzeigenStationen.forEach((element) => {
          const durationElement = element.querySelector('p[data-xds="BodyCopy"]');
          if (durationElement) {
            const durationElementSibling = durationElement.nextElementSibling;
            if (durationElementSibling) {
              jobDuration.push(durationElementSibling.innerText);
            }
          }
        });
      }
    }
    const extractedYearsAsMonths = this.extractYearsAsMonths(jobDuration.join(" "));
    const extractedMonths = this.extractMonths(jobDuration.join(" "));
    const experience = extractedYearsAsMonths.concat(extractedMonths).reduce((partialSum, a) => partialSum + a, 0);
    this.addInformationToResult("experience", this.getYearsString(experience));
  }
  getEducation() {
    const section = document.getElementById("ProfileTimelineModule");
    const headline = [...section.querySelectorAll('*[data-xds="Headline"]')].filter((element) => element.innerText.includes("Studium")).at(0);
    if (headline) {
      const education = headline.nextElementSibling.querySelector("h2").innerText;
      this.addInformationToResult("education", education);
    } else {
      this.addInformationToResult("education", "Nicht angegeben");
    }
  }
  getLocation() {
    const locationPin = document.querySelector('*[data-xds="IconLocationPin"]');
    if (!locationPin) {
      throw new Error("Error");
    }
    const locationString = locationPin.parentNode.lastElementChild.textContent;
    this.addInformationToResult("city", locationString);
  }
  addInformationToResult(key, info) {
    this.userData[key] = info;
  }
  insertAfter(newNode, referenceNode) {
    if (referenceNode && referenceNode.parentNode) {
      referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }
  }
  extractYearsAsMonths(string) {
    const regexp = /(\d{0,2}) Jahr/g;
    const matches = string.matchAll(regexp);
    let months = [];
    for (const match of matches) {
      months.push(Number(match[1]) * 12);
    }
    return months;
  }
  extractMonths(string) {
    const regexp = /(\d{0,2}) Monat/g;
    const matches = string.matchAll(regexp);
    let months = [];
    for (const match of matches) {
      months.push(Number(match[1]));
    }
    return months;
  }
  getYearsString(monthCount) {
    function getPlural(number, word) {
      return number === 1 && word.one || word.other;
    }
    let months = { one: "Monat", other: "Monate" }, years = { one: "Jahr", other: "Jahre" }, m = monthCount % 12, y = Math.floor(monthCount / 12), result = [];
    y && result.push(y + " " + getPlural(y, years));
    m && result.push(m + " " + getPlural(m, months));
    return result.join(" und ");
  }
}
class Controller {
  constructor() {
    if (this.xing) {
      console.log("Xing detected");
      const xingScraper = new XingScraper();
      xingScraper.scrape($('*[data-qa="more-button"]'));
    }
    if (this.linkedIn) {
      console.log("LinkedIn detected");
      const linkedinScraper = new LinkedinScraper();
      linkedinScraper.scrape($('li-icon[type="bell-outline"]').parentElement.parentElement);
    }
  }
  get xing() {
    return this.detectWebsite.includes("xing");
  }
  get linkedIn() {
    return this.detectWebsite.includes("linkedin");
  }
  get detectWebsite() {
    return window.location.href;
  }
}
jQuery(document).ready(($2) => {
  new Controller();
});
