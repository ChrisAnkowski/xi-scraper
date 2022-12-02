export default class Toast {
    toast = null;

    constructor() {
        this.injectStyle();
    }

    public show(message) {
        console.log('show');
        this.toast = document.createElement('div');
        this.toast.classList.add('toast');
        this.toast.onclick = this.close;
        this.toast.textContent = message;
        this.toast.classList.remove('toast-show');
        console.log(this.toast);
    }

    public injectStyle() {
        const style = document.createElement('style');
        style.textContent = `
            .toast {
              display: flex;
              align-items: center;
              position: absolute;
              top: 10px;
              right: -500px;
              background-color: darkgray;
              border-radius: 5px;
              padding: 1rem 1.5rem;
              opacity: 0%;
              transition: all 0.5s linear;
            }
            
            .toast-show {
              right: 10px;
              opacity: 100%;
            }
        `;
        document.head.appendChild(style);
    }

    private close() {
        this.toast.classList.remove('toast-show');
        setTimeout(() => {
            this.toast.remove();
        }, 1000);
    }
}
