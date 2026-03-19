import React from 'react'
import "../style/CreatePost.scss"
import { useState } from 'react'
import { useRef } from 'react'
import { usePost } from '../hook/usePost'
import { lazy } from 'react'
import Loader from '../../auth/pages/Loader'
import { useNavigate } from 'react-router'

const CreatePost = () => {

    const [caption, setCaption] = useState("")
    const postImageInputFieldRef = useRef(null)
    const {loading ,handleCreatePost,setLoading} =usePost()
    const navigate = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault()
        const file = postImageInputFieldRef.current.files[0]
            
        await handleCreatePost(file, caption)
       
        navigate("/")
    }

    if (loading) {
        // return <Loader/>
        return <main>
            <h1>Creating post</h1>
        </main>
    }

    return (
      <main className="create-post-page">
          <div className="form-container">
                <h1>Create Post</h1>
                <form onSubmit={ handleSubmit }>
                    <label className='post-image-label' htmlFor="postImage">Select Image </label>
                    <input ref={postImageInputFieldRef} hidden type="file" name="postImage" id="postImage" />
                    <input 
                        type="text" 
                        name="caption" 
                        id="caption" 
                        placeholder='Enter Caption'
                        value={caption} 
                        onChange={(e)=> {setCaption(e.target.value)}}/>
                        
                    <button className='button primary-button'>Create post</button>
                </form>
          </div>
      </main>
    )
}
export default CreatePost