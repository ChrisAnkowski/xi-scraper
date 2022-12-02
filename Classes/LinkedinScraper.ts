import IProfile from '../Interfaces/IProfile';
import Scraper from './Scraper';

export default class LinkedinScraper extends Scraper {
    userData = {} as IProfile;

    getName(): void {
        const nameElement: HTMLElement | null = document.querySelector('#main h1');
        if (nameElement !== null) {
            const name = nameElement.innerText
                .replace(/<(.|\n)*?>/g, '')
                .split('\n')[0]
                .trim();
            const nameSplit = name.split(' ');
            const nachname: string = nameSplit.pop();
            const vorname: string = typeof nameSplit === 'string' ? nameSplit : nameSplit.join(' ');

            this.addInformationToResult('firstname', vorname);
            this.addInformationToResult('lastname', nachname);
        } else {
            this.addInformationToResult('firstname', 'Nicht gefunden');
            this.addInformationToResult('lastname', 'Nicht gefunden');
        }
    }

    getSalaryWish(): void {
        this.addInformationToResult('salary', 'Nicht angegeben');
    }

    getJobTitle(): void {
        const titleElement: Element = document.querySelector('#main h1').parentNode.parentNode.lastElementChild;
        if (titleElement !== null) {
            const jobTitle = (titleElement as HTMLElement).innerText
                .replace(/<(.|\n)*?>/g, '')
                .split('\n')[0]
                .trim();
            this.addInformationToResult('currentJob', jobTitle);
        } else {
            this.addInformationToResult('currentJob', 'Nicht angegeben');
        }
    }

    getJobExperience(): void {
        this.addInformationToResult('experience', 'Nicht gefunden');
    }

    getEducation(): void {
        const mainContainer = document.getElementById('main');
        const headline = [...mainContainer.querySelectorAll('h2 span')].filter((element: HTMLElement) => element.innerText.includes('Ausbildung')).at(0);

        if (headline) {
            const section = headline.closest('section');
            const entry = [...section.querySelector('.pvs-list__outer-container > ul').children].at(0);
            const entryText = entry.querySelector('div div:last-of-type div a > span:first-of-type').textContent.trim();
            this.addInformationToResult('education', entryText);
        } else {
            this.addInformationToResult('education', 'Nicht gefunden');
        }
    }

    getLocation(): void {
        const locationElement: Element | null = document
            .querySelector('#main h1')
            .parentElement.parentElement.parentElement.lastElementChild.querySelector('span:first-of-type');
        if (locationElement !== null) {
            const locationString = (locationElement as HTMLElement).innerText
                .replace(/<(.|\n)*?>/g, '')
                .split('\n')[0]
                .trim();
            this.addInformationToResult('city', locationString);
        } else {
            this.addInformationToResult('city', 'Nicht gefunden');
        }
    }
}
