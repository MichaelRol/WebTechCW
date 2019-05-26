"use strict";
var widget;
var posts;
var lengthofposts;
var currentcontentsection = 0;

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
    get_profile();
    get_posts();
};

function openwidget() {
    widget.open();
}

function get_profile() {
    var httpreq = new XMLHttpRequest();
    httpreq.open("GET", "/load_profile", true);
    httpreq.setRequestHeader('Content-type', 'application/JSON');
    httpreq.onload = function () {
        try {
            var profile = JSON.parse(this.response);
            document.title = profile['fname'] + " " + profile['lname'];
            document.getElementById("name").innerHTML = profile['fname'] + " " + profile['lname'];
            document.getElementById("profile_pic").src = profile['photoURL'];
        } catch (err) {
            window.location.replace("/");
        }
    };
    httpreq.send();

}

function get_posts() {
    var httpreq2 = new XMLHttpRequest();
    httpreq2.open("GET", "/load_posts", true);
    httpreq2.setRequestHeader('Content-type', 'application/JSON');
    httpreq2.onload = function () {
        if (this.responseText == "missing") {
            document.getElementById("loadmore").style.display ="none";
        } 
        else {
            posts = JSON.parse(this.response);
            console.log(posts);
            lengthofposts = posts.length-1;
            for (var i = 0; i < lengthofposts + 1; ++i) {
                document.getElementById("postcollumn"+i).style.display = "block";
                document.getElementById("post"+i).src = posts[i].picURL;
                document.getElementById("location"+i).innerHTML = posts[i].location;
                document.getElementById("caption"+i).innerHTML = posts[i].comment;
            }
            if (lengthofposts < 4) {
                document.getElementById("loadmore").style.display ="none";
            }
        }        
    };
    httpreq2.send();

}

function load_more() {
    currentcontentsection++;
    document.getElementById("contentSection"+currentcontentsection).style.display = "block";
    for (var index = currentcontentsection*4; index < (currentcontentsection*4)+4; ++index) {
        if (posts[index]) {
            document.getElementById("postcollumn"+index).style.display = "block";
            document.getElementById("post"+index).src = posts[index].picURL;
            document.getElementById("location"+index).innerHTML = posts[index].location;
            document.getElementById("caption"+index).innerHTML = posts[index].comment;
        }
    }
    if (lengthofposts < ((currentcontentsection+1)*4)+1) {
        document.getElementById("loadmore").style.display ="none";
    }
}