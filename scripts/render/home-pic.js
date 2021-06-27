export default class homePic extends HTMLElement{
    constructor() {
        super();
        
        this.innerHTML = `<div class="homepicheader">
        <a href="./index.html"
          ><img src="./images/home-page/Oyasuminasai.jpg" alt="homepic" />
        </a>
      </div>`
    }
}

// window.customElements.define('home-pic', homePic)