import {create} from 'zustand';
import {axiosInstance} from '../lib/axios';
import {toast} from 'react-hot-toast';


export const useAuthStore = create((set) => ({
 authUser:null,
 isCheckingAuth : true,
 isSigninUp:false,
   signUp: async (formData) => {
    set({isSigninUp:true});
    try{
        const res = await axiosInstance.post("/auth/signup",formData);
        set({authUser:res.data});
        toast.success("Signed up successful!");
    }
    catch(err){
        toast.error(err.response?.data?.message || "Error signing up. Please try again.");
    }finally{
        set({isSigninUp:false});
    }
},
 checkAuth: async () =>{
    try{
        const res = await axiosInstance.get("/auth/check");
        set({authUser:res.data.user});
    }
    catch(err){
    console.log("Error checking auth status:",err);
    set({authUser:null});
 }finally{
    set({isCheckingAuth:false});    
 }
},
}));