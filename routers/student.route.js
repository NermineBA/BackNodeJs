const route= require('express').Router()
const studentModel=require('../models/student.model')
const jwt=require('jsonwebtoken')
require('dotenv').config()

/*
route.get('/',(req,res,next)=>{
    res.send('welcome to api')
    })
*/

var privateKey=process.env.PRIVATE_KEY

verifyToken=(req,res,next)=>{
let token=req.headers.authorization
if(!token){
    res.status(400).json({msg:'access rejected ..... !!!!'})
}
try{
    jwt.verify(token,privateKey)
    next()
}catch(e){
    res.status(400).json({msg:e})
}
}


// verify token for admin start here
verifyTokenAdmin=(req,res, next)=>{
    let token=req.headers.authorization
    let role=req.headers.role
    if(!token || role!='admin'){
    res.status(400).json({msg: 'access rejected ..... !!!!'})
    }
    try{
        jwt.verify(token,privateKey)
        next()
    }catch(e){
        res.status(400).json({msg:'there is a pronlem'})
    } 
    }
// verify token for admin end here



var secretkey=process.env.SECRET_KEY
var clientkey=process.env.CLIENT_KEY

verifySecretClient=(req,res,next)=>{
let sk=req.query.secret
let ck=req.query.client
if(sk == secretkey && ck==clientkey){
next()
}else{
res.status(400).json({error:"you can't access to this route because you don't sent me secret key and client key"})
}
}





route.get('/',(req,res,next)=>{
    studentModel.testConnect().then((msg)=>res.json(msg)).catch((err)=>res.json(err))
    })



route.post('/addstudent',verifyTokenAdmin,verifySecretClient,(req,res,next)=>{
    studentModel.postNewStudent(req.body.firstname,req.body.lastname,req.body.email,req.body.age,req.body.phone)
    .then((doc)=>res.status(200).json(doc))
    .catch((err)=>res.status(400).json({error:err}))
})




route.get('/students',verifyToken,verifySecretClient,(req,res,next)=>{
    studentModel.getAllStudents()
    .then((doc)=>res.status(200).send(doc))
    .catch((err)=>res.status(400).send(err))
})




route.get('/student/:id',verifyToken,verifySecretClient,(req,res,next)=>{
    studentModel.getOneStudent(req.params.id)
    .then((doc)=>res.status(280).json(doc))
    .catch((err)=>res.status(400).json(err))
})

route.delete('/student/:id',verifyTokenAdmin,verifySecretClient,(req,res,next)=>{
    studentModel.deleteOneStudent(req.params.id)
    .then((doc)=>res.status(200).json(doc))
    .catch((err)=>res.status(400).json(err))
})

route.patch('/student/:id',verifyTokenAdmin,verifySecretClient,(req,res,next)=>{
    studentModel.updateOneStudent(req.params.id,req.body.firstname,req.body.lastname,req.body.email,req.body.age,req.body.phone)
    .then((doc)=>res.status(200).json(doc))
    .catch((err)=>res.status(400).json(err))
})


module.exports=route