import LinkedinScraper from './LinkedinScraper';
import XingScraper from './XingScraper';

export default class Controller {
    constructor() {
        if (this.xing) {
            console.log('Xing detected');
            const xingScraper = new XingScraper();
            // @ts-ignore
            xingScraper.scrape($('*[data-qa="more-button"]'));
        }

        if (this.linkedIn) {
            console.log('LinkedIn detected');
            const linkedinScraper = new LinkedinScraper();
            // @ts-ignore
            linkedinScraper.scrape($('li-icon[type="bell-outline"]').parentElement.parentElement);
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
