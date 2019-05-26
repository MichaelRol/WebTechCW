// Run a node.js web server for local development of a static web site. Create a
// site folder, put server.js in it, create a sub-folder called "public", with
// at least a file "index.html" in it. Start the server with "node server.js &",
// and visit the site at the address printed on the console.
//     The server is designed so that a site will still work if you move it to a
// different platform, by treating the file system as case-sensitive even when
// it isn't (as on Windows and some Macs). URLs are then case-sensitive.
//     All HTML files are assumed to have a .html extension and are delivered as
// application/xhtml+xml for instant feedback on XHTML errors. Content
// negotiation is not implemented, so old browsers are not supported. Https is
// not supported. Add to the list of file types in defineTypes, as necessary.
let express = require("express");
let path = require("path");
const bodyParser = require('body-parser');
let fs = require("fs").promises;
let uuid = require("uuid/v4");
let bcrypt = require("bcrypt");
let sqlite = require("sqlite");
let session = require("express-session");

// For HTTPS certificates
let https = require("https");
let fs2 = require("fs");
let httpsOptions = {
    cert : fs2.readFileSync(path.join(__dirname, 'SSL', 'server.cert')),
    key : fs2.readFileSync(path.join(__dirname, 'SSL', 'server.key'))
}

// Change the port to the default 80, if there are no permission issues and port
// 80 isn't already in use. The root folder corresponds to the "/" url.
let port = 3443;
let root = "./public"
// let db = new sqlite3.Database(':memory:');
// Load the library modules, and define the global constants and variables.
// Load the promises version of fs, so that async/await can be used.
// See http://en.wikipedia.org/wiki/List_of_HTTP_status_codes.
// The file types supported are set up in the defineTypes function. 
// The paths variable is a cache of url paths in the site, to check case.
let server = express();
server.use(bodyParser.json());
server.use(session({secret:"qwertyuiop", resave:false, saveUninitialized:true}));
var staticPath = path.join(__dirname, '/public');
server.use(express.static(staticPath));
let OK = 200, NotFound = 404, BadType = 415, Error = 500;
let types, paths;
// let db = new sqlite3.Database('./db/database.db', sqlite3.OPEN_READWRITE, (err) => {
//     if (err) {
//         console.error(err.message);
//     }
//     console.log('Connected to the database.');
// });

let db;
// Start the server:
start();

// Check the site, giving quick feedback if it hasn't been set up properly.
// Start the http service. Accept only requests from localhost, for security.
// If successful, the handle function is called for each request.
async function start() {
    try {
        await fs.access(root);
        await fs.access(root + "/index.html");
        types = defineTypes();
        paths = new Set();
        paths.add("/");
        https.createServer(httpsOptions, server).listen(port, function() {
            console.log('[SERVER] STATUS: Express HTTPS server on listening on port 3443');
        });
        await init_db();
        await drop_db_users();
        await drop_db_posts();
        await create_db_users();
        await create_db_posts();
        add_user(1234, "Michael", "Rollins", "michael.rollins@hotmail.co.uk", "aisodakl3", "sadsd");
        get_all_users();
        add_post(1234, 1111, "barA", "here", "blahblah");
        get_all_posts();
    }
    catch (err) { console.log(err); process.exit(1); }
}

// ------------ DATABASE FUNCTIONS --------------

async function close_db() {
    // close the database connection
    try {
        await db.close();
    } catch (err) {
        console.log(err);
    }
}

async function drop_db_users() {
    try {
        await db.run("DROP TABLE IF EXISTS users");
    } catch (err) {
        console.log(err);
    }
}

async function drop_db_posts() {
    try {
        await db.run("DROP TABLE IF EXISTS posts");
    } catch (err) {
        console.log(err);
    }
}

async function init_db() {
    try {
        db = await sqlite.open("./database.sqlite");
    } catch (e) { console.log(e); }
}

async function create_db_users() {
    try {
        await db.run("CREATE TABLE IF NOT EXISTS users (uid PRIMARY KEY, fname, lname, email, passhash, salt, photoURL)");
        console.log("users created");
    } catch (err) {
        console.log(err);
    }
    
}

