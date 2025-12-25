import { useAuthStore } from "../store/useAuthStore";
function ChatPage() {   
    //   const {authUser,isLoading,login}=useAuthStore();
    const {logout}=useAuthStore();
     
    return (
        <div>Chat Page
           <button
  onClick={() => {console.log("CLICK WORKED"); logout() } }
  className="fixed top-4 right-4 z-[9999]"
  style={{ pointerEvents: "auto" }}
>
  Logout
</button>


        </div>
    )
}
export default ChatPage;