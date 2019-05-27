"use strict";
async function loadposts(src, location, caption) {
    var post;
    var xhr= new XMLHttpRequest();
    xhr.open("GET", "locationposts.html", true);
    xhr.onreadystatechange= function() {
        if (this.readyState!==4) return;
        if (this.status!==200) return;
        post = this.responseText;
        post = post.replace("$imagehere$", src);
        post = post.replace("$locationhere$", location);
        post = post.replace("$captionhere$", caption);
        document.getElementById("listposts").innerHTML += post;
    };
    xhr.send();
}