async function create_db_posts() {
    try {
        await db.run("CREATE TABLE IF NOT EXISTS posts (pid PRIMARY KEY, uid, location, picURL, comment)");
        console.log("posts created");
    } catch (err) {
        console.log(err);
    }
    
}

async function add_user(uid, fname, lname, email, passhash, salt) {
    await db.run("INSERT INTO users (uid, fname, lname, email, passhash, salt, photoURL) VALUES (?, ?, ?, ?, ?, ?, ?)", [uid, fname, lname, email, passhash, salt, "Images/profile_pics/default.png"]);
}

async function add_post(pid, uid, location, picURL, comment) {
    await db.run("INSERT INTO posts (pid, uid, location, picURL, comment) VALUES (?, ?, ?, ?, ?)", [pid, uid, location, picURL, comment]);
}

async function delete_user(uid) {
    let success = true;
    try {
        await db.run("DELETE FROM users WHERE uid = ?", uid);
    } catch (err) {
        success = false;
        console.log(err);
    }
    if (success) {
        console.log("User deleted.")
    }
}

async function get_post(pid) {
    let sql = "SELECT pid, uid, location, picURL, comment FROM posts WHERE pid = ?";

    try {
        let user = await db.get(sql, [uid]);
        return user;
    } catch (err) {
        console.log(err);
    }
}


async function get_user(uid) {
    let sql = "SELECT fname, lname, photoURL FROM users WHERE uid = ?";

    try {
        let user = await db.get(sql, [uid]);
        return user;
    } catch (err) {
        console.log(err);
    }
}

async function get_all_users() {
    let sql = `SELECT uid, fname, lname, email FROM users
           ORDER BY lname`;
 
    try {
        let users = await db.all(sql, []);
        console.log(users);
    } catch (err) {
        console.log(err);
    }
 
}

async function get_all_posts() {
    let sql = `SELECT pid, uid, location, picURL, comment FROM posts`;
 
    try {
        let users = await db.all(sql, []);
        console.log(users);
    } catch (err) {
        console.log(err);
    }
 
}

async function update_user_email(uid, email) {
    let success = true;

    try {
        await db.run("UPDATE users SET email = ? WHERE uid = ?", [email, uid]);
    } catch (err) {
        success = false;
        console.log(err);
    }
    if (success) {
        console.log("Email updated to: ", email);
    }
}

async function update_user_picture(uid, url) {
    let success = true;

    try {
        await db.run("UPDATE users SET photoURL = ? WHERE uid = ?", [url, uid]);
    } catch (err) {
        success = false;
        console.log(err);
    }
    if (success) {
        console.log("profile picture updated");
    }
}

async function update_user_password(uid, newHash, newSalt) {
    let success = true;
    try {
        await db.run("UPDATE users SET passhash = ?,   salt = ? WHERE uid = ?", [newHash, newSalt, uid]);
    } catch (err) {
        success = false;
        console.log(err);
    }  
    if (success) {
        console.log("Updated password");
    }

}

async function does_email_already_exist(email) {
    try {
        let rows = (await db.get('SELECT uid FROM users WHERE email = ?', email));
        return !(typeof rows === "undefined");
    } catch (err) {
        console.log(err);
    }
}

async function get_all_emails() {
    const emails = (await db.all("SELECT email FROM users", [])).map((row) => row.email);

    return emails;
}

// Serve a request by delivering a file.
async function handle(request, response) {
    let url = request.url;
    if (url.endsWith("/")) url = url + "index.html";
    let ok = await checkPath(url);
    if (! ok) return fail(response, NotFound, "URL not found (check case)");
    let type = findType(url);
    if (type == null) return fail(response, BadType, "File type not supported");
    let file = root + url;
    let content = await fs.readFile(file);
    deliver(response, type, content);
}

// Check if a path is in or can be added to the set of site paths, in order
// to ensure case-sensitivity.
async function checkPath(path) {
    if (! paths.has(path)) {
        let n = path.lastIndexOf("/", path.length - 2);
        let parent = path.substring(0, n + 1);
        let ok = await checkPath(parent);
        if (ok) await addContents(parent);
    }
    return paths.has(path);
}

