import {create} from 'zustand';

export const useAuthStore = create((set) => ({
  authUser:{name:"john doe",_id:"1234567890",age:21,email:"john@example.com"},
  isLoading: false,
  isLoggedIn:false,
  login:()=>{
    console.log("We just logged in");
    set({isLoggedIn:true})
    set({isLoading:true})
  }
}));