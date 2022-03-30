const jwt = require('jsonwebtoken')



const JWT_SECRET='Chatapp01'

// token genrator is genarates auth token 

// variable token is a payload and jwt_secret is a secretkey 
const tokengenarator=(id)=>{

    const token=jwt.sign({id},JWT_SECRET)
    return token;
}


// variable token is a payload and jwt_secret is a secretkey 
const tokenValidator=async(token)=>{

    try
{
    const data =jwt.verify(token,JWT_SECRET)
    return data;
}
catch(err)
{
    res.send(err.message)
}

}

module.exports.tokenValidator= tokenValidator
module.exports.tokengenarator=tokengenarator