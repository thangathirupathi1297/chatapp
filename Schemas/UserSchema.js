const mongoose=require('mongoose')



const UserSchema=mongoose.Schema({
    Name:{
        type:String,
        required:true
    },
    groupid:
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:'Group'
    }

})

module.exports=mongoose.model('User',UserSchema)