import Scraper from './Scraper';
import IProfile from '../Interfaces/IProfile';

export default class XingScraper extends Scraper {
    userData = {} as IProfile;

    getName(): void {
        const nameElement: HTMLElement | null = document.querySelector('#XingIdModule *[data-xds="Hero"]');
        if (!nameElement) {
            throw new Error('Error');
        }
        const name = nameElement.innerText
            .replace(/<(.|\n)*?>/g, '')
            .split('\n')[0]
            .trim();
        const nameSplit = name.split(' ');
        const nachname: string = nameSplit.pop();
        const vorname: string = typeof nameSplit === 'string' ? nameSplit : nameSplit.join(' ');

        this.addInformationToResult('firstname', vorname);
        this.addInformationToResult('lastname', nachname);
    }

    getSalaryWish(): void {
        const allH2Array = [...document.querySelectorAll('h2')];
        const salaryHeadline = allH2Array.filter((element) => element.textContent.includes('Gehaltsvorstellung'));
        if (salaryHeadline.length > 0) {
            const salaryHeadlineSibling = salaryHeadline[0].nextElementSibling;
            const salaryWish = salaryHeadlineSibling.textContent;
            this.addInformationToResult('salary', salaryWish);
        } else {
            this.addInformationToResult('salary', 'Nicht angegeben');
        }
    }

    getJobTitle(): void {
        const jobTitleString = document
            .querySelector('#XingIdModule *[data-xds="Hero"]')
            .parentElement.nextElementSibling.querySelector('section p')
            .textContent.split(',');
        if (jobTitleString) {
            let jobTitle = jobTitleString[1];
            if (jobTitleString.includes('Student')) {
                jobTitle = jobTitleString[0] + ' ' + jobTitleString[1];
            }
            this.addInformationToResult('currentJob', jobTitle.trim());
        } else {
            throw new Error('Error');
        }
    }

    getJobExperience(): void {
        const section = document.getElementById('ProfileTimelineModule');
        const headline = [...section.querySelectorAll('*[data-xds="Headline"]')]
            .filter((element: HTMLElement) => element.innerText.includes('Berufliche Stationen'))
            .at(0);
        const ersteStationen = [...headline.parentNode.querySelectorAll(':scope > div')];
        const mehrAnzeigenStationen = [...(headline.parentNode.nextSibling as HTMLElement).querySelectorAll('*[data-qa="bucket"]:first-child > div')];
        let jobDuration = [];
        ersteStationen.forEach((element) => {
            const durationElement: HTMLElement = element.querySelector('p[data-xds="BodyCopy"]');
            if (durationElement) {
                const durationElementSibling = durationElement.nextElementSibling as HTMLElement;
                if (durationElementSibling) {
                    jobDuration.push(durationElementSibling.innerText);
                }
            }
        });
        if (mehrAnzeigenStationen.length > 0) {
            if (!mehrAnzeigenStationen.at(0).parentElement.querySelector('h2').textContent.includes('Studium')) {
                mehrAnzeigenStationen.forEach((element) => {
                    const durationElement: HTMLElement = element.querySelector('p[data-xds="BodyCopy"]');
                    if (durationElement) {
                        const durationElementSibling = durationElement.nextElementSibling as HTMLElement;
                        if (durationElementSibling) {
                            jobDuration.push(durationElementSibling.innerText);
                        }
                    }
                });
            }
        }
        const extractedYearsAsMonths = this.extractYearsAsMonths(jobDuration.join(' '));
        const extractedMonths = this.extractMonths(jobDuration.join(' '));
        const experience = extractedYearsAsMonths.concat(extractedMonths).reduce((partialSum, a) => partialSum + a, 0);
        this.addInformationToResult('experience', this.getYearsString(experience));
    }

    getEducation(): void {
        const section = document.getElementById('ProfileTimelineModule');
        const headline = [...section.querySelectorAll('*[data-xds="Headline"]')].filter((element: HTMLElement) => element.innerText.includes('Studium')).at(0);
        if (headline) {
            const education = headline.nextElementSibling.querySelector('h2').innerText;
            this.addInformationToResult('education', education);
        } else {
            this.addInformationToResult('education', 'Nicht angegeben');
        }
    }

    getLocation(): void {
        const locationPin = document.querySelector('*[data-xds="IconLocationPin"]');
        if (!locationPin) {
            throw new Error('Error');
        }
        const locationString = locationPin.parentNode.lastElementChild.textContent;
        this.addInformationToResult('city', locationString);
    }

    addInformationToResult(key: string, info: string): void {
        this.userData[key] = info;
    }

    insertAfter(newNode: Element, referenceNode: Element): void {
        if (referenceNode && referenceNode.parentNode) {
            referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
        }
    }

    extractYearsAsMonths(string: string): number[] {
        const regexp = /(\d{0,2}) Jahr/g;
        const matches = string.matchAll(regexp);
        let months = [];
        for (const match of matches) {
            months.push(Number(match[1]) * 12);
        }
        return months;
    }

    extractMonths(string: string): number[] {
        const regexp = /(\d{0,2}) Monat/g;
        const matches = string.matchAll(regexp);
        let months = [];
        for (const match of matches) {
            months.push(Number(match[1]));
        }
        return months;
    }

    getYearsString(monthCount: number): string {
        function getPlural(number, word) {
            return (number === 1 && word.one) || word.other;
        }

        let months = { one: 'Monat', other: 'Monate' },
            years = { one: 'Jahr', other: 'Jahre' },
            m = monthCount % 12,
            y = Math.floor(monthCount / 12),
            result = [];

        y && result.push(y + ' ' + getPlural(y, years));
        m && result.push(m + ' ' + getPlural(m, months));
        return result.join(' und ');
    }
}
