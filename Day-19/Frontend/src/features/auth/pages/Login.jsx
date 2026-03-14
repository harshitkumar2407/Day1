import "../style/form.scss"
import {Link} from 'react-router'

const Login = () => {
  return (
    <main>
      <div className="form-container">
        <h1>Login</h1>
        <form action="">
          <input type="text" name="username" placeholder='Enter username' />
          <input type="password" name="password" placeholder='Enter password' />
          <button >Login </button>
        </form>
        <p>If you don't have a account ? <Link className="toggleAuthForm" to={"/register"}>Register</Link></p>
      </div>
    </main>
  )
}

export default Login