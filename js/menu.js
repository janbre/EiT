//document.getElementById("nav-trigger").addEventListener("click", displayMenu);

var clicked = false;
var content = document.getElementsByClassName("site-wrap")[0];
var trigger = document.getElementById("nav-trigger");
var label = document.getElementById("nav-label");

function displayMenu () {
    clicked = !clicked;
    if (clicked) {
        content.style.left = "200px";
        //content.style.box-shadow = "0 0 5px 5x rgba(0,0,0,0.5)";
        trigger.style.left = "215px";
        label.style.left = "215px";
    } else {
        content.style.left = "0px";
        trigger.style.left = "15px";
        label.style.left = "15px";
    }        
}

function hideMenu() {
    clicked = !clicked;
    content.style.left = "0px";
    trigger.style.left = "15px";
    label.style.left = "15px";
}

