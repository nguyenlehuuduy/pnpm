// components/SpeechToText.js
import React, { useState } from 'react'
import { OpenAI } from 'openai'

const SpeechToText = () => {
  const [transcript, setTranscript] = useState('')

  const handleSpeechRecognition = async () => {
    // Code to start speech recognition using OpenAI module
    // const openai = new OpenAI(`${process.env.OPENAI_API_KEY}`);
    // const response = await openai.languageModel({
    //   model: 'gpt-3.5-turbo',
    //   prompt: 'Start your speech here...',
    //   max_tokens: 50,
    // });
    // setTranscript(response.choices[0].text.trim());
  }

  return (
    <div className="p-4">
      <button
        onClick={handleSpeechRecognition}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Start Speech Recognition
      </button>
      {transcript && (
        <div className="mt-4">
          <p className="text-gray-800">{transcript}</p>
        </div>
      )}
    </div>
  )
}

export default SpeechToText
