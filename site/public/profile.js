"use strict";

get_profile();

function get_profile() {
    var httpreq = new XMLHttpRequest();
    httpreq.open("GET", "/load_profile", true);
    httpreq.setRequestHeader('Content-type', 'application/JSON');
    httpreq.onload = function () {
        if (this.responseText == "missing") {
            window.location.replace("/missing-profile");
        } else {
            document.getElementById("name").innerHTML = JSON.parse(this.response)['fname'] + " " + JSON.parse(this.response)['lname'];
        }

            
    };
    httpreq.send();

}

function get_posts() {

}