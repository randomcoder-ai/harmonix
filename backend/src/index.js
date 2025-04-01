import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js";
import adminRoutes from "./routes/admin.route.js";
import albumRoutes from "./routes/album.route.js";
import authRoutes from "./routes/auth.route.js";
import songRoutes from "./routes/song.route.js";
import statRoutes from "./routes/stat.route.js";
import {connectDB} from "./lib/db.js";
import { clerkMiddleware } from '@clerk/express';
import fileUpload from "express-fileupload";
import path from "path";
import cors from "cors";
import {createServer} from "http";
import {initializeSocket} from "./lib/socket.js";
import cron from "node-cron";
import fs from "fs";

dotenv.config();

const __dirname= path.resolve();
const app= express();
const PORT = process.env.PORT;

const httpServer = createServer(app);
initializeSocket(httpServer)

app.use(cors(
    {
        origin:"http://localhost:3000",
        credentials:true
    }
));

app.use(express.json());
app.use(clerkMiddleware()); 
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, "tmp"),
    createParentPath:true,
    limits: {
        fileSize: 10*1024*1024,
    },
}));

const tempDir = path.join(process.cwd(), "tmp");
//cron jobs
cron.schedule("0 * * * *",()=>{
    if(fs.existsSync(tempDir)){
        fs.readdir(tempDir, (err, files) => {
            if(err) {
                console.log("error", err);
                return;
            }
            for(const file of files) {
                fs.unlink(path.join(tempDir, file),(err) =>{});
            }    
        })
    }
})

app.use("/api/users",userRoutes);
app.use("/api/admin", adminRoutes );
app.use("/api/album", albumRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/songs", songRoutes);
app.use("/api/stats", statRoutes);

if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, "../frontend/dist")));
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "../frontend/dist/index.html"));
    });
}

app.use((err,req,res,next)=>{
    res.status(500).json({message : process.env.NODE_ENV === "production" ? "Internal Server Error" : err.message});
})

httpServer.listen(PORT,()=>{
    console.log("Server is running on port " +PORT);
    connectDB();
});

