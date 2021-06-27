export default class footerContainer extends HTMLElement{
    constructor() {
        super();
        
        this.innerHTML = `<div class="footercontainer">
      <div class="mainbodycontainer"><div class="footercol1">
        <h1>Updates:</h1>
        <ul>
          <li><a href="./index.html">Home Page Created 9/23/20</a> </li>
        </ul>
        <h1>In Progress:</h1>
        <ul><li><a href="#">Irvine/OC/Cleveland NF Page</a></li></ul>
      </div>
      <div class="footercol2">

        <h1>Featured Post!</h1>
        <p>
          On Aug 28-29, my dad, brother, and I went on a backpacking trip to
          San Jacinto NF. We took South Ridge trail up to Tahquitz Peak and
          it's famous fire-lookout. Read more about it <a href="#">here</a>.
        </p>
      </div>
      <div class="footercol3">

              <h1>Featured Post!</h1>
              <p>
                On Aug 28-29, my dad, brother, and I went on a backpacking trip to
                San Jacinto NF. We took South Ridge trail up to Tahquitz Peak and
                it's famous fire-lookout. Read more about it <a href="#">here</a>.
              </p>
      </div>
      </div>
        
      </div>
    </div>`
    }
}

// window.customElements.define('footer-container', footerContainer)