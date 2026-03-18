import axios from 'axios'

const api = axios.create({
    baseURL: "http://localhost:3000/",
    withCredentials:true
})
// http://localhost:3000/api/posts/feed

export async function getFeed() {
    const response = await api.get('api/posts/feed')
    return response.data
}

