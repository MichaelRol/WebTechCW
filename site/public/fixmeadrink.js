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
        spirit.loadAnimation({ autoPlay: false, loop: true, yoyo: true, container: document.getElementById("svg8"), path:       './Images/smoke.json' })
        .then(timeline => {
            window.onmousemove = ({ clientX }) => {
            timeline.progress(clientX / window.innerWidth)
            }
    })
    }
}