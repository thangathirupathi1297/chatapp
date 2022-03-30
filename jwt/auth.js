
const { tokenValidator }=require('./Jwt')
const GroupModel  = require('../Schemas/GroupSchema')
module.exports= async function(req,res,next)
{
   try
   {
      
    const token= req.header("x-auth-token")



    const valid= await tokenValidator(token)

    console.log(valid)

    if(valid) 
    {
        console.log(GroupModel)

        let Group= await GroupModel.findById(valid.id)
        // console.log(user)
        req.Group=Group
        next()
        return;
    }
   
   }
   catch(err)
   {
       console.log(err.message)
       res.status(401).json({msg:"invalid token"})
   }
    
}
