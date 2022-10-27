const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Notes = require('../models/Notes');
const { body, validationResult } = require('express-validator');

//ROUTE 1: /api/notes/fetchallnotes
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {   
        const notes = await Notes.find({ user: req.user.id });
        res.json(notes);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
})

//ROUTE 2: /api/notes/addnote
router.post('/addnote', fetchuser, [
    body('title',"enter valid title").isLength({ min: 3 }),
    body('description',"enter valid description").isLength({ min: 10 }),
], async (req, res) => {
    try {
        const { title, description, tag } = req.body;
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return res.status(401).json({ errors: errors.array() });
        }

        const note = new Notes({
            title,description,tag,user:req.user.id
        })

        const savedNote = await note.save();
        res.json(savedNote);

    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
    
})

//ROUTE 3: ROUTE for updating notes. /api/notes/updatenote
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;
    //create a new note object
    const newNote = {};
    if (title) { newNote.title = title };
    if (description) { newNote.description = description };
    if (tag) { newNote.tag = tag };

    //find the note to be updated with the help of the id in the url
    let note = await Notes.findById(req.params.id);
    if (!note) {
        return res.status(404).send("Not Found lmao");
    }

    if (note.user.toString() !== req.user.id) {
        return res.status(401).send("Not Allowed fam");
    }

    note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
    res.json({ note });
    
})

//ROUTE 4: to delete a note at "api/notes/deletenote"
router.delete('/deletenote/:id', fetchuser, async (req, res) => {

    try {
        
        //find the note to be deleted with the help of the id in the url
        let note = await Notes.findById(req.params.id);
        if (!note) {
            return res.status(404).send("Not Found lmao");
        }
        
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed fam");
        }
        
        note = await Notes.findByIdAndDelete(req.params.id)
        res.json({ "Success":"Note has been deleted", note });
        
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
})
    
    
    
module.exports = router;