// Add the files and subfolders in a folder to the set of site paths.
async function addContents(folder) {
    let folderBit = 1 << 14;
    let names = await fs.readdir(root + folder);
    for (let name of names) {
        let path = folder + name;
        let stat = await fs.stat(root + path);
        if ((stat.mode & folderBit) != 0) path = path + "/";
        paths.add(path);
    }
}

// Find the content type to respond with, or undefined.
function findType(url) {
    let dot = url.lastIndexOf(".");
    let extension = url.substring(dot + 1);
    return types[extension];
}

// Deliver the file that has been read in to the browser.
function deliver(response, type, content) {
    let typeHeader = { "Content-Type": type };
    response.writeHead(OK, typeHeader);
    response.write(content);
    response.end();
}

// Give a minimal failure response to the browser
function fail(response, code, text) {
    let textTypeHeader = { "Content-Type": "text/plain" };
    response.writeHead(code, textTypeHeader);
    response.write(text, "utf8");
    response.end();
}

// The most common standard file extensions are supported, and html is
// delivered as "application/xhtml+xml".  Some common non-standard file
// extensions are explicitly excluded.  This table is defined using a function
// rather than just a global variable, because otherwise the table would have
// to appear before calling start().  NOTE: add entries as needed or, for a more
// complete list, install the mime module and adapt the list it provides.
function defineTypes() {
    let types = {
        html : "application/xhtml+xml",
        css  : "text/css",
        js   : "application/javascript",
        mjs  : "application/javascript", // for ES6 modules
        png  : "image/png",
        gif  : "image/gif",    // for images copied unchanged
        jpeg : "image/jpeg",   // for images copied unchanged
        jpg  : "image/jpeg",   // for images copied unchanged
        svg  : "image/svg+xml",
        json : "application/json",
        pdf  : "application/pdf",
        txt  : "text/plain",
        ttf  : "application/x-font-ttf",
        woff : "application/font-woff",
        aac  : "audio/aac",
        mp3  : "audio/mpeg",
        mp4  : "video/mp4",
        webm : "video/webm",
        ico  : "image/x-icon", // just for favicon.ico
        xhtml: undefined,      // non-standard, use .html
        htm  : undefined,      // non-standardhttps://localhost:3443/null, use .html
        rar  : undefined,      // non-standard, platform dependent, use .zip
        doc  : undefined,      // non-standard, platform dependent, use .pdf
        docx : undefined,      // non-standard, platform dependent, use .pdf
    }
    return types;
}
// Generate hash and salt from password
function generate_hash_and_salt(uid, password) {
    let saltRounds = 10;
    bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(password, salt, function(err, hash) {
            update_user_password(uid, hash, salt);
        });
    });
}

// Create UID for user
function generate_uid() {
    uid = uuid();
    return uid;
}

// Check string only contains letters
function all_letters(input) {
    var letters = /^[A-Za-z]+$/;
    if (input.match(letters)) {
        return true;
    } else {
        return false;
    }
 }
  
  // Check email address has valid format
function validate_email(email) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        return (true);
    }
    return (false);
 }
  
  // Check user DOB means they ae over 19
function over_18(dob) {
    let string_age = dob;
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

// ------------ Validate incoming data/request functions ------------

function validate_signup_request(req) {
    if (Object.keys(req).length == 7) {
        let expected = ["fname", "lname", "dob", "email1", "email2", "pass1", "pass2"];
        let keys = Object.keys(req);
        for (let i = 0; i < 7; i++) {
            if (expected[i] != keys[i]) { 
                return false;
            }
            if (req[expected[i]] == "") { 
                return false; 
            }
        }
    } else { 
        return false; 
    }
    return true;
}

async function validate_signup_data(req) {
    if (req.email1 != req.email2) {
        return 1; // Emails don't mathc
    } else if (req.pass1 != req.pass2) {
        return 2; // Passwords don't match;
    } else if (req.pass1.length < 10 || req.pass1.length > 128) {
        return 3; // Incorrect password length
    } else if (!all_letters(req.fname) || !all_letters(req.lname)) {
        return 4; // Names contains non-letter characters
    } else if (!validate_email(req.email1)) {
        return 5; // Invalid email
    } else if (!over_18(req.dob)) {
        return 6; // Underage
    } else if (parseInt(req.dob.slice(0, 4)) < 1900) {
        return 7; // Year of birth too long ago
    } else if (await does_email_already_exist(req.email1)) {
        return 8; // Email already registered
    } else {
        return 0; // Success 
    }
}

function validate_login_request(req) {
    if (Object.keys(req).length == 2) {
        let expected = ["email", "pass"];
        let keys = Object.keys(req);
        for (let i = 0; i < 2; i++) {
            if (expected[i] != keys[i]) { 
                return false;
            }
            if (req[expected[i]] == "") { 
                return false; 
            }
        }
    } else { 
        return false; 
    }
    return true;
}

async function validate_login_data(req) {
    try {
        let sql = "SELECT passhash, salt FROM users WHERE email = ?";
        let user = await db.get(sql, [req.body.email]);
        let match = await bcrypt.compare(req.body.pass, user.passhash);

        if (match) {
            req.session.user = await db.get("SELECT uid FROM users WHERE email = ?", [req.body.email]);
            return 0;
        } else {
            return 1;
        }

    } catch (err) {
        console.log(err);
    }
}


// ------------ HTTP FUNCTIONS ------------
server.get("/profile", function(req, res) {
    if (!req.session.user) {
        res.redirect("/");
    } else {
        let info = get_user(req.session.user.uid);
        console.log([info].fname);
        res.sendFile(__dirname + '/public/profile.html');
    }
});

server.get("/", function(req, res) {
        res.sendFile(__dirname + '/public/index.html');
});

server.get("/signupsuccess", function(req, res) {
    res.sendFile(__dirname + '/public/signupsuccess.html');
});

server.get("/newpost", function(req, res) {
    res.sendFile(__dirname + '/public/newpost.html');
});

server.get("/error", function(req, res) {
    res.sendFile(__dirname + '/public/error.html');
});

server.get("/load_profile", async function(req, res) {
    let user = await get_user(req.session.user.uid);
    if (user) {
        res.send(user);
        console.log(user);
    } else {
        res.send("missing");
    }
});

server.post("/signup", async function(req, res) {
    try {
        if (validate_signup_request(req.body)) {
            let error = await validate_signup_data(req.body);
            if (error == 0) {
                let uid = generate_uid();
                add_user(uid, req.body.fname, req.body.lname, req.body.email1, "", "");
                generate_hash_and_salt(uid, req.body.pass1);
                res.send({success: true, info: "Signup successful, redirecting"});
                get_all_users();
            } else {
                res.send({success: false, info: error});
            }
        }
    } catch (err) {
        console.log(err);
    }

});

server.post("/login", async function(req, res) {
    try {
        if (validate_login_request(req.body)) {
            let error = await validate_login_data(req);
            if (error == 0) {
                console.log(req.session.user.uid);
                res.send({success: true, info: "Login successful, redirecting..."});
            } else {
                res.send({success: false, info: "Email and password did not match"});
            }
        }
    } catch (err) {
        console.log(err);
    }

});

server.post("/upload_profile_pic", async function(req, res) {
    try {
        update_user_picture(req.session.user.uid, req.body.url);
        console.log("Photo uploaded");
    } catch (err) {
        console.log(err);
    }

});

server.post("/upload_post", async function(req, res) {
    try {
        let uid = req.session.user.uid;
        let pid = generate_uid();
        add_post(pid, uid, req.body.location, req.body.picURL, req.body.comment);
        console.log("Post uploaded");
        get_all_posts();
    } catch (err) {
        console.log(err);
    }

});

// ------------ BAD REQUESTS ------------
server.get("*", function(req, res) {
    res.redirect("/");
})

server.get("post", function(req, res) {
    res.redirect("/");
})