export default class Toast {
    toast = null;
    timeout = 0;

    constructor(timeout: number) {
        this.timeout = timeout;
        this.injectStyle();
    }

    public show(message: string, type: 'error' | 'success' = 'error') {
        this.toast = document.createElement('div');
        this.toast.classList.add('toast');
        this.toast.classList.add('toast-' + type);
        this.toast.onclick = this.close.bind(this);
        this.toast.textContent = message;
        document.body.appendChild(this.toast);
        setTimeout(() => {
            this.toast.classList.add('toast-show');
        }, 100);

        if (this.timeout > 0) {
            setTimeout(() => {
                this.toast.classList.remove('toast-show');
            }, this.timeout);
        }
    }

    public injectStyle() {
        const style = document.createElement('style');
        style.textContent = `
            .toast {
              display: flex;
              align-items: center;
              position: fixed;
              top: 80px;
              right: -500px;
              border-radius: 5px;
              padding: 1rem 1.5rem;
              opacity: 0%;
              transition: all 0.5s linear;
              z-index: 99999;
            }
            
            .toast-error {
              background-color: #FF4136;
              color: #800600;
            }
            
            .toast-success {
              background-color: #2ECC40;
              color: #0e3e14;
            }
            
            .toast-show {
              right: 10px;
              opacity: 100%;
            }
        `;
        document.head.appendChild(style);
    }

    public close() {
        this.toast.classList.remove('toast-show');
        setTimeout(() => {
            this.toast.remove();
        }, 1000);
    }
}
