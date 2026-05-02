import express from 'express';
import cors from "cors"
import todoRoutes from "./routes/todos.js"
import dotenv from "dotenv"

dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();

// Enable CORS for frontend
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(express.json());

app.use("/todos", todoRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});