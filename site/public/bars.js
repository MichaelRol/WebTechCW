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
            if (posts.length === 0) {
                document.getElementById("listposts").innerHTML = "<h1>There's no post for this bar yet. Be the first to post!<\h1>";
            }
        } catch (err) {
            window.location.replace("/error");
        }
    };
    httpreq.send(JSON.stringify(payload));
}

function closeposts() {
    document.getElementById("posts").className = "modal";
}