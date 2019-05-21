// var http = require("http");

function openTab(evt, tabName) {
  var i, x, tablinks;
  x = document.getElementsByClassName("content-tab");
  for (i = 0; i < x.length; i++) {
      x[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tab");
  for (i = 0; i < x.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" is-active", "");
  }
  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.className += " is-active";
}

function signup() {
  var x = document.getElementById("signup").elements;
  var count = 0;
  for(var i = 0; i < x.length; i++){
    if (x[i].value.length > 0) {
      count++;
    }
  }
  if (count < 6) {
    document.getElementById("warn").innerHTML = "All fields must be completed."
  } else {
    post_signup();
  }
} 

function post_signup() {
  var inputs = document.getElementById("signup").elements;
  var payload = {
    fname: inputs[0].value,
    lname: inputs[1].value,
    email1: inputs[2].value,
    email2: inputs[3].value,
    pass1: inputs[4].value,
    pass2: inputs[5].value
  }
  var httpreq = new XMLHttpRequest();
  httpreq.open("POST", "/signup", true);
  httpreq.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  httpreq.onload = function () {
    // do something to response
    console.log(this.responseText);
  };
  httpreq.send(JSON.stringify(payload));
}