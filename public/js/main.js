function pageRedirect(key) {
    if(key===1)
    {
        window.location.href='createroom.html'
    }else if(key===2)
    {
        window.location.href='joinroom.html'
    }else if(key===3)
    {
        window.location.href='AddUser.html'
    }
    else if(key===4)
    {
        window.location.href='Room.html'
    }
    else if(key=5){
      window.location.href='/'
    }
  }

const socket = io();
  
  function createroom(){
      const name=document.getElementById('Name').value
      const password=document.getElementById('password').value
      const warning=document.getElementById('errordiv');
      if(!name||!password)
      {
         warning.innerHTML='field is empty'
         setTimeout(()=>{warning.innerHTML=''},2000)
         return 
      }
      fetch('/create',{
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name:name,
          password:password,
        }),
      }).then((response) => {
        var statuscode=response.status
      
            response.json().then((data) => {
                if(statuscode===200)
                {

                    pageRedirect(2)
                }else{
                    warning.innerHTML=data
                    setTimeout(()=>{warning.innerHTML=''},2000) 
                }
            })
        
        
        })
      .catch(err=>{console.log(err)})
  }

  const joinroom=()=>{
    const name=document.getElementById('Name').value
    const password=document.getElementById('password').value
    const warning=document.getElementById('errordiv');
    if(!name||!password)
    {
       warning.innerHTML='field is empty'
       setTimeout(()=>{warning.innerHTML=''},2000)
       return 
    }
    fetch('/signin',{
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name:name,
        password:password,
      }),
    }).then((response) => {
      var statuscode=response.status
    
          response.json().then((data) => {
              if(statuscode===200)
              {
                  localStorage.setItem("jwt",data.toke)
                  localStorage.setItem("group",data.result)
                  pageRedirect(3)
              }else{
                  warning.innerHTML=data.msg
                  setTimeout(()=>{warning.innerHTML=''},2000) 
              }
          })
      
      
      })
    .catch(err=>{console.log(err)})
  }

  const AddUser=()=>{
    const name=document.getElementById('Name').value
    const warning=document.getElementById('errordiv');
    if(!name)
    {
       warning.innerHTML='field is empty'
       setTimeout(()=>{warning.innerHTML=''},2000)
       return 
    }
    const token=localStorage.getItem('jwt')
    fetch('/user',{
      method: "post",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token":token
      },
      body: JSON.stringify({
        name:name,
      }),
    }).then((response) => {
      var statuscode=response.status
    
          response.json().then((data) => {
              if(statuscode===200)
              {
    
               
                localStorage.setItem("user",data._id)
                localStorage.setItem('name',name)
                pageRedirect(4)
              }else{
                  warning.innerHTML=data.msg
                  setTimeout(()=>{warning.innerHTML=''},2000) 
              }
          })
      
      
      })
    .catch(err=>{console.log(err)})
  }




  const getuserlist=()=>{
    const userList=document.getElementById('userlists')
    const token=localStorage.getItem('jwt')
    fetch('/userlist',{
      method: "get",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token":token
      },
    }).then((response) => {
      var statuscode=response.status
    
          response.json().then((data) => {
              if(statuscode===200)
              {
               data.map(i=>{
                const node = document.createElement("li");
                const textnode = document.createTextNode(i.Name);
                node.appendChild(textnode);
                  userList.appendChild(node) 
               })
              }
          })
      })
    .catch(err=>{console.log(err)})
  }
  const getMessage=()=>{
    
    const singleMessage=document.getElementById('singleMessage')
    const token=localStorage.getItem('jwt')
    fetch('/msglist',{
      method: "get",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token":token
      },
    }).then((response) => {
      var statuscode=response.status
          response.json().then((data) => {
              if(statuscode===200)
              {
               data.map(i=>{
                const userMassage=document.createElement("div")
                userMassage.className="userMassage"
                  userMassage.innerHTML=`<h5 class="userName">${i.postby.Name}</h5>
                         
                        <p class="userText">${i.Message}</p>`
                 singleMessage.appendChild(userMassage) 
               })
              }
          })
      })
    .catch(err=>{console.log(err)})
}
const addMsg= (data)=>{
  var objDiv = document.getElementById("singleMessage");
  fetch('/singleMessage/',{
    method: "get",
    headers: {
      "Content-Type": "application/json",
      'x-auth-token':data.postby
    },
  }).then((response)=>{

    response.json().then(async(datas) => {
       var  name=datas.postby.Name
       const singleMessage=document.getElementById('singleMessage')
       const userMassage=document.createElement("div")
         userMassage.className="userMassage"
           userMassage.innerHTML=`<h5 class="userName">${name}</h5>
                  
                 <p class="userText">${data.Message}</p>`
             singleMessage.appendChild(userMassage) 
             document.getElementById('messagevalue').value=""

             objDiv.scrollTop = objDiv.scrollHeight;
      return true;
       
        })
  }).catch(err=>{console.log(err)})
}
const newUser=(i)=>{
  console.log(i)
  const userList=document.getElementById('userlists')
  const node = document.createElement("li");
                const textnode = document.createTextNode(i.user.Name);
                node.appendChild(textnode);
                  userList.appendChild(node) 

}
socket.on('message',addMsg)
socket.on('user',newUser)
  const postMsg=()=>{
    
    var scrollDiv = document.getElementById("content-message");
    scrollDiv.scrollTop = scrollDiv.scrollHeight;
    const token=localStorage.getItem('jwt')
    const  message=document.getElementById('messagevalue').value
    const userid=localStorage.getItem('user')
    if(!message){
        return
    }
    fetch('/message',{ 
        
        method: "post",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token":token
        },
        body: JSON.stringify({
          message:message,
          userid:userid
        }),
      }).then((response) => {
        var statuscode=response.status
      
            response.json().then((data) => {
                if(statuscode===200)
                {
                  return
                }
            })
        
        
        })
      .catch(err=>{console.log(err)})
     
  }
  const pre=(e)=>{
    const form=document.getElementById('textLoad')
    form.addEventListener("submit", postMsg, true);
    e.preventDefault()
    postMsg()
  }

  

  const onloaddata=()=>{
    const token=localStorage.getItem('jwt')
    console.log(token)

    if(token!=null)
    {
      var objDiv = document.getElementById("singleMessage");
      getMessage();
      getuserlist()
      
      setInterval(function(){  objDiv.scrollTop = objDiv.scrollHeight;}, 2000)
    }else{
  pageRedirect(5)
    }

   
}



   