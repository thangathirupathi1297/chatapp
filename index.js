const express=require('express')
const database=require('./Database/db')
const GroupModel=require('./Schemas/GroupSchema')
const UserModel=require('./Schemas/UserSchema')
const MessageModel=require('./Schemas/MessageSchema')
const bodyParser=require('body-parser')
const bcrypt = require("bcryptjs");
const path=require('path')
 const{ tokengenarator }=require('./jwt/Jwt')
 const auth=require('./jwt/auth')
database()
const app=express()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
const http = require('http');
const socketio = require('socket.io');
const server = http.createServer(app);
const io = socketio(server);
const PORT=process.env.PORT||3000

app.use(function(req, res, next) {
  req.io = io;
  next();
})


io.on('connection', () =>{
  console.log('a user is connected')
 })

// io.on('connection', socket =>{
//   socket.on('joined',(text)=>{
//     console.log("user joined" ,text)
//   })
// })

// io.on('connection', socket => {
//   socket.on('join',console.log('join'))
// })
app.post('/create',(req,res)=>{

 

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

app.post('/signin',(req,res)=>{

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

app.post('/user',auth,(req,res)=>{
  const {name}=req.body
  const newUser=UserModel({
    Name:name,
    groupid:req.Group._id
  })
  newUser.save().then(user=>{
    res.send(user)}
    )
  .catch(err=>console.log(err,'er'))

})

app.get('/userlist',auth,(req,res)=>{
  io.on('connection', () =>{
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


app.get('/singleMessage',(req,res)=>{

  MessageModel.find({postby:req.query.id}).populate({path: "postby",
  select: "Name"}).then(result=>{
  
    res.status(200).json(result)
  })
})


app.post('/message',auth,(req,res)=>{
  
  const {message,userid}=req.body
 

  const NewMessage=MessageModel({
    Message:message,
    postby:userid,
    Groupby:req.Group._id
  })
  NewMessage.save().then(Msg=>{
    io.emit('message', Msg);
    res.json(Msg)}
    )
  .catch(err=>console.log(err,'er'))
})
app.get('/msglist',auth,(req,res)=>{
  req.io.on('connection', socket =>{
    socket.on('joined',(text)=>{
      console.log("user joined" ,text)
    })
  })
  console.log(req.io.on)
 
 MessageModel.find({Groupby:req.Group._id}).populate({
   path: "postby",
   select: "Name",
 }).populate({path: "Groupby",
 select: "groupname",})
  .then(result=>{
   res.send(result)})
  .catch(err=>{console.log(err)})
 })

 server.listen(PORT,()=>{console.log(`server run on port ${PORT}`)})
