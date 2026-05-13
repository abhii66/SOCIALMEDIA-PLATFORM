import { create } from "zustand";
import axios from "axios";

const BASE_URL = "http://localhost:2167"
export const useAuth = create((set)=>({
    currentUser: null,
    loading: false,
    authLoading: true,
    isAuthenticated: false,
    error: null,
    //register
    register:async(userData)=>{
        try{
            set({loading:true,error:null});
            const res=await axios.post(`${BASE_URL}/user-api/users`,userData,{withCredentials:true});
            if(res.status===201){
                set({loading:false})
                return true
            }
        }catch(err){
            set({
                loading:false,
                error:err.response?.data?.message || "Registration failed"
            })
            return false
        }
    },

    //login
    login:async(credentials)=>{
        try{
            set({loading:true,error:null});
            const res=await axios.post(`${BASE_URL}/user-api/users/login`,credentials,{withCredentials:true});
            if(res.status===200){
                set({
                    currentUser:res.data.payload,
                    isAuthenticated:true,
                    loading:false,
                    error:null
                })
                return true
            }
        }catch(err){
            set({
                loading:false,
                isAuthenticated:false,
                currentUser:null,
                error:err.response?.data?.message || "Login failed"
            })
            return false
        }
    },
    //logout
    logout:async()=>{
        try{
            await axios.get(`${BASE_URL}/user-api/users/logout`,{withCredentials:true});
            set({
                currentUser:null,
                isAuthenticated:false,
                error:null,
                loading:false
            })
        }catch(err){
            set({
                currentUser:null,
                isAuthenticated:false,
                loading:false
            })
        }
    },
    //check auth on page refresh
    checkAuth:async () => {
        try {
            set({ authloading: true });
            const res = await axios.get(`${BASE_URL}/user-api/check-auth`, { withCredentials: true });
            set({
                currentUser: res.data.payload,
                isAuthenticated: true,
                authLoading: false
            })
        } catch(err) {
            set({
                currentUser: null,
                isAuthenticated: false,
                authLoading: false
            })
        }
    },
    //update preferences
    updatePreferences:async(preferredCategories)=>{
        try{
            const res=await axios.put(`${BASE_URL}/user-api/users/preferences`,{preferredCategories},{withCredentials:true}
            )
            if(res.status===200){
                set(state=>({
                    currentUser:{ ...state.currentUser,preferredCategories}
                }))
                return true
            }
        }catch(err){
            return false
        }
    }
}))
