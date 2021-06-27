export default class bottomFooter extends HTMLElement{
    constructor() {
        super();
        
        this.innerHTML = `<footer>
      Copyright © 2020 Justin Yee | <a href="#">Sitemap</a> |
      <a href="#"> Acknowledgements</a> | <a href="#"> Contact</a> |
      <a href="#"> Other</a>
    </footer>`
    }
}

// window.customElements.define('bottom-footer', bottomFooter)