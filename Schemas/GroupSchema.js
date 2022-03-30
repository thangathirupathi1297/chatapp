const mongoose=require('mongoose')
const { required } = require('nodemon/lib/config')

const GroupSchema=mongoose.Schema({
    groupname:{
        type:String,
        required:true
    },
    password:{
        type:String,
            required:true
    }
})
const GroupModel=mongoose.model('Group',GroupSchema)
module.exports=GroupModel;