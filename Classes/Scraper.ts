import IProfile from '../Interfaces/IProfile';
import Toast from './Toast';

export default abstract class Scraper {
    userData: IProfile;
    moreButton: HTMLElement;
    toast = new Toast(5000);

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
            document.execCommand('copy');
            this.toast.show('Copying to clipboard was successful!');
        } catch (err) {
            this.toast.show('Could not copy text!');
        }

        document.body.removeChild(textArea);
    }

    protected copyTextToClipboard(text: string): void {
        if (!navigator.clipboard) {
            this.fallbackCopyTextToClipboard(text);
            return;
        }
        navigator.clipboard.writeText(text).then(
            () => {
                this.toast.show('Copying to clipboard was successful!');
            },
            () => {
                this.toast.show('Could not copy text!');
            }
        );
    }

    protected insertAfter(newNode: Element, referenceNode: Element): void {
        if (referenceNode && referenceNode.parentNode) {
            referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
        }
    }
}
