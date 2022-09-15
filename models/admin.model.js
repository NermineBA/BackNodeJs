const mongoose=require('mongoose')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
require('dotenv').config()

let schemaUser=mongoose.Schema({
username:String,
email:String,
password:String
})

let url=process.env.URL

var Admin=mongoose.model('admin',schemaUser)


exports.registerAdmin=(username,email,password)=>{
return new Promise((resolve,reject)=>{
    mongoose.connect(url,{useNewUrlParser:true,useUnifiedTopology:true}).then(()=>{
    return Admin.findOne({email:email})


    }).then((doc)=>{
    if(doc){
        mongoose.disconnect()
        reject('this email is exist')
        
    }else{
        bcrypt.hash(password,10).then((hashedPassword)=>{
            let user=new Admin({
            username:username,
            email:email,
            password:hashedPassword
            })

            user.save().then((user)=>{
                mongoose.disconnect()
                resolve(user)
            }).catch((err)=>{
                mongoose.disconnect()
                reject(err)
            })
         }).catch((err)=>{
            mongoose.disconnect()
            reject(err) 
            })
    }
    })
})
}

var privateKey=process.env.PRIVATE_KEY

exports.loginadmin=(email,password)=>{
    return new Promise((resolve,reject)=>{
    mongoose.connect(url,{useNewUrlParser:true,useUnifiedTopology:true}).then(()=>{
    return Admin.findOne({email:email})

    }).then((user)=>{ 
        if(!user){
            mongoose.disconnect()
            reject("invalid email and password")
    }else{
    bcrypt.compare(password,user.password).then((same)=>{
        if(same){
        // send token
        let token= jwt.sign({id:user._id,username:user.username,email:user.email,role:'Admin'},privateKey,{
            expiresIn:'24h',
            })
            mongoose.disconnect()
            resolve({token:token,role:'Admin',username:user.username})

        }else{
            mongoose.disconnect()
            reject('invalid password')
        }
    }).catch((err)=>{
        mongoose.disconnect()
        reject(err)
    })
}
}) 
})
}






















