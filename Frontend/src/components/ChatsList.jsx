import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import NoChatsFound from "./NoChatsFound";
import { useAuthStore } from "../store/useAuthStore";

function ChatsList() {
  const {
    getMyChatPartners,
    chats,
    isUsersLoading,
    setSelectedUser,
    selectedUser
  } = useChatStore();

  const { onlineUsers } = useAuthStore();

  useEffect(() => {
    getMyChatPartners();
  }, [getMyChatPartners]);

  if (isUsersLoading) return <UsersLoadingSkeleton />;
  if (chats.length === 0) return <NoChatsFound />;

  return (
    <>
      {chats.map((chat) => (
        <div
          key={chat._id}
          className={`p-4 rounded-lg cursor-pointer transition-colors
            ${selectedUser?._id === chat._id
              ? "bg-cyan-600/30"
              : "bg-cyan-500/10 hover:bg-cyan-500/20"
            }`}
          onClick={() => setSelectedUser(chat)}
        >
          <div className="flex items-center gap-3">
            <div className={`avatar ${onlineUsers.includes(chat._id) ? "online" : "offline"}`}>
              <div className="size-12 rounded-full">
                <img src={chat.profilePic || "/avatar.png"} alt={chat.fullName} />
              </div>
            </div>

            <div className="flex items-center gap-2">
              {chat.unread && (
                <span className="w-2 h-2 rounded-full bg-white"></span>
              )}

              <h4 className="text-slate-200 font-medium truncate">
                {chat.fullName}
              </h4>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

export default ChatsList;
