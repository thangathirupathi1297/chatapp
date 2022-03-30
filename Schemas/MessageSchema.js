const mongoose=require('mongoose')
const { required } = require('nodemon/lib/config')

const MessageSchema=mongoose.Schema({
    Message:{
        type:String,
        required:true
    },
    postby:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
    },
    Groupby:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Group'
    }
})
const MessageModel=mongoose.model('Message',MessageSchema)
module.exports=MessageModel;