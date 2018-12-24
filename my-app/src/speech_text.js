import React, {Component } from 'react'
import Speech from 'react-speech'
import SpeechRecognition from 'react-speech-recognition'

class App extends Component {
  state={
  }
  
  render() {
    const { transcript, resetTranscript, browserSupportsSpeechRecognition} = this.props
    if (!browserSupportsSpeechRecognition) {
      return null
    }
    return (
      <div>
        <button onClick={resetTranscript}>Reset</button><br/>
        <span>Hello{transcript}</span>
       <Speech text="Akash Sahu" voice="Google UK English Female"/>
      </div>
    )
  }
}

export default SpeechRecognition(App)