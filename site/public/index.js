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

// Check string only contains letters
function all_letters(input) {
  var letters = /^[A-Za-z]+$/;
  if (input.value.match(letters)) {
    return true;
  } else {
    return false;
  }
}

// Check email address has valid format
function validate_email(email) {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email.value)) {
    return (true);
  }
  return (false);
}

// Check user DOB means they ae over 19
function over_18(dob) {
  let string_age = dob.value;
  let year = parseInt(string_age.slice(0, 4));
  let month = parseInt(string_age.slice(5, 8)) - 1;
  let day = parseInt(string_age.slice(8, 11));
  let today  = new Date();
  let age = today.getFullYear() - year;
  if (today.getMonth() < month || (today.getMonth() == month && today.getDate() < day)) {
    age--;
  }

  if (age >= 18) {
    return true;
  }
  return false;
}

// Validate signup form data
function validate_signup() {
  let x = document.getElementById("signup").elements;
  let count = 0;
  for(let i = 0; i < x.length; i++){
    if (x[i].value.length > 0) {
      count++;
    }
  }

  if (count < 7) {
    document.getElementById("warn").innerHTML = "All fields must be completed.";
  } else if (x[3].value != x[4].value) {
    document.getElementById("warn").innerHTML = "Emails do not match.";
  } else if (x[5].value != x[6].value) {
    document.getElementById("warn").innerHTML = "Passwords do not match";
  } else if (x[5].value.length < 10 || x[5].value.length > 128) {
    document.getElementById("warn").innerHTML = "Password should be between 10 and 128 characters";
  } else if (!all_letters(x[0]) || !all_letters(x[1])) {
    document.getElementById("warn").innerHTML = "Names should only contain letters";
  } else if (!validate_email(x[3])) {
    document.getElementById("warn").innerHTML = "Please enter a valid email";
  } else if (!over_18(x[2])) {
    document.getElementById("warn").innerHTML = "You must be over 18 years old to access this website";
  } else if(parseInt(x[2].value.slice(0, 4)) < 1900) {
    document.getElementById("warn").innerHTML = "Nobody is that old.";
  } else {
    post_signup();
  }
} 

// Validate signup form data
function validate_login() {
  let x = document.getElementById("login").elements;
  let count = 0;
  for(let i = 0; i < x.length; i++){
    if (x[i].value.length > 0) {
      count++;
    }
  }

  if (count < 2) {
    document.getElementById("login_warn").innerHTML = "All fields must be completed.";
  } else if (!validate_email(x[0])) {
    document.getElementById("login_warn").innerHTML = "Please enter a valid email";
  } else {
    post_login();
  }
} 


// Send POST request to server with signup details
function post_signup() {
  var inputs = document.getElementById("signup").elements;
  var payload = {
    fname: inputs[0].value,
    lname: inputs[1].value,
    dob: inputs[2].value,
    email1: inputs[3].value,
    email2: inputs[4].value,
    pass1: inputs[5].value,
    pass2: inputs[6].value
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

// Send POST request to server with login details
function post_login() {
  var inputs = document.getElementById("login").elements;
  var payload = {
    email: inputs[0].value,
    pass: inputs[1].value,
  }
  var httpreq = new XMLHttpRequest();
  httpreq.open("POST", "/login", true);
  httpreq.setRequestHeader('Content-type', 'application/JSON');
  httpreq.onload = function () {
    // do something to response
    console.log(this.responseText);
  };
  httpreq.send(JSON.stringify(payload));
}
