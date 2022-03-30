const express = require("express");
const UserModel=require('../Schemas/UserSchema')
const auth=require('../jwt/auth')


const Router=express.Router()

Router.post('/user',auth,(req,res)=>{
    const {name}=req.body
    const newUser=UserModel({
      Name:name,
      groupid:req.Group._id
    })
    newUser.save().then(user=>{
      res.send(user)}
      )
    .catch(err=>console.log(err,'er'))
    req.io.on('connection', socket =>{
        socket.on('joined',(text)=>{
          console.log("user joined" ,"bhvvbcvbcvcvbc")
        })
      })
  })
  
  Router.get('/userlist',auth,(req,res)=>{
   req.io.on('connection', () =>{
      console.log('a user is connected')
     })
   UserModel.find({groupid:req.Group._id}).populate({
    path: "groupid",
    select: "groupname",
  })
   .then(result=>{
    res.send(result) 
  })
   .catch(err=>{console.log(err)})
  })

  module.exports = Router;