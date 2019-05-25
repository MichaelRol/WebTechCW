"use strict";

get_profile();
let fileInp;

function upload_pic() {
    fileInp = document.querySelector('[type="file"]');
    fileInp.onchange = function(event) {
        var photo = fileInp.files[0];
        console.log(photo);
        let req = new XMLHttpRequest();
        let formData = new FormData();
    
        formData.append("photo", photo);                                
        req.open("POST", '/upload_profile_pic', true);
        req.send(formData);
     }
    fileInp.click();
  
}

function get_profile() {
    var httpreq = new XMLHttpRequest();
    httpreq.open("GET", "/load_profile", true);
    httpreq.setRequestHeader('Content-type', 'application/JSON');
    httpreq.onload = function () {
        if (this.responseText == "missing") {
            window.location.replace("/missing-profile");
        } else {
            let profile = JSON.parse(this.response);
            document.getElementById("name").innerHTML = profile['fname'] + " " + profile['lname'];
            document.getElementById("profile_pic").src = profile['photoURL'];
        }

            
    };
    httpreq.send();

}

function get_posts() {

}