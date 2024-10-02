// import { saveAs } from 'file-saver';
import OpenAI from "openai";

export const getAIMessage = async (userQuery) => {

  const message = 
    {
      role: "assistant",
      content: "Connect your backend here...."
    }

  return message;
};

const openai = new OpenAI({
  apiKey: 'REPLACEWITHAPI',
  dangerouslyAllowBrowser: true 
});

export async function getTranscription(file) {
  if (!file) {
    throw new Error("No file provided");
  }
  console.log(file)
  try {
    const transcription = await openai.audio.transcriptions.create({
      file: file, 
      model: "whisper-1",
    });

    return transcription.text; 
  } catch (error) {
    console.error("Error during transcription:", error);
    throw new Error("Error during transcription");
  }
}