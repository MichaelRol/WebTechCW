"use strict";

get_profile();
var widget;

// window.onload
window.onload = function() {
    widget = cloudinary.createUploadWidget({ 
    cloudName: "webtech-mn16660-mr16338", uploadPreset: "style1",
    styles: {
        palette: {
            sourceBg: "#f4f4f5",
            windowBorder: "#90a0b3",
            inactiveTabIcon: "#555a5f",
            menuIcons: "#555a5f",
            complete: "#59D259",
            error: "#cc0000",
            textLight: "#fcfffd",
            link: "#FF8383",
            window: "#FF8383",
            tabIcon: "#FFFFFF",
            textDark: "#555A5F",
            inProgress: "#FF8383",
            action: "#FFFFFF"
        },
    }  
    }, (error, result) => { 
        if (result.event == "success") {
            var payload = {
                url: result.info.secure_url,
            }
            var httprequrl = new XMLHttpRequest();
            httprequrl.open("POST", "/upload_profile_pic");
            httprequrl.setRequestHeader('Content-type', 'application/JSON');
            httprequrl.send(JSON.stringify(payload));
            document.getElementById("profile_pic").src = result.info.secure_url;
        }
    });
    loadnav();
};

function openwidget() {
    widget.open();
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