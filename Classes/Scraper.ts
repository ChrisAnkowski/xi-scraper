import IProfile from '../Interfaces/IProfile';
import Toast from './Toast';

export default abstract class Scraper {
    userData: IProfile;
    moreButton: HTMLElement;

    constructor() {
        const toast = new Toast(1000);
        toast.show('test');
    }

    public scrape(moreButton: HTMLElement): void {
        this.userData = {} as IProfile;
        this.moreButton = moreButton;
        this.addScrapeButton();
    }

    protected addScrapeButton(): void {
        const button = document.createElement('button');
        button.innerText = 'Profilinformationen kopieren';
        button.onclick = this.scrapeInformation.bind(this);
        this.insertAfter(button, this.moreButton);
    }

    protected scrapeInformation(): void {
        this.getName();
        this.getSalaryWish();
        this.getJobTitle();
        this.getJobExperience();
        this.getEducation();
        this.getLocation();

        this.copyTextToClipboard(JSON.stringify(this.userData));
    }

    protected abstract getName(): void;

    protected abstract getSalaryWish(): void;

    protected abstract getJobTitle(): void;

    protected abstract getJobExperience(): void;

    protected abstract getEducation(): void;

    protected abstract getLocation(): void;

    protected addInformationToResult(key: string, info: string): void {
        this.userData[key] = info;
    }

    protected fallbackCopyTextToClipboard(text: string): void {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            const successful = document.execCommand('copy');
            const msg = successful ? 'successful' : 'unsuccessful';
            console.log('Fallback: Copying command was ' + msg);
        } catch (err) {
            console.error('Fallback: Oops, unable to copy', err);
        }

        document.body.removeChild(textArea);
    }

    protected copyTextToClipboard(text: string): void {
        if (!navigator.clipboard) {
            this.fallbackCopyTextToClipboard(text);
            return;
        }
        navigator.clipboard.writeText(text).then(
            function () {
                console.log('Async: Copying to clipboard was successful!');
            },
            function (err) {
                console.error('Async: Could not copy text: ', err);
            }
        );
    }

    protected insertAfter(newNode: Element, referenceNode: Element): void {
        if (referenceNode && referenceNode.parentNode) {
            referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
        }
    }
}
