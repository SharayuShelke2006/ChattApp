import { create } from "zustand";
import { toast } from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

export const useChatStore = create((set, get) => ({

  allContacts: [],
  chats: [],
  messages: [],
  activeTab: 'chats',
  selectedUser: null,
  isUserLoading: false,
  isMessagesLoading: false,

  isSoundEnabled: JSON.parse(localStorage.getItem("isSoundEnabled")) ?? true,

  toggleSound: () => {
    const next = !get().isSoundEnabled;

    localStorage.setItem("isSoundEnabled", JSON.stringify(next));

    set({ isSoundEnabled: next });
  },

  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedUser: (user) => set({ selectedUser: user }),

  getAllContacts: async () => {
    set({ isUserLoading: true });
    try {
      const res = await axiosInstance.get("/messages/contacts");
      set({ allContacts: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch contacts");
    } finally {
      set({ isUserLoading: false });
    }
  },

  getMyChatPartners: async () => {
    set({ isUserLoading: true });
    try {
      const res = await axiosInstance.get("/messages/chats");
      set({ chats: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch chats");
    } finally {
      set({ isUserLoading: false });
    }
  },
  getMessagesByUserID: async (userID) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userID}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch messages");
    } finally {
      set({ isMessagesLoading: false });
    }  },

    sendMessage: async(messageData) =>{
      const {selectedUser,messages}=get();
      const {authUser}=useAuthorStore.getState();
      const tempId=`temp-${Date.now()}`;
      const optimisticMessage = {
        _id:tempId,
        senderId: authUser._id,
        reveiverId:selectedUser._id,
        text:messageData.text,
        image:messageData.image,
        createdAt : new Date().toISOString(),
        isOptimistic:true,
      }
      //immediately update ui using msg
      set({messages:[...messages,optimisticMessage]})
      try{
        const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`,messageData);
        set({messages:messages.concat(res.data)})
      }catch(error){
        //remove optimistic msg on error
        set({messages:messages})
        toast.error(error.response?.data?.message || "Failed to send messages");
      }
    }
}));
