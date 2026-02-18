import { useState, useEffect } from "react"
import axios from "axios"

function App() {

  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchNotes = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/notes")
        setNotes(res.data.notes)
      } catch (err) {
        setError("Failed to fetch notes")
      } finally {
        setLoading(false)
      }
    }

  useEffect(() => {
    fetchNotes()
    console.log("notes",notes);
    
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()

    const {title, discription} = e.target.elements

    axios.post("http://localhost:3000/api/notes",{
      title:title.value,
      discription:discription.value
    })
    .then(res =>{
      console.log(res.data);
      fetchNotes()
    })
  }
    function handleDeleteNote(noteId) {
      console.log(noteId);
      axios.delete("http://localhost:3000/api/notes/"+noteId)
      .then(res=>{
        console.log(res.data); 
        fetchNotes()
      })
      .catch(err => {
      console.log(err)
    })
    }


  if (loading) return <h2>Loading...</h2>
  if (error) return <h2>{error}</h2>

  return (
    <>
      <form className="note-create-form" onSubmit={handleSubmit}>
        <input type="text" name="title" placeholder="Title" required />
        <input type="text" name="discription" placeholder="Description" required />
        <button type="submit">Create Note</button>
      </form>

      <div className="notes">
        {notes.map((note) => (
          <div className="note" key={note._id}>
            <h1>{note.title}</h1>
            <p>{note.discription}</p>
            <button onClick={()=>{handleDeleteNote(note._id)}}>delete</button>
          </div>
        ))}
      </div>
    </>
  )
}

export default App 