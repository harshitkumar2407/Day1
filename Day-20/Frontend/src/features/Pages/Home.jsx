import React from 'react'
import { useAuth } from '../auth/hooks/useAuth'

const Home = () => {
    const {currentUsername ,currentEmail ,currentBio} = useAuth();
  return (
    <div>
        <h1>Welcome {currentUsername}</h1>
        
        <h2>Email {currentEmail}</h2>
       <p>{currentBio}</p>

    </div>
  )
}

export default Home