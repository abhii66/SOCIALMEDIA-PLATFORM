import exp from 'express'
import { config } from 'dotenv'
import { connect } from 'mongoose'
import { userApp } from './APIs/UserAPI.js'
import { postApp } from './APIs/PostAPI.js'
import { adminApp } from './APIs/AdminAPI.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import cron from 'node-cron'

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
app.use('/admin-api',adminApp)
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

//scheduling
cron.schedule('0 0 * * *', async () => {
    const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    await PostModel.deleteMany({ isPostActive: false, deletedAt: { $lte: cutoff } })
    console.log("Cleaned up posts deleted more than 30 days ago")
})