const express=require('express')
const database=require('./Database/db')
const bodyParser=require('body-parser')
const path=require('path')
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

const Group=require('./Routes/groupRoutes')
const MsgRoute=require('./Routes/msgRoutes')
const UserRoute=require('./Routes/userRoutes')

app.use(function(req, res, next) {
  req.io = io;
  next();
})

app.use('/',Group)
app.use('/',MsgRoute)
app.use('/',UserRoute)


 server.listen(PORT,()=>{console.log(`server run on port ${PORT}`)})
