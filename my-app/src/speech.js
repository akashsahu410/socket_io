import React, {Component } from 'react'
import Speech from 'react-speech'

class App extends Component {
  state={
  }
  
  render() {
    return (
      <div>
       <Speech text="Hello Akash" voice="Google UK English Female"/>
      </div>
    )
  }
}
export default App