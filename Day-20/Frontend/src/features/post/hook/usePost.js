import {getFeed} from '../services/post.api'
import {useCallback, useContext} from 'react'
import {PostContext} from '../postContext'

export const usePost =() =>{

    const context = useContext(PostContext)

    const {loading,setLoading,post,setPost,feed, setFeed} = context

    const handleGetFeed = useCallback(async ()  =>{
        setLoading(true)
        const data = await getFeed()
        setFeed(data.posts)
        setLoading(false)
        console.log(data.posts);
        
    }, [setFeed, setLoading])


    return {loading,handleGetFeed,setLoading,post,setPost,feed, setFeed}
}
