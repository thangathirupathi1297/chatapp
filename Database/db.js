const mongoose=require('mongoose')
const db=()=>{
    
//config framework
//dburl

const dbURI='mongodb+srv://maniuser:thanga1297@Mydb.npgpw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'


  mongoose.connect(dbURI)
  .then(()=>console.log('db connected'))
  .catch(err=>{console.log(err)})

}


module.exports=db