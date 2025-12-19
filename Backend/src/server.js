import express from 'express';
const app = express();
import dotenv from 'dotenv';
import authRoutes from './routes/auth.route.js'; 
import messageRotes from './routes/message.route.js';  
dotenv.config();
const PORT=process.env.PORT || 3000;
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRotes);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
