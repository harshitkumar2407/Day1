import { useContext, useEffect } from "react"
import { AuthContext } from "../auth.constext"
import { getMe, login, logout, register } from "../services/auth.api"



export const useAuth =() =>{
    const context = useContext(AuthContext)

    const {user,setUser,loading,setLoading} = context

    async function handleRegister({username,email,password}) {
        setLoading(true)
        const data = await register({username,email,password})
        setUser(data.user)
        setLoading(false)
    }

    async function handleLogin({username,email,password}) {
        setLoading(true)
        const data = await login({username,email,password})
        setUser(data.user)
        setLoading(false)
    }

    async function handleGetMe() {
        setLoading(true)
        const data = await getMe()
        setUser(data.user)
        setLoading(false)
    }

    async function handlegLogout() {
        setLoading(true)
        const data = await logout()
        setUser(data.user)
        setLoading(false)
    }

    useEffect(()=>{
        handleGetMe()
    },[])




    return({
        user,
        loading,

        handleRegister,
        handleGetMe,
        handlegLogout, 
        handleLogin
    })
}