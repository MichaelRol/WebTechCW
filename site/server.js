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

// Change the port to the default 80, if there are no permission issues and port
// 80 isn't already in use. The root folder corresponds to the "/" url.
let port = 8080;
let root = "./public"
const sqlite3 = require('sqlite3').verbose();
// let db = new sqlite3.Database(':memory:');
// Load the library modules, and define the global constants and variables.
// Load the promises version of fs, so that async/await can be used.
// See http://en.wikipedia.org/wiki/List_of_HTTP_status_codes.
// The file types supported are set up in the defineTypes function.
// The paths variable is a cache of url paths in the site, to check case.
let http = require("http");
let express = require("express");
let server = express();
let path = require("path");
var staticPath = path.join(__dirname, '/public');
server.use(express.static(staticPath));
let fs = require("fs").promises;
let OK = 200, NotFound = 404, BadType = 415, Error = 500;
let types, paths;
let db = new sqlite3.Database('./db/database.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the database.');
});

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
        server.listen(8080, function() {
            console.log('[SERVER] STATUS: Express HTTP server on listening on port 8080');
        });
        // let service = http.createServer(handle);
        // service.listen(port, "localhost");
        // let address = "http://localhost";
        // if (port != 80) address = address + ":" + port;
        initDB();
        db.serialize(() => {
        addUser(1234, "Michael", "Rollins", "michael.rollins@hotmail.co.uk", "aisodakl3", "sadsd");
        getUser(1234);
        getAllUsers();
        updateUserEmail(1234, "mr16338@bristol.ac.uk");
        getUser(1234);
        updateUserPassword(1234, "skjakjds", "sdadsa");
        deleteUser(1234);
        getAllUsers();});
    }
    catch (err) { console.log(err); process.exit(1); }
}

// ------------ DATABASE FUNCTIONS --------------

function closeDB() {
    // close the database connection
    db.close((err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Close the database connection.');
    });
}

function initDB() {
    db.run("CREATE TABLE IF NOT EXISTS users (uid PRIMARY KEY, fname, lname, email, passhash, salt, photoURL)", function (err) {
        if (err !== null) {
            console.log("SERVER ERROR: \n" + err);
        } else {
            console.log("DATABASE: Connected to database");
        }
    });
}

function addUser(uid, fname, lname, email, passhash, salt) {
    db.run("INSERT INTO users (uid, fname, lname, email, passhash, salt) VALUES (?, ?, ?, ?, ?, ?)", [uid, fname, lname, email, passhash, salt], function (err) {
        if (err !== null) {
            console.log("[SERVER] ERROR: \n" + err);
        } else {
            console.log("[SERVER] DATABASE: Created new user");
        }
    });
}

function deleteUser(uid) {
    db.run("DELETE FROM users WHERE uid = ?", uid, function(err) {
        if (err) {
            return console.error(err.message);
        }
        console.log("User deleted");
    })
}

function getUser(uid) {
    let sql = "SELECT fname, lname, email FROM users WHERE uid = ?";
    db.get(sql, [uid], (err, row) => {
        if (err) {
          return console.error(err.message);
        }
        return row
          ? console.log(row.fname, row.lname, row.email)
          : console.log(`No user found with the uid ${uid}`);
    });
}
function getAllUsers() {
    let sql = `SELECT uid, fname, lname FROM users
           ORDER BY lname`;
 
    db.all(sql, [], (err, rows) => {
        if (err) {
            throw err;
        }
        rows.forEach((row) => {
            console.log(row.uid, row.fname, row.lname);
        });
    });
 
}

function updateUserEmail(uid, email) {
    db.run("UPDATE users SET email = ? WHERE uid = ?", [email, uid], function (err) {
        if (err) {
            return console.error(err.message);
        }
        console.log("Updated email to: ", email);
    });
}

function updateUserPassword(uid, newHash, newSalt) {
    db.run("UPDATE users SET passhash = ?,   salt = ? WHERE uid = ?", [newHash, newSalt, uid], function (err) {
        if (err) {
            return console.error(err.message);
        }
        console.log("Updated password");
    });
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
        htm  : undefined,      // non-standard, use .html
        rar  : undefined,      // non-standard, platform dependent, use .zip
        doc  : undefined,      // non-standard, platform dependent, use .pdf
        docx : undefined,      // non-standard, platform dependent, use .pdf
    }
    return types;
}


// ------------ HTTP FUNCTIONS -----------------
server.get("/", function(req, res) {
    res.sendFile("/public/");
});
