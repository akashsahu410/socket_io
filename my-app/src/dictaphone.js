import React, {Component } from 'react'
import SpeechRecognition from 'react-speech-recognition'

class Dictaphone extends Component {
  state={
    transcript:""
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
       
      </div>
    )
  }
}

export default SpeechRecognition(Dictaphone)