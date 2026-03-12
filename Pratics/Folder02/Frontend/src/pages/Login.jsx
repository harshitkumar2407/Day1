import React from 'react'
import "../pages/authFrom.scss"
import "../Ui/Button.scss"
import { useState } from 'react'

const Login = () => {
    const [Name, setName] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const submitHandler =(e)=>{
        e.preventDefault()
        const 

    }

    return (    
    <main>
        <div className='form-container' >
        <h1>Login</h1>
        <form>
            <div className="input-group">
            <label htmlFor="">Name</label>
            <input type="text" name="name" id="name" placeholder='Enter name'/>
            </div>

            <div className="input-group">
            <label htmlFor="">Username</label>
            <input type="text" name="username" id="username" placeholder='Enter Username' />    
            </div>

            <div className="input-group">
            <label htmlFor="">password</label>
            <input type="password" name="password" id="password" />
            </div>

            <button className='button primary-button'>Login</button>
        </form>
        </div>
    </main>
  )
}

export default Login