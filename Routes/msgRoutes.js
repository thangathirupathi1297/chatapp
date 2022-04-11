const express = require("express");
const MessageModel=require('../Schemas/MessageSchema')
const auth=require('../jwt/auth')


const Router=express.Router()
Router.get('/singleMessage',(req,res)=>{
  const data=req.header("x-auth-token")

  MessageModel.findOne({postby:data}).populate({path: "postby",
  select: "Name"}).then(result=>{
    res.status(200).json(result)
    return false
  })
})

Router.post('/message',auth,(req,res)=>{
    const {message,userid}=req.body
    const NewMessage=MessageModel({
      Message:message,
      postby:userid,
      Groupby:req.Group._id
    })
    NewMessage.save().then(Msg=>{
      req.io.emit('message', Msg);
      res.json(Msg)}
      )
    .catch(err=>console.log(err,'er'))
  })
  Router.get('/msglist',auth,(req,res)=>{
  
   MessageModel.find({Groupby:req.Group._id}).populate({
     path: "postby",
     select: "Name",
   }).populate({path: "Groupby",
   select: "groupname",})
    .then(result=>{
     res.send(result)})
    .catch(err=>{console.log(err)})
   })

   module.exports = Router;