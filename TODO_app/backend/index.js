import express from 'express';
import cors from "cors"
import todoRoutes from "./routes/todos.js"
import dotenv from "dotenv"

dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();

// Enable CORS for frontend
// Enable CORS for frontend
app.use(cors({
    origin: [
        'http://localhost:5173', 
        'http://localhost:5174', 
        'http://localhost:5175',
        'https://todo-app-theta-swart.vercel.app', // Link chính
        'https://todo-c0icj74hj-huyhoangs-projects-697ead7f.vercel.app' // Thêm link preview này vào!
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(express.json());

app.use("/todos", todoRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});