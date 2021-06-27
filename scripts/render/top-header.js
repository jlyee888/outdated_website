export default class topHeader extends HTMLElement{
    constructor() {
        super();
    }
    connectedCallback(){
        this.innerHTML = `<header>Welcome to my Outdoor Adventures Website!</header>`
    }
}

// window.customElements.define('top-header', topHeader)