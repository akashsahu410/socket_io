import React from 'react'
import io from 'socket.io-client'
import {uniqBy} from 'lodash'
import $ from 'jquery'
let socket=io('http://localhost:4000')   //pass server port number NOT react port number

class Chat extends React.Component {
  state={
    username:this.props.username,
    message:"",
    currentUserSocketId:"",
    reciverName:"",
    receiverSocketId:"",
    one_one:false
  }
  //to enable the group chat
  groupChat=()=>{
    console.log("inside the groupchat")
    this.setState({one_one:false,reciverName:"",receiverSocketId:""})
    console.log("state after click on group",this.state)
  }
  //one to one chat
  singleChat=(e)=>{
      console.log("inside the single chat",e.target.id,e.target.name);
      this.setState({reciverName:e.target.name,receiverSocketId:e.target.id})
      socket.emit('current_user',{
          senderName:this.state.username,
          reciverName:this.state.reciverName,
          receiver:this.state.receiverSocketId,
          sender:this.state.currentUserSocketId,
      })
  }
  //to send messages in group
  sendMessage=()=>{
    let doc=document.getElementById("chat-window")
    doc.scrollTop = doc.scrollHeight
    socket.emit("chat",{
      username:this.state.username,
      message:this.state.message
    })
    this.setState({message:""})
  }
  //to send one to one msg
  sendOneMessage=()=>{
    let doc=document.getElementById("mario-chat")
    doc.scrollTop = doc.scrollHeight
    socket.emit("one_chat",{
      sender:this.state.username,
      message:this.state.message,
      receiver:this.state.reciverName
    })
    this.setState({message:""})
  }
//typing for one to one chat
  sendOneTyping=()=>{
    console.log("inside the single typing console",socket.id)
    socket.emit("one_typing",{
      sender:this.state.username,
      receiver:this.state.reciverName
    })
  }
  //typing for group chat
  sendTyping=()=>{
    console.log("inside the typing console",socket.id)
    socket.emit("typing",this.state.username)
  }
  // socket.on('chat',)
  handleChange=(e)=>{
    this.setState({[e.target.name]:e.target.value})
  }

  //it will run in beginning
  componentDidMount(){
    this.initSocket()
  }
  //starting the socket 
  initSocket=()=>{
    // let socket=io('http://localhost:4000')   
    console.log("socket connected",socket)
    console.log("socket id",socket.id)
    this.setState({currentUserSocketId:socket.id})
    socket.emit("setUser",{
        username:this.state.username,
        socketid:socket.id
    })
    
    //data get from socket to show messages
    socket.on('chat',(data)=>{
      console.log("data return caught",data)
      console.log("state",this.state)
      document.getElementById("feedback").innerHTML=""
      document.getElementById("output").innerHTML+=`<p><b>${data.username.toUpperCase()}</b>:${data.message}</p>`
    })
    //data get from one to one chat to show messages
    socket.on('one_chat',(data)=>{
      console.log("data return caught of one to one",data)
      console.log("state",this.state)
      if(this.state.username === data.sender || this.state.username ===data.receiver){
        document.getElementById("feedback").innerHTML=""
        document.getElementById("output").innerHTML+=`<p><b>${data.sender.toUpperCase()}</b>:${data.message}</p>`
      }
    })

    //to chat with one to one
    socket.on('current_user',(data)=>{
      console.log("result caught",data)
      if(data.receiver === this.state.currentUserSocketId || data.sender === this.state.currentUserSocketId){
        console.log("inside the if function",this.state)
       alert(`${data.senderName} and ${data.reciverName} connected`)
       console.log(" after alert state",this.state)
        this.setState({one_one:true})
        if(this.state.username === data.senderName){
          this.setState({reciverName:data.reciverName})
        }
        else {
          this.setState({reciverName:data.senderName})
        }
      }
    })


    //to set the online users list
    socket.on('setUser',(data)=>{
        console.log("all users",data)
        document.getElementById("online").innerHTML=""
        let users=uniqBy(data)
        console.log("result after modifying",users)
        for(let i=0;i<users.length;i++){
            if(users[i].username !== this.state.username){
                document.getElementById("online").innerHTML+=
                `<button id=${users[i].socketid} name=${users[i].username}>${users[i].username}</button><br/><br/>`
                // $(`#${users[i].socketid}`).click(this.singleChat)
            }
        }
        document.getElementById('online').addEventListener('click',this.singleChat,false)

    })

    
    //data get from socket of typing
    socket.on('typing',(data)=>{
      console.log("typing data caught",data,socket.id)
      if(this.props.username !== data){
        document.getElementById("feedback").innerHTML=`<p><em>${data.toUpperCase()} is typing..</em></p>`
      }
      
      //to hide typing status when user is idle
        setTimeout(()=>{
            document.getElementById("feedback").innerHTML=""            
        },2000)
    })

    //data get from one to one typing
    socket.on('one_typing',(data)=>{
      console.log("typing data caught of one one",data,socket.id)
      console.log("state",this.state)
      if(this.state.username ===data.receiver ){
        document.getElementById("feedback").innerHTML=`<p><em>${data.sender.toUpperCase()} is typing..</em></p>`
      }
      
      //to hide typing status when user is idle
        setTimeout(()=>{
            document.getElementById("feedback").innerHTML=""            
        },2000)
    })
 }
  render() { 
    return (
      <div id="mario-chat">
       <center><h1 style={{color:"green"}}>Online</h1></center><br/>
       <p>Click on users who are online to start one to one conversation</p>
        <div id="online">
        </div>

       
        <div>
          <center><h2><a><button style={{backgroundColor:"orange"}}onClick={this.groupChat}>Group Chat</button></a></h2></center><br/>
       <p>Click on Group chat to start group conversation</p>

          <div id="chat-window">
            <div id="output"></div>
            <div id="feedback" > </div>     
          </div>
      </div>
    
      <input id="handle" type="text" value={this.state.username} name="username"/>
      <input id="message" type="text" value={this.state.message} placeholder="Message" name="message" onChange={this.handleChange} onKeyPress={this.state.one_one ? this.sendOneTyping :this.sendTyping} />
      <button id="send" onClick={this.state.one_one ? this.sendOneMessage : this.sendMessage}>Send</button>
  </div>
      
    )
  }
}
export default Chat