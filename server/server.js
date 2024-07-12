// Load env variables
if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}
require("dotenv").config();
// import dependencies
const express = require('express');
const cors = require('cors');
const connectToDb = require("./config/connectToDb");
const notesController = require("./controllers/notesControllers");


// Create an express app
const app = express();
app.use(cors());

// Configure express app
app.use(express.json());

// connect to database
connectToDb();

//Routing

app.get('/notes',notesController.fetchNotes);
app.get('/notes/:id',notesController.fetchNote);
app.post('/notes',notesController.createNote);
app.put('/notes/:id',notesController.updateNote);
app.delete('/notes/:id',notesController.deleteNote);



// Start our server
app.listen(process.env.PORT,()=>{
    console.log(`Server is running on port ${process.env.PORT}`);
})
