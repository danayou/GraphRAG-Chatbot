import React, { useState, useEffect } from "react";
import "./ChatWindow.css";
import { getTranscription } from "../api/api";

function ChatWindow({ recording }) {
  const [transcription, setTranscription] = useState(""); 
  const [query, setQuery] = useState(""); 
  
  useEffect(() => {
    const fetchTranscription = async () => {
      if (recording) {
        try {
          const transcriptionText = await getTranscription(recording);
          console.log(transcriptionText)
          setTranscription(transcriptionText);
        } catch (error) {
          console.error("Error fetching transcription:", error);
          setTranscription("Error fetching transcription.");
        }
      }
    };
    fetchTranscription();
  }, [recording]);

  useEffect(() => {
    const fetchQuery = async () => {
      if (transcription) {
        try {
          const response = await fetch('http://0.0.0.0:8080/query', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ question: transcription }),
          });
          console.log(response)

          if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
          }

          const data = await response.json();
          console.log(data)
          const content = data.answer || "No content available";
          setQuery(content);
        } catch (error) {
          console.error('Error fetching query:', error);
          setQuery("Error fetching query.");
        }
      }
    };
    fetchQuery();
  }, [transcription]);

  return (
    <div className="messages-container">
      <div className="user-message-container">
        <div className="message user-message">
          <div>{query || "Loading..."}</div>
        </div>
      </div>
    </div>
  );
}

export default ChatWindow;
