import React from 'react'
import {Link} from 'react-router'

const Register = () => {const handleSubmit = (e) =>{
        e.preventDefault()

    }
  return (
    <main>
        <div className="form-container">
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" name="username" id="username" placeholder='enter your Username' />
                <input type="email" name="email" id="email" placeholder='Enter  email Address' />
                <input type="password" name="password" id="password" placeholder='password' />
                <button className='button primary-button'>Register</button>
            </form>
            <p>If you have an account ? <Link to={"/Login"}> Login </Link>.</p>
        </div>
    </main>
  )
}

export default Register