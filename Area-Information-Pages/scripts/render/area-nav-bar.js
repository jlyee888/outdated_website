export default class areaNavBar extends HTMLElement{
    constructor() {
        super();
        
        this.innerHTML = `<nav>
            <ul>
                <li>
                    <a href="#">Irvine, OC, Cleveland
                        NF<i class="arrow down"></i></a>
                </li>
                <li>
                    <a href="#">Mt Baldy/Cucamonga Wilderness<i class="arrow down"></i></a>
                </li>
                <li>
                    <a href="#">Angeles NF<i class="arrow down"></i></a>
                </li>
                <li>
                    <a href="#">San Bernardino NF/Gorgonio Wild<i class="arrow down"></i></a>
                </li>
                <li>
                    <a href="#">San Jacinto NF<i class="arrow down"></i></a>
                </li>
                <li>
                    <a href="#">Hike Log<i class="arrow down"></i></a>
                </li>
                <li>
                    <a href="#">Other<i class="arrow down"></i></a>
                </li>
            </ul>
        </nav>`
    }
}