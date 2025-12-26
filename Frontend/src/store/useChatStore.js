import { create } from "zustand";
import { toast } from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import {useAuthStore} from "./useAuthStore";
const notificationSound = new Audio("/sounds/notification.mp3")

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
 setSelectedUser: (user) => {
  const updated = get().chats.map(chat =>
    chat._id === user?._id ? { ...chat, unread: false } : chat
  );

  set({
    selectedUser: user,
    chats: updated
  });
},


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
      set({
          chats: res.data.map(chat => ({ ...chat, unread: false }))
        });

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
      const {authUser}=useAuthStore.getState();
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
    },
   subscribeToMessages: () => {
  const socket = useAuthStore.getState().socket;
  if (!socket) return;

  socket.on("newMessage", (newMessage) => {
    const { selectedUser, messages, chats, isSoundEnabled } = get();

    const isCurrentChat =
      selectedUser && newMessage.senderId === selectedUser._id;

    // 1️⃣ If inside current chat → append message
    if (isCurrentChat) {
      set({ messages: [...messages, newMessage] });
    }

    // 2️⃣ Check if sender already exists in chat list
    const existingChat = chats.find(c => c._id === newMessage.senderId);

    let updatedChats;

    if (existingChat) {
      // 2a️⃣ Update unread + move to top
      const mapped = chats.map(chat =>
        chat._id === newMessage.senderId
          ? { ...chat, unread: !isCurrentChat }
          : chat
      );

      const senderChat = mapped.find(c => c._id === newMessage.senderId);
      const rest = mapped.filter(c => c._id !== newMessage.senderId);

      updatedChats = [senderChat, ...rest];
    } else {
      // 2b️⃣ Sender NOT in chat list → create new chat entry
      const newChat = {
        _id: newMessage.senderId,
        fullName: newMessage.senderName ?? "New User",
        profilePic: newMessage.senderPic ?? "/avatar.png",
        unread: !isCurrentChat,
        lastMessage: newMessage
      };

      updatedChats = [newChat, ...chats];
    }

    set({ chats: updatedChats });

    // 3️⃣ Play sound ONLY if message not in open chat
    if (isSoundEnabled && !isCurrentChat) {
      notificationSound.currentTime = 0;
      notificationSound.play().catch(() => {});
    }
  });
},



  unsubscribeFromMessages: () => {
  const socket = useAuthStore.getState().socket;
  if (!socket) return;

  socket.off("newMessage");
},

}));
