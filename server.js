const express=require('express')
const studentRoute=require('./routers/student.route')
const userRoute=require('./routers/user.route')
const adminRoute=require('./routers/admin.route')
const app=express()
require('dotenv').config()

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin',"*")
    res.setHeader('Access-Control-Request-Method' ,"*")
    res.setHeader('Access-Control-Allow-Headers',"*")
    res.setHeader('Access-Control-Allow-Methods',"*")
    next()
    })

app.use('/',studentRoute)
app.use('/',userRoute)
app.use('/admin',adminRoute)

app.listen(3000,()=>console.log('server run in port 3000'))