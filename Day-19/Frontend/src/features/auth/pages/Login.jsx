import { useState } from "react"
import "../style/form.scss"
import {Link, useNavigate} from 'react-router'
import axios from "axios"
import { useAuth} from '../hooks/useAuth'

const Login = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const {handleLogin ,loading} = useAuth()  
  const navigate = useNavigate()

  if(loading){
    return (
      <h1>Loading......</h1>
    )
  }
  async function handleSubmit(e) {
    e.preventDefault()

  handleLogin(username,password)
  .then(res =>{
    console.log(res);
    navigate("/")
  })

  }
  return (
    <main>
      <div className="form-container">
        <h1>Login</h1>
          <form onSubmit={handleSubmit}>
            <input 
              type="text" 
              name="username" 
              placeholder='Enter username'
              onInput={(e)=>{setUsername(e.target.value)}} />
          <input 
            type="password" 
            name="password" 
            placeholder='Enter password'
            onInput={(e) => {setPassword(e.target.value)}} />
          <button >Login </button>
        </form>
        <p>If you don't have a account ? <Link className="toggleAuthForm" to={"/register"}>Register</Link></p>
      </div>
    </main>
  )
}

export default Login