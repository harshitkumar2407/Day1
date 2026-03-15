import React, { useState } from 'react'
import "../style/form.scss"
import {Link, useNavigate} from 'react-router'
import { useAuth } from '../hooks/useAuth'
import Loader from './Loader'

const Login = () => {
    const {user, loading, handleLogin} =useAuth()
    const [username, setUsername] = useState("rishu")
    const [password, setPassword] = useState("password")
    
    const navigate = useNavigate()

    if (loading) {
        return(
            <main>
                <Loader />
            </main>
        )
    }
    const handleSubmit = async(e) =>{
        e.preventDefault()
        
        await handleLogin(username,password)
        console.log("user LoggedIn");
        navigate("/")

    }
  return (
    <main>
        <div className="form-container">
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    name="username" 
                    id="username" 
                    placeholder='enter your name' 
                    onInput={(e) =>{setUsername(e.target.value)}}/>

                <input 
                    type="password" 
                    name="password" 
                    id="password" 
                    placeholder='password' 
                    onInput={(e) =>{setPassword(e.target.value)}} />

                <button className='button primary-button'>Login</button>
            </form>
            <p>Don't have an account ? <Link to={"/register"}>Create One</Link>.</p>
        </div>
    </main>
  )
}

export default Login