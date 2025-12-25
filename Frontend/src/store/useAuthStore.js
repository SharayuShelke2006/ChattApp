import {create} from 'zustand';
import {axiosInstance} from '../lib/axios';
import {toast} from 'react-hot-toast';


export const useAuthStore = create((set) => ({
 authUser:null,
 isCheckingAuth : true,
 isSigninUp:false,
 isLoggingIn:false,
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
updateProfile: async (data) => {
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("Error in update profile:", error);
      toast.error(error.response.data.message);
    }
  },

login: async (formData) => {
    set({isLoggingIn:true});
    try{
        const res = await axiosInstance.post("/auth/login",formData);
        set({authUser:res.data});
        toast.success("Logged in successful!");
    }
    catch(err){
        toast.error(err.response?.data?.message || "Error logging in. Please try again.");
    }finally{
        set({isLoggingIn:false});
    }
},


logout: async () => {
    try{
        await axiosInstance.post("/auth/logout");
        set({authUser:null});
        toast.success("Logged out successful!");
    }
    catch(err){
        toast.error(err.response?.data?.message || "Error logging out. Please try again.");
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