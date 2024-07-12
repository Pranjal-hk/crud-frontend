import {useState,useEffect} from "react";
import axios from "axios";
import "./App.css";
function App() {
  // State

  const[notes,setNotes] = useState(null);
  const[createForm, setCreateForm] = useState({
    title: "",
    body: "",
  });
  const [updateForm, setUpdateForm] = useState({
    _id: null,
    title: "",
    body: "",
  });

  // Use effect
  useEffect(() => {
    fetchNotes();
  },[])

  // Functions 


  const fetchNotes = async () =>{
    // Fetch the notes
   const res = await axios.get("http://localhost:3000/notes");
    // Set it to state
    setNotes(res.data.notes)
  }

  const updateCreateFormField = (e) =>{
    const {name, value} = e.target;
    setCreateForm({
      ...createForm,
      [name]:value,
    })
    //console.log({name,value});
  };

  const createNote = async(e) =>{
     e.preventDefault();
     // Create the note
     const res = await axios.post("http://localhost:3000/notes",createForm);
     // update state
     setNotes([...notes, res.data.note]);
      
     // Clear form state
     setCreateForm({title:'', body: ''});
  }

  const deleteNote = async(_id) => {
     // Delete the note
     const res = await axios.delete(`http://localhost:3000/notes/${_id}`);
     // Update State
     const newNotes = [...notes].filter(note =>{
      return note._id !== _id;
     });
     setNotes(newNotes); 
  };

  const handleUpdateFieldChange = (e) =>{
    const {name,value} = e.target

    setUpdateForm({
      ...updateForm,
      [name]: value, 
    })
  }

  const toggleUpdate = (note) =>{
    // Get the curernt note values
    // Set state on updated form
    setUpdateForm({
      title: note.title,
      body: note.body,
      _id: note._id,
    })
  };

  const updateNote = async(e) =>{
    e.preventDefault();
    const {title, body} = updateForm;
    // Send the update request
    try{
    const res = await axios.put(`http://localhost:3000/notes/${updateForm._id}`,{
          title,
          body
    });
    //console.log(res);
    // update state
     const newNotes = [...notes];
     const noteIndex = notes.findIndex(note => {
           return note._id === updateForm._id;
     })
     newNotes[noteIndex] = res.data.note;
        setNotes(newNotes);
    // Clear update form states
    setUpdateForm({
      _id: null,
      title: '',
      body: '',
    })
     }catch(err){
        console.log(err);
     }
  };



  return (
    <div className="App outer-box">

        <h2>Notes:</h2>
        <div className="notes-section">
        {notes && notes.map(note =>{
          return <div className="note" key={note._id}>
            <h3>{note.title}</h3>
            <h4>{note.body}</h4>
            <button onClick={() =>deleteNote(note._id)}>Delete Note</button>
            <button onClick={() =>toggleUpdate(note)}>Update note</button>
          </div>
        })}
        </div>


      <div>
      {updateForm._id &&<div className="new-note">
          <h2>Update note</h2>
          <div className="form">
          <form onSubmit={updateNote}> 
            <div className="form-content">
                <h3><span>Title</span><input onChange={handleUpdateFieldChange}name="title" value={updateForm.title}/></h3>
            </div>
            <div className="form-content">
                  <h5><span>Body</span><input onChange={handleUpdateFieldChange} name="body" value={updateForm.body}></input></h5>
            </div>
            <div className="form-button">
                 <button type="submit">Update Note</button>
            </div>
          </form>
          </div>
      </div>
     }
     </div>


      {!updateForm._id && <div className="new-note">
        <h2>Create new note</h2>
        <div className="form">
        <form onSubmit={createNote}>
          <div className="form-content">
              <h4><span>Title:</span><input onChange={updateCreateFormField} value={createForm.title} name="title" /></h4>
          </div>
          <div className="form-content">
              <h5><span>Body:</span><input onChange={updateCreateFormField} value={createForm.body} name="body"/></h5>
          </div>
          <div className="form-button">
               <button type="submit">Create Note</button>
          </div>
        </form>
        </div>
      </div>
}</div>
    
  );
}

export default App;
