import React, { useState } from 'react'

import "../style/login.scss"
import FromGroup from '../components/FromGroup'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../hooks/useAuth'

const Login = () => {

    const {loading,handleLogin} = useAuth()
    const navigate = useNavigate()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")


    async function handleSubmit(e) {
        e.preventDefault()
        await handleLogin({email,password})
        navigate("/")
    }
    

    return (
        <main className="login-page">
        <div className="form-container" >
        <h1>Login</h1>
        <form action="" onSubmit={handleSubmit}>
            <FromGroup 
                label="Email" 
                placeholder="Email your email"
                value={email}
                onChange={(e)=> setEmail(e.target.value)}

                 />
            <FromGroup 
                value={password}
                onChange={(e)=> setPassword(e.target.value)}
                label="Password" placeholder="Enter your password"/>
            
            <button className='button' type='submit'>Login</button>
        </form>
        <p>Do not have a account <Link to="/register">Register</Link></p>
        </div>
    </main>
  )
}

export default Login
