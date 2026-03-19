import axios from 'axios'

const api = axios.create({
    baseURL: "http://localhost:3000/",
    withCredentials:true
})
// http://localhost:3000/api/posts/feed

export async function getFeed() {
    const response = await api.get('api/posts/feed')
    console.log('From Post.api.js');
    
    return response.data
}

export async function createPost(imageFile, caption ) {
    const formData = new FormData()
    formData.append("image",imageFile)
    formData.append('caption',caption)

    const response = await api.post("/api/posts",formData)

    return response.data
    
}


export async function likePost(postId) {
    console.log("LikePost");
    
    const  response = await api.post("/api/posts/like/"+postId)
    return response.data
}

export async function unlikePost(postId) {
    console.log("UnLikePost");
    const  response = await api.post("/api/posts/unlike/"+postId)
    return response.data
}

export async function followerList() {
    console.log("follower List");
    const response = await api.get("api/user/follower/list")
    return response.data
}
export async function followingList() {
    console.log("following List");
    const response = await api.get("api/user/following/list")
    return response.data
}

export async function acceptedRequest() {

    
}