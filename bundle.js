let userData = {};
ready(() => {
  const button = document.createElement("button");
  button.innerText = "Profilinformationen kopieren";
  button.onclick = scrapeInformation;
  const moreButton = document.querySelector('*[data-qa="more-button"]');
  insertAfter(button, moreButton);
});

function scrapeInformation() {
  getName();
  getSalaryWish();
  getJobTitle();
  getJobExperience();
  getEducation();
  getLocation();

  copyTextToClipboard(JSON.stringify(userData));
}

function getLocation() {
  const locationPin = document.querySelector('*[data-xds="IconLocationPin"]');
  const locationString = locationPin.parentNode.lastElementChild.textContent;
  addInformationToResult("city", locationString);
}

function extractYearsAsMonths(string) {
  const regexp = /(\d{0,2}) Jahr/g;
  const matches = string.matchAll(regexp);
  let months = [];
  for (const match of matches) {
    months.push(Number(match[1]) * 12);
  }
  return months;
}

function extractMonths(string) {
  const regexp = /(\d{0,2}) Monat/g;
  const matches = string.matchAll(regexp);
  let months = [];
  for (const match of matches) {
    months.push(Number(match[1]));
  }
  return months;
}

function getEducation() {
  const section = document.getElementById("ProfileTimelineModule");
  const headline = [...section.querySelectorAll('*[data-xds="Headline"]')]
    .filter((element) => element.innerText.includes("Studium"))
    .at(0);
  const education = headline.nextElementSibling.querySelector("h2").innerText;
  addInformationToResult("education", education);
}

function getJobExperience() {
  const section = document.getElementById("ProfileTimelineModule");
  const headline = [...section.querySelectorAll('*[data-xds="Headline"]')]
    .filter((element) => element.innerText.includes("Berufliche Stationen"))
    .at(0);
  const ersteStationen = [
    ...headline.parentNode.querySelectorAll(":scope > div"),
  ];
  const mehrAnzeigenStationen = [
    ...headline.parentNode.nextSibling.querySelectorAll(
      '*[data-qa="bucket"]:first-child > div'
    ),
  ];
  let jobDuration = [];
  ersteStationen.forEach((element) => {
    jobDuration.push(
      element.querySelector('p[data-xds="BodyCopy"]').nextElementSibling
        .innerText
    );
  });
  if (!mehrAnzeigenStationen.at(0).parentElement.querySelector('h2').textContent.includes('Studium')) {
    mehrAnzeigenStationen.forEach((element) => {
      jobDuration.push(
        element.querySelector('p[data-xds="BodyCopy"]').nextElementSibling
          .innerText
      );
    });
  }
  const extractedYearsAsMonths = extractYearsAsMonths(jobDuration.join(" "));
  const extractedMonths = extractMonths(jobDuration.join(" "));
  const experience = extractedYearsAsMonths
    .concat(extractedMonths)
    .reduce((partialSum, a) => partialSum + a, 0);
  addInformationToResult("experience", getYearsString(experience));
}

function getYearsString(monthCount) {
  function getPlural(number, word) {
    return (number === 1 && word.one) || word.other;
  }

  var months = { one: "Monat", other: "Monate" },
    years = { one: "Jahr", other: "Jahre" },
    m = monthCount % 12,
    y = Math.floor(monthCount / 12),
    result = [];

  y && result.push(y + " " + getPlural(y, years));
  m && result.push(m + " " + getPlural(m, months));
  return result.join(" und ");
}

function getSalaryWish() {
  const allH2Array = [...document.querySelectorAll("h2")];
  const salaryHeadline = allH2Array.filter((element) =>
    element.textContent.includes("Gehaltsvorstellung")
  );
  if (salaryHeadline.length > 0) {
    const salaryHeadlineSibling = salaryHeadline[0].nextElementSibling;
    const salaryWish = salaryHeadlineSibling.textContent;
    addInformationToResult("salary", salaryWish);
  } else {
    addInformationToResult("salary", "Nicht angegeben");
  }
}

function getName() {
  const name = document
    .querySelector('#XingIdModule *[data-xds="Hero"]')
    .innerText.replace(/<(.|\n)*?>/g, "")
    .split("\n")[0]
    .trim();
  const nameSplit = name.split(" ");
  let nachname = nameSplit.pop();
  let vorname = typeof nameSplit === "string" ? nameSplit : nameSplit.join(" ");
  addInformationToResult("firstname", vorname);
  addInformationToResult("lastname", nachname);
}

function getJobTitle() {
  const jobTitleString = document
    .querySelector('#XingIdModule *[data-xds="Hero"]')
    .parentElement.nextElementSibling.querySelector("section p")
    .textContent.split(",");
  let jobTitle = jobTitleString[1];
  if (jobTitleString.includes("Student")) {
    jobTitle = jobTitleString[0] + " " + jobTitleString[1];
  }
  addInformationToResult("currentJob", jobTitle.trim());
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
  if (
    document.readyState === "complete" ||
    document.readyState === "interactive"
  ) {
    setTimeout(fn, 1500);
  } else {
    document.addEventListener("DOMContentLoaded", fn);
  }
}

if (typeof Element.prototype.clearChildren === "undefined") {
  Object.defineProperty(Element.prototype, "clearChildren", {
    configurable: true,
    enumerable: false,
    value: function () {
      while (this.firstChild) this.removeChild(this.lastChild);
    },
  });
}

function fallbackCopyTextToClipboard(text) {
  var textArea = document.createElement("textarea");
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    var successful = document.execCommand("copy");
    var msg = successful ? "successful" : "unsuccessful";
    console.log("Fallback: Copying command was " + msg);
  } catch (err) {
    console.error("Fallback: Oops, unable to copy", err);
  }

  document.body.removeChild(textArea);
}

function copyTextToClipboard(text) {
  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(text);
    return;
  }
  navigator.clipboard.writeText(text).then(
    function () {
      console.log("Async: Copying to clipboard was successful!");
    },
    function (err) {
      console.error("Async: Could not copy text: ", err);
    }
  );
}
