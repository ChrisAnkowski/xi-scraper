import LinkedinScraper from './LinkedinScraper';
import XingScraper from './XingScraper';

export default class Controller {
    constructor() {
        if (this.xing) {
            const xingScraper = new XingScraper();
            xingScraper.scrape(document.querySelector('*[data-qa="more-button"]'));
        }

        if (this.linkedIn) {
            const linkedinScraper = new LinkedinScraper();
            linkedinScraper.scrape(document.querySelector('li-icon[type="bell-outline"]').parentElement.parentElement);
        }
    }

    get xing() {
        return this.detectWebsite.includes('xing');
    }

    get linkedIn() {
        return this.detectWebsite.includes('linkedin');
    }

    get detectWebsite() {
        return window.location.href;
    }
}
