import React, { useState } from "react";
import "./App.css";
import ChatWindow from "./components/ChatWindow";
import vmsg from 'vmsg';
import { getTranscription } from "./api/api";  

const recorder = new vmsg.Recorder({
  wasmURL:'https://unpkg.com/vmsg@0.3.0/vmsg.wasm'
});

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordings, setRecordings] = useState([]);
  const [transcription, setTranscription] = useState(""); 
  
  const handleRecording = async () => {
    if (isRecording) {
      setIsLoading(true);
      const blob = await recorder.stopRecording();
      const file = new File([blob], "recording.mp3", { type: "audio/mpeg" });
      setRecordings([file]); 
      setIsRecording(false);

      // After recording stops, start transcription
      try {
        const transcript = await getTranscription(file);  
        setTranscription(transcript);
      } catch (error) {
        console.error("Transcription error:", error);
      }

      setIsLoading(false);
    } else {
      // Start recording
      await recorder.init();
      recorder.startRecording();
      setIsRecording(true);
    }
  };

  return (
    <div className="App">
      <div className="heading">Instalily Voice-Activated Chatbot</div>
      <ChatWindow recording={recordings[0]} transcription={transcription} /> 
      <button onClick={handleRecording} disabled={isLoading}>
        {isRecording ? "Stop Recording" : "Start Recording"}
      </button>
    </div>
  );
}

export default App;
