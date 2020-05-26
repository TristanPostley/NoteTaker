// ==============================================================================
// DEPENDENCIES
// Series of npm packages that we will use to give our server useful functionality
// ==============================================================================

var express = require("express");
var fs = require('fs');
var path = require("path");


// ==============================================================================
// EXPRESS CONFIGURATION
// This sets up the basic properties for our express server
// ==============================================================================

// Tells node that we are creating an "express" server
var app = express();

// Sets an initial port. We"ll use this later in our listener
var PORT = process.env.PORT || 8080;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));


// ================================================================================
// ROUTER
// The below points our server to a series of "route" files.
// These routes give our server a "map" of how to respond when users visit or request data from various URLs.
// ================================================================================


app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});

app.get("/api/notes", function(req, res) {
    fs.readFile('db/db.json', 'utf8', function(err, data) {
        if (err) throw err;
        res.json(JSON.parse(data));
    })
});

app.post("/api/notes", (req, res) => {
    let notes = JSON.parse(fs.readFileSync("db/db.json", "utf8"));

    notes.push(req.body);
    // console.log(notes);

    fs.writeFile('db/db.json', JSON.stringify(notes), err => {
        if (err) throw err;
    });

    res.send(true);
});

app.delete("/api/notes/:id", (req, res) => {
    let id = req.params.id;
    let notes = JSON.parse(fs.readFileSync("db/db.json", "utf8"));
    
    notes = notes.filter(note => note.id != id);

    fs.writeFile('db/db.json', JSON.stringify(notes), err => {
        if (err) throw err;
    });

    res.send(true);
});

app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
  });


// =============================================================================
// LISTENER
// The below code effectively "starts" our server
// =============================================================================

app.listen(PORT, function() {
  console.log("App listening on PORT: " + PORT);
});



// fs.readFile('db/db.json', 'utf8', function(err, data) {
//   if (err) throw err;
//   console.log(JSON.parse(data)[0].title);
// })