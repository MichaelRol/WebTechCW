"use strict";
var widget;
var opened = 0;

// window.onload
window.onload = function() {
    loadnav();
};

function openwidget() {
    if (opened == 0) {
        imageuploader();
        opened = 1;
    }
    widget.open();
}

function imageuploader() {
    widget = cloudinary.createUploadWidget({ 
    cloudName: "webtech-mn16660-mr16338", uploadPreset: "userposts",
    defaultSource: "camera",
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
        if (result && result.event == "success") {
            var payload = {
                picURL: result.info.secure_url,
                location: document.getElementById("location").value,
                comment: document.getElementById("comment").value,   
            }
            var httpreq = new XMLHttpRequest();
            httpreq.open("POST", "/upload_post");
            httpreq.setRequestHeader('Content-type', 'application/JSON');
            httpreq.send(JSON.stringify(payload));
            // SUCCESS MESSAGE HERE
        }
    });
}
