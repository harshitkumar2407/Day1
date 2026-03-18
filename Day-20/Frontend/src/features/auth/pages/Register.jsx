import React, { useState } from 'react'
import {Link, useNavigate} from 'react-router'
import { useAuth } from '../hooks/useAuth';
import Loader from './Loader'

const Register = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()
    const {loading, handleRegister } = useAuth()

    const handleSubmit = async (e) =>{
        e.preventDefault()
        
        await handleRegister(username, email, password)
        navigate('/')
        

    }
    if (loading) {
        return (
            <main>
                <Loader />
            </main>
        )
    }
  return (
    <main>
        <div className="form-container">
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" 
                onInput={(e)=>setUsername(e.target.value)}
                name="username" 
                id="username" 
                placeholder='enter your Username' />

                <input 
                    onInput={(e) =>{setEmail(e.target.value)}}
                    type="email" 
                    name="email" 
                    id="email" 
                    placeholder='Enter  email Address' />

                <input
                    onInput={(e) =>{setPassword(e.target.value)}}
                    type="password" 
                    name="password" id="password" 
                    placeholder='password' />
                <button className='button primary-button'>Register</button>
            </form>
            <p>If you have an account ? <Link to={"/Login"}> Login </Link>.</p>
        </div>
    </main>
  )
}

export default Register
