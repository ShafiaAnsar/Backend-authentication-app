import express from "express"
import http from "http"
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import compression from "compression"
import cors from "cors"
import mongoose, { mongo } from "mongoose"
const app = express()
 app.use(cors({
    credentials:true
 }))
 app.use(compression())
 app.use(cookieParser())
 app.use(bodyParser.json())

 const server = http.createServer(app)
 app.listen(8000,()=>{
    console.log("Server is running on http://localhost:8000")
 })
 const MongoURL = "mongodb+srv://shafiaansar:athentication@cluster0.rjesorw.mongodb.net/?retryWrites=true&w=majority"
 mongoose.Promise=Promise
 mongoose.connect(MongoURL)
 mongoose.connection.on('error',(error:Error)=>{
    console.log(error)
 })