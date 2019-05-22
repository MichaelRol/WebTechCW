"use strict";
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

function loader() {
    var loader1;
    loader1 = document.getElementById("loader1");
    loader1.className = "loader1 hidden";
}

function all_letters(input) {
  var letters = /^[A-Za-z]+$/;
  if (input.value.match(letters)) {
    return true;
  } else {
    return false;
  }
}

function validate_email(email) {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email.value)) {
    return (true);
  }
  return (false);
}

function validate_signup() {
  var x = document.getElementById("signup").elements;
  var count = 0;
  for(var i = 0; i < x.length; i++){
    if (x[i].value.length > 0) {
      count++;
    }
  }

  if (count < 6) {
    document.getElementById("warn").innerHTML = "All fields must be completed.";
  } else if (x[2].value != x[3].value) {
    document.getElementById("warn").innerHTML = "Emails do not match.";
  } else if (x[4].value != x[5].value) {
    document.getElementById("warn").innerHTML = "Passwords do not match";
  } else if (x[4].value.length < 10 || x[4].value.length > 128) {
    document.getElementById("warn").innerHTML = "Password should be between 10 and 128 characters";
  } else if (!all_letters(x[0]) || !all_letters(x[1])) {
    document.getElementById("warn").innerHTML = "Names should only contain letters";
  } else if (!validate_email(x[2])) {
    document.getElementById("warn").innerHTML = "Please enter a valid email";
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
  httpreq.setRequestHeader('Content-type', 'application/JSON');
  httpreq.onload = function () {
    // do something to response
    console.log(this.responseText);
  };
  httpreq.send(JSON.stringify(payload));
}
