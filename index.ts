// @ts-nocheck
import Controller from './Classes/Controller';

ready(() => {
    new Controller();
});

function ready(eventListener: EventListener): void {
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(eventListener, 1500);
    } else {
        document.addEventListener('DOMContentLoaded', eventListener);
    }
}
