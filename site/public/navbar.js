"use strict";
function loadnav() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'navbar.html', true);
    xhr.onreadystatechange = function () {
        if (this.readyState !== 4) {
            return;
        }
        if (this.status !== 200) {
            return; // or whatever error handling you want
        }
        document.getElementById('navbar').innerHTML = this.responseText;
    };
    xhr.send();
}

function logout() {
    var httpreq = new XMLHttpRequest();
    httpreq.open("GET", "/logout", true);
    httpreq.setRequestHeader('Content-type', 'application/JSON');
    httpreq.send();
}

function mobilenavbaropen() {
    if (document.getElementById("burger").className === "navbar-burger") {
        document.getElementById("burger").className = "navbar-burger is-active";
        document.getElementById("mainnavbar").className = "navbar-menu is-active";
        document.getElementById("myprofile").style.width = "100%";
        document.getElementById("bars").style.width = "100%";
        document.getElementById("drink").style.width = "100%";
        document.getElementById("logout").style.width = "100%";
    }
    else {
        document.getElementById("burger").className = "navbar-burger";
        document.getElementById("mainnavbar").className = "navbar-menu";
        document.getElementById("myprofile").style.width = "30%";
        document.getElementById("bars").style.width = "30%";
        document.getElementById("drink").style.width = "30%";
        document.getElementById("logout").style.width = "10%";
    }
}