import React, { useEffect } from 'react'
import "../style/Feed.scss"
import Post from '../components/Post'
import {usePost} from '../hook/usePost'

const Feed = () => {

    // console.log("hello");
    

    const {feed, handleGetFeed,loading} = usePost()
    
    useEffect(()=>{
        handleGetFeed()
        console.log("Post is going to be loaded");
    },[handleGetFeed])

    if (loading) return <h1>Loading...</h1>

    if (!feed || feed.length === 0)
    return <h1>No posts available</h1>
    
    
    
    
  return (
    <main className='FeedPage'>
        <div className="feed">
            <div className="posts">
                {feed.map(post =>{
                    return  <Post key={post?._id ?? post?.id} user={post?.user} post={post}/>
                })}
            </div>
        </div>
    </main>
  )
}

export default Feed
