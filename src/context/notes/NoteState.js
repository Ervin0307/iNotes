import React, { useState } from "react";
import NoteContext from "./noteContext";

const NoteState = (props) => {
  // const host = "http://localhost:5000"
  // console.log(host);
  
  const notesInitial = [];
  const [notes, setNotes] = useState(notesInitial);

  // Get all notes
  const getNotes = async() => {
    //API call
    const response = await fetch(`http://localhost:5000/api/notes/fetchallnotes`, {
      method: 'GET', 
      headers: {
        'Content-Type': 'application/json',
        "auth-token" : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjM1NmNmYzEwMmZiZmQyNzQwZWY1MzgxIn0sImlhdCI6MTY2NjY2NjA2MH0.aaQW1RiCDQGIy5tVau3sS7owGYBYUq0rRMY9CQPebL4"
      }
    });
    const json = await response.json();
    // console.log(json);
    setNotes(json);
    
  };

   // Add a note
  const addNote = async(title, description, tag) => {
    //API call
    const response = await fetch(`http://localhost:5000/api/notes/addnote`, {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
        'auth-token' : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjM1NmNmYzEwMmZiZmQyNzQwZWY1MzgxIn0sImlhdCI6MTY2NjY2NjA2MH0.aaQW1RiCDQGIy5tVau3sS7owGYBYUq0rRMY9CQPebL4"
      },
      body: JSON.stringify({title,description,tag}) 
    });
    //logic to add note
    const note=await response.json();
    setNotes(notes.concat(note));
    // console.log(json);
    
    // const note = json;
  };
  
  // Delete a note
  const deleteNote = async (id) => {
    const response = await fetch(`http://localhost:5000/api/notes/deletenote/${id}`, {
      method: 'DELETE',  
      headers: {
        'Content-Type': 'application/json',
        'auth-token' : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjM1NmNmYzEwMmZiZmQyNzQwZWY1MzgxIn0sImlhdCI6MTY2NjY2NjA2MH0.aaQW1RiCDQGIy5tVau3sS7owGYBYUq0rRMY9CQPebL4"
      },
    });
    const json =await response.json();
    console.log(json);


    console.log("delteing note w id" + id);
    const newNotes = notes.filter((note) => {
      return note._id !== id;
    });
    setNotes(newNotes);
  };

  // Edit a note
  const editNote = async (id, title, description, tag) => {
    //API calls
    
    const response = await fetch(`http://localhost:5000/api/notes/updatenote/${id}`, {
      method: 'PUT',  
      headers: {
        'Content-Type': 'application/json',
        'auth-token' : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjM1NmNmYzEwMmZiZmQyNzQwZWY1MzgxIn0sImlhdCI6MTY2NjY2NjA2MH0.aaQW1RiCDQGIy5tVau3sS7owGYBYUq0rRMY9CQPebL4"
      },
      body: JSON.stringify({title, description, tag}) 
    });
    const json =await response.json();
    console.log(json);

    let newNotes= JSON.parse(JSON.stringify(notes))

    //logic to edit notes
    for (let index = 0; index < newNotes.length; index++) {
      const element = newNotes[index];
      if (element._id === id) {
        element.title = title;
        element.description = description;
        element.tag = tag;
      }
    }
    console.log(id, notes);
    setNotes(newNotes)
  };

  return (
    <NoteContext.Provider
      value={{ notes, setNotes, addNote, deleteNote, editNote,getNotes }}
    >
      {props.children}
    </NoteContext.Provider>
  );
};
export default NoteState;
