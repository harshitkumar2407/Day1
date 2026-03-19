import { useState } from 'react'
import { PostContext } from './postContext'

export const PostContextProvider =({ children}) =>{

    const [loading, setLoading] = useState(false)
    const [post, setPost] = useState(null)
    const [feed, setFeed] = useState(null)
    const [follower, setFollower] = useState([])
    const [following, setFollowing] = useState([])


    return (
        <PostContext.Provider value={{  
            loading,setLoading,
            post, setPost,
            feed, setFeed,
            follower, setFollower,
            following, setFollowing}}>
                
            {children}
        </PostContext.Provider>
    )
}
