import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import PostRouter from "./routes/Posts.js";
import GenerateImageRouter from "./routes/GenerateImage.js";


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({limit:"50mb"}));
app.use(express.urlencoded({extended:true}));

//errors handler
app.use((err,req,res,next)=>{
    const status=err.status || 500;
    const message=err.message || "Something went wrong";
    return res.status(status).json({
        success:false,
        status,
        message,
    })
});

app.use("/api/post",PostRouter);
app.use("/api/generateImage",GenerateImageRouter);

//Default get
app.get("/", async(req,res)=>{
    res.status(200).json({
        success:true,
        message:"Welcome developers to the AI image generation APP",
    });
});

//function to connect to the database
const connectDB = ()=>{
    mongoose.set("strictQuery",true);
    mongoose.connect(process.env.MONGODB_URL).then(()=>{
        console.log("Database connected");
    }).catch((err)=>{
        console.log("Database not connected");
        console.error(err);
    });


}


//function to start the server
const startServer = async()=>{
    try{
        app.listen(8000,()=>{
            console.log(`Server is running on port 8000`);
        });
    }catch(err){
        console.log(err);
    }
};

startServer();