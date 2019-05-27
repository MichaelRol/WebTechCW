"use strict";

function getposts(bar) {
    document.getElementById("posts").className = "modal is-active";
    var payload = {
        barname: bar
    }
    var httpreq = new XMLHttpRequest();
    httpreq.open("POST", "/load_posts_by_bar");
    httpreq.setRequestHeader('Content-type', 'application/JSON');
    httpreq.onload = function () {
        try {
            var posts = JSON.parse(this.response);
            console.log(posts);
            document.getElementById("bartitle").innerHTML = bar;
            document.getElementById("listposts").innerHTML = "";
            for (var i = 0; i < posts.length; ++i) {
                loadposts(posts[i].picURL, posts[i].location, posts[i].comment);
            }
        } catch (err) {
            window.location.replace("/error");
        }
    };
    httpreq.send(JSON.stringify(payload));
    httpreq.end();
}

function closeposts() {
    document.getElementById("posts").className = "modal";
}