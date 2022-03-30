const express = require("express");
const GroupModel=require('../Schemas/GroupSchema')
const bcrypt = require("bcryptjs");
const{ tokengenarator }=require('../jwt/Jwt')


const Router=express.Router()

Router.post('/create',(req,res)=>{

 

    const Group=req.body;
     console.log(Group.name,typeof(Group))
     const {name,password}=Group
    GroupModel.findOne({groupname:name})
    .then(async(result)=>{
      if(result)
      {
        res.status(409).json(`Group name already exists`)
        return
      }
      const salt = await bcrypt.genSalt(10);
      const hassed = await bcrypt.hash(password, salt);
     
        const newGroup=new GroupModel(
          {
            groupname:name,
            password:hassed
          }
      
        )
        newGroup.save().then(group=>{res.send(group)})
        .catch(err=>console.log(err,'er'))
      })
      
  })
  
  Router.post('/signin',(req,res)=>{
  
    const {name,password}=req.body;
  
    if(!name||!password)
    {
      res.status(200).json("field is empty")
      return
    }
    GroupModel.findOne({groupname:name})
    .then(async(result)=>{
      if (!result) {
        res.status(400).json({ msg: "check Name or Password" });
        return;
    }
    const match = await bcrypt.compare(password, result.password);
    if(match)
    {
      const token = await tokengenarator(result._id);
      const obj={toke:token,result:result}
      
      res.status(200).json(obj)
    }else {
      res.status(400).json({ msg: "password did not matched" });
      return;
    }
    })
  
  
  })

  module.exports = Router;