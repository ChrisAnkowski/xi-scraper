import IProfile from '../Interfaces/IProfile';
import Scraper from './Scraper';

export default class LinkedinScraper extends Scraper {
    userData = {} as IProfile;

    getName(): void {
        console.log('getName');
    }

    getSalaryWish(): void {
        console.log('getSalaryWish');
    }

    getJobTitle(): void {
        console.log('getJobTitle');
    }

    getJobExperience(): void {
        console.log('getJobExperience');
    }

    getEducation(): void {
        console.log('getEducation');
    }

    getLocation(): void {
        console.log('getLocation');
    }
}
