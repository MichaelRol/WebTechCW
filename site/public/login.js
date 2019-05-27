"use strict";

window.onload = function() {
  // Allow enter keypress to submit login details
  document.getElementById('emailsub').onkeydown = function(e) {
    if (e.keyCode == 13) {
      validate_login();
    }
  };
  document.getElementById('passsub').onkeydown = function(e) {
    if (e.keyCode == 13) {
      validate_login();
    };
  };

  // Allow enter keypress to submit signup details
  document.getElementById('fname').onkeydown = function(e) {
    if (e.keyCode == 13) {
      validate_signup();
    }
  };
  document.getElementById('lname').onkeydown = function(e) {
    if (e.keyCode == 13) {
      validate_signup();
    }
  };
  document.getElementById('email').onkeydown = function(e) {
    if (e.keyCode == 13) {
      validate_signup();
    }
  };
  document.getElementById('cemail').onkeydown = function(e) {
    if (e.keyCode == 13) {
      validate_signup();
    }
  }; 
  document.getElementById('pass').onkeydown = function(e) {
    if (e.keyCode == 13) {
      validate_signup();
    }
  };
  document.getElementById('cpass').onkeydown = function(e) {
    if(e.keyCode == 13) {
      validate_signup();
    }
  };
};

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
    document.getElementById("warn").innerHTML = "Please enter a valid date of birth.";;
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
    // REDIRECT TO SUCCESSFUL SIGNUP PAGE
    if (JSON.parse(this.response)['success'] == true) {
       window.location.replace('/signupsuccess');
    } else {
      if (JSON.parse(this.response)['info'] == 1) {
        document.getElementById("warn").innerHTML = "Emails do not match.";
      } else if (JSON.parse(this.response)['info'] == 2) {
        document.getElementById("warn").innerHTML = "Passwords do not match";
      } else if (JSON.parse(this.response)['info'] == 3) {
        document.getElementById("warn").innerHTML = "Password should be between 10 and 128 characters";
      } else if (JSON.parse(this.response)['info'] == 4) {
        document.getElementById("warn").innerHTML = "Names should only contain letters";
      } else if (JSON.parse(this.response)['info'] == 5) {
        document.getElementById("warn").innerHTML = "Please enter a valid email";
      } else if (JSON.parse(this.response)['info'] == 6) {
        document.getElementById("warn").innerHTML = "You must be over 18 years old to access this website";
      } else if (JSON.parse(this.response)['info'] == 7) {
        document.getElementById("warn").innerHTML = "Please enter a valid date of birth.";
      } else if (JSON.parse(this.response)['info'] == 8) {
        document.getElementById("warn").innerHTML = "Email already registered. <a href='#' onclick='openTab(event,&quot;login&quot;)'>Login?</a>";

      }    
    }
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
    if (JSON.parse(this.response)['success'] == true) {
      loader();
      setTimeout(function(){
        window.location.replace("/profile");
      }, 1200);
    } else {
      document.getElementById("login_warn").innerHTML = "Email and password do not match, please try again.";
    }
  };
  httpreq.send(JSON.stringify(payload));
}
