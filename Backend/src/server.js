import express from 'express';
import path from 'path';
const app = express();
const __dirname=path.resolve();
import dotenv from 'dotenv';
import authRoutes from './routes/auth.route.js'; 
import messageRotes from './routes/message.route.js';  
dotenv.config({ path: './src/.env' });
console.log("process.env.PORT =", process.env.PORT);
const PORT=process.env.PORT || 3000;
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRotes);
//deployment ready
console.log("NODE_ENV =", process.env.NODE_ENV);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../Frontend/dist')));

    app.get('*', (_, res) => {
        res.sendFile(
            path.resolve(__dirname, '../Frontend/dist', 'index.html')
        );
    });
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
