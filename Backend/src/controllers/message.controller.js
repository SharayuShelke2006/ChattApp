import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";

export const getAllContacts= async(req, res) => {
   try{
    const loggedinUser=req.user._id;
    const filteredusers= await User.find({_id: {$ne: loggedinUser}}).select("-password");
    return res.status(200).json(filteredusers);
   } catch (error) {
  console.error("getAllContacts error:", error);
  return res.status(500).json({ message: error.message });
}

}

export const getMessagesByUserId = async (req, res) => {
  try {
    const { id:userToChatId} = req.params;
    const myid= req.user._id;
   const message = await Message.find({
      $or:[
         {senderId: myid, receiverId: userToChatId},
         {senderId: userToChatId, receiverId: myid}
      ]
   })
   return res.status(200).json(message);

  } catch (error) {  
      console.error("getMessagesByUserId error:", error);
  }
}

export const sendMessage = async (req, res) => {
   try { 
      const {text,image}= req.body;
      const {id:receiverId}= req.params;
      const senderId= req.user._id; 
      let imageURL;
      if(image){
         const uploadResponse = await cloudinary.uploader.upload(image);
         imageURL= uploadResponse.secure_url;
         const newMessage= new Message({
            senderId,
            receiverId, 
            text,
            image: imageURL
         });
         await newMessage.save();
         return res.status(201).json(newMessage);
      }
      else{
         const newMessage= new Message({
            senderId,
            receiverId, 
            text 
         });
         await newMessage.save();
         return res.status(201).json(newMessage);
      }  
      // todo : send messages in real time using sockets
   } catch (error) {
      console.error("sendMessage error:", error);
      return res.status(500).json({ message: error.message });
   }  
};

export const getChatPartners = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const loggedinuserid = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: loggedinuserid },
        { receiverId: loggedinuserid }
      ],
    });

    const chatPartnerIds = new Set(
      messages.map(msg =>
        msg.senderId.toString() === loggedinuserid.toString()
          ? msg.receiverId.toString()
          : msg.senderId.toString()
      )
    );

    const chatPartners = await User.find({
      _id: { $in: Array.from(chatPartnerIds) }
    }).select("-password");

    return res.status(200).json(chatPartners);
  } catch (error) {
    console.error("getChatPartners error:", error);
    return res.status(500).json({ message: error.message });
  }
};
