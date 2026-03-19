import {createPost, getFeed, likePost, unlikePost, followerList ,followingList} from '../services/post.api'
import {useCallback, useContext} from 'react'
import {PostContext} from '../postContext'
import { useEffect } from 'react'

export const usePost =() =>{

    const context = useContext(PostContext)

    const {loading,setLoading,post,setPost,feed, setFeed, follower, setFollower,following, setFollowing} = context

    const handleGetFeed = async ()  =>{
        setLoading(true)
        const data = await getFeed()
        console.log("From UsePost handel Get Feed");
        setFeed(data.posts)
        setLoading(false)
        
    }


    const handleCreatePost = async (imageFile, caption) =>{
        setLoading(true)
        const data = await createPost(imageFile,caption)
        setFeed(data.posts.reverse() )
        setLoading(false)
    }


    const handleLike = async(post) =>{
        const data  = await likePost(post)
        await handleGetFeed()
        // console.log("Form HandleLik ");
        
        
    }
    
    const handleUnlike = async(post) =>{
        const data  = await unlikePost(post)
        await handleGetFeed()
        console.log("Form HandleLike ");
    }

    const handleFollower = async() =>{
        const data = await followerList()
        console.log('Follower list',data.followers);
        setFollower(data.followers)
        
    }

    const handleFollowing = async() =>{
        const data = await followingList()
        console.log('Following list',data.following);
        setFollowing(data.following)
    }

    

    return {
        loading,
        setLoading,
        post,
        handleCreatePost,
        handleGetFeed,
        setPost,
        setFeed , 
        feed, 
        handleLike,
        handleUnlike,

        // Follower and following
        follower,
        following,
        handleFollower,
        handleFollowing
    }
}
