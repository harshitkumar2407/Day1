import React, { useState } from 'react'
import "../style/register.scss"
import FromGroup from '../components/FromGroup'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../hooks/useAuth'

const Register = () => {

    const {loading, handleRegister} = useAuth()
    const navigate = useNavigate()
    
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    async function handleSubmit(e) {
        e.preventDefault()
        await handleRegister({username,email,password})
        navigate("/")
    }


    return (
        <main className="register-page">
            <div className="form-container">
                <h1>Register</h1>
                <form action="" onSubmit={handleSubmit}>
                    <FromGroup 
                        value={username}
                        onChange={(e)=> setUsername(e.target.value)}
                        label="Username" placeholder="Enter you Username"/>
                    <FromGroup 
                        value={email}
                        onChange={(e)=> setEmail(e.target.value)}
                        label="Email" placeholder="Enter you Email"/>
                    <FromGroup
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        label="Password" placeholder="Enter you Password"/>
                    <button className='button' type='submit'>Register</button>
                </form>
                <p>Already have an account? <Link to="/login" >Login hear</Link></p>

            </div>
        </main>
    )
}

export default Register