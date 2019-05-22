"use strict";
var loaded = 0;
function tilt(item) {
    var obj = document.getElementById(item);
    obj.style.transform = "rotate(20deg)";
}

function untilt(item) {
    var obj = document.getElementById(item);
    obj.style.transform = "rotate(0deg)";
}

function playanim() {
    if (loaded === 0) {
        loaded = 1;
        spirit.loadAnimation({ autoPlay: true, loop: true, yoyo: true, container: document.getElementById("1"), path:       './Images/smoke.json' })
        .then(timeline => {
            window.onmousemove = ({ clientX }) => {
            timeline.progress(clientX / window.innerWidth)
            }
        })
    }
}

function selectbase(item) {
    console.log(item);
    document.getElementById("choosebase").style.visibility = "hidden";
    document.getElementById("choosetaste").style.visibility = "visible";
    document.getElementById("name").innerHTML = "What flavour are you going for?";
}

