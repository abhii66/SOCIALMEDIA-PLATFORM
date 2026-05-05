import exp from 'express'
import { config } from 'dotenv'
import { connect } from 'mongoose'
import { userApp } from './APIs/UserAPI.js'
// import { adminApp } from './APIs/AdminAPI.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { postApp } from './APIs/PostAPI.js'
config()
const app = exp()
//body parser
app.use(cors({
    origin: function(origin, callback) {
        const allowedOrigins = [
            'http://localhost:5173'
        ];
        
        // allow all vercel preview URLs
        if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}))
app.use(exp.json())
//cookie parser
app.use(cookieParser())
app.use('/user-api',userApp)
app.use('/post-api',postApp)
const port=process.env.PORT
//connect to db
// console.log("ENV:", process.env.MONGO_URI);
async function connectDB(){
    try{
        await connect(process.env.DB_URL);
        console.log("DB connection success.")
        
        //start server
        app.listen(port,()=>console.log(`server on port ${port}...`))
    } catch(err) {
        console.log("Error in DB connection :", err)
    }
}

connectDB();
//to handle invalid path
app.use((req,res,next)=>{
    console.log(req.url)
    res.status(404).json({message:`path ${req.url} is invalid`})
})

// error handling middleware
// app.use((err, req, res, next) => {
//   console.log("Error name:", err.name);
//   console.log("Error code:", err.code);
//   console.log("Error cause:", err.cause);
//   console.log("Full error:", JSON.stringify(err, null, 2));
//   //ValidationError
//   if (err.name === "ValidationError") {
//     return res.status(400).json({ message: "error occurred", error: err.message });
//   }
//   //CastError
//   if (err.name === "CastError") {
//     return res.status(400).json({ message: "error occurred", error: err.message });
//   }
//   const errCode = err.code ?? err.cause?.code ?? err.errorResponse?.code;
//   const keyValue = err.keyValue ?? err.cause?.keyValue ?? err.errorResponse?.keyValue;

//   if (errCode === 11000) {
//     const field = Object.keys(keyValue)[0];
//     const value = keyValue[field];
//     return res.status(409).json({
//       message: "error occurred",
//       error: `${field} "${value}" already exists`,
//     });
//   }

//   //send server side error
//   res.status(500).json({ message: "error occurred", error: "Server side error" });
// });

//error => {name,message,callstack}
