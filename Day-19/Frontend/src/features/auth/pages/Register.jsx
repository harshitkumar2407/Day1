import React from 'react'
import {Link} from 'react-router'

const Register = () => {
  return (
    <main>
      <div className="form-container">
        <h1>Register</h1>
        <form action="">
          <input type="text" name="username" id="" placeholder='Enter username'/>
          <input type="password" name="password" id="" placeholder='Enter Password' />
          <button>Register</button>
        </form>
        <p>Already have a account ? <Link className='toggleAuthForm' to={"/login"}>Login</Link></p>
      </div>
    </main>
  )
}

export default Register