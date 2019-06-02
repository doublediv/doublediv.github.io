import _ from "lodash";
import './style.css';
import imgPath from './ximg01.png';
import Data from "./test.json"
import printMe from "./print.js";

function component() {
    let element = document.createElement("div");
    element.innerHTML = _.join(["Hello", "webpack"], ' ');
    element.classList.add("hello");

    let btn = document.createElement("button");

    btn.innerHTML = "Click me and check the console!"
    btn.onclick = printMe;

    element.appendChild(btn);

    let img = new Image();
    img.src = imgPath;
    element.appendChild(img);
    console.log(Data)
    return element;
}
document.body.appendChild(component());
