import React,{Component} from 'react'
import Chat from './chat'
class App extends Component{
  state={
    username:"",
    flag:false,
    valid:""
  }

  handleChange=(e)=>{
    this.setState({[e.target.name]:e.target.value})
  }

  submit=(e)=>{
    e.preventDefault()
    this.setState({valid:""})
    if(this.state.username.length>0){
      this.setState({flag:true})
    }
    else{
      this.setState({valid:"Invalid name"})
    }

  }
  render(){
    return(
      <div id="mario-chat">
      
        {this.state.flag ? <Chat username={this.state.username}/> : 
          <div>
          <input id="handle" name="username" type="text" value={this.state.username} placeholder="Enter username" onChange={this.handleChange}/>
          <p>{this.state.valid.length>0 ? this.state.valid : ""}</p>
          <button id="send" onClick={this.submit}>Send</button>
        </div>
        }
      </div>
    )
  }
}
export default App