import { useState } from 'react'
import axios from 'axios'
// import './App.css'

function App() {
  const [notes, setNotes] = useState([{
    title: 'Note 1',
    discription: 'This is the first note'
  },{
    title: 'Note 2',
    discription: 'This is the secound note'
  },{
    title: 'Note 3',
    discription: 'This is the third note'
  },{
    title: 'Note 4',
    discription: 'This is the forth note'
  }
])


  axios.get("http://localhost:3000/api/notes")
  .then(res =>{
    console.log(res.data.notes);
    
    setNotes(res.data.notes)
  }).catch(err =>{
    console.log(err)
  })

  return (
   <>
    <div className="notes">
      {
        notes.map(note =>{
          return <div className="note">
              <h1>{note.title}</h1>
              <p>{note.discription}</p>
        </div>
        })
      }
    </div>
   </>
  )
}

export default App
