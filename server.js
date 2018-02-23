// Require the Express Module
var express = require('express');
// Create an Express App
var app = express();

// Require body-parser (to receive post data from clients)
var bodyParser = require('body-parser');
// Integrate body-parser with our App
app.use(bodyParser.urlencoded({ extended: true }));
// use json
app.use(bodyParser.json());

// Require path
var path = require('path');
// Setting our Static Folder Directory
app.use(express.static(path.join(__dirname, './client/dist')));
// Setting our Views Folder Directory
app.set('views', path.join(__dirname, './views'));
// Setting our View Engine set to EJS
app.set('view engine', 'ejs');

// require mongoose
var mongoose = require('mongoose');
// Connect to database
mongoose.connect('mongodb://localhost/Notes');
mongoose.Promise = global.Promise;

// create schema and model
let Schema = mongoose.Schema;
let NoteSchema = new mongoose.Schema({
    text: { type: String, required: true, minlength: 3},
    createdate: {type: Date, default: Date.now}}, 
    {timestamps: true});

let Note = mongoose.model("Note", NoteSchema);

// Routes
// Root Request
// get all note
app.get('/notes', function(req, res) {
    Note.find({}, function(err, notes) {
        if (err) {  
            console.log("Error retrieving note");
            console.log(err)
            res.json({message: "Error", error: err});
        } 
 
        res.json({message: "Success", data: notes});
    })
})


// get one note
app.get('/notes/:id', function(req, res) {
    console.log("enter get")
    Note.findOne({_id: req.params.id}, function(err, note) {
        if(err) {
            console.log('Error retrieving data');
            res.json({message: "Error", error: err})
        } else { // else console.log that we did well and then redirect to the root route
            console.log('Successfully retrieved a note');
            res.json({message: "Success", data: note});
        }
    })
})

// create new note
app.post('/notes', function(req, res) {
    console.log(req.body)
    var note = new Note({text: req.body.text});
            
    // Try to save that new note to the database (this is the method that actually inserts into the db) and run a callback function with an error (if any) from the operation.
    note.save(function(err) {
        // if there is an error console.log that something went wrong!
        if(err) {
            console.log('Error saving new note');
            res.json({message: "Error", error: err})
        } else { // else console.log that we did well and then redirect to the root route
            console.log('Successfully added a note');
            res.json({message: "Success", data: note});
        }
    })
})

// update note
app.put('/notes/:id', function(req, res) {
    Note.findOneAndUpdate({_id: req.params.id}, 
                        {$set: { text: req.body.text}}, 
                        null, function(err) {
        if(err) {
            console.log('Error during note update');
            res.json({message: "Error", error: err})
        } else { // else console.log that we did well and then redirect to the root route
            console.log('Successfully updating a note');
            res.json({message: "Success"});
        }
    })
})

// delete note
app.delete('/notes/:id', function(req, res) {
    Note.deleteOne({_id: req.params.id}, function(err) {
        if(err) {
            console.log('Error during delete');
            res.json({message: "Error", error: err})
        } else { // else console.log that we did well and then redirect to the root route
            console.log('Successfully deleting a note');
            res.json({message: "Success"});
        }
    })
})

app.all("*", (req,res,next) => {
    res.sendFile(path.resolve("./client/dist/index.html"))
});

// Setting our Server to Listen on Port: 8000
app.listen(8000, function() {
    console.log("Notes listening on port 8000");
})
