'use client'

import React, { useState, useEffect } from 'react'

const SpeechRecognitionComponent = () => {
  const [transcript, setTranscript] = useState('')
  const recognition = new ((window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition)()

  useEffect(() => {
    recognition.lang = 'vi-VN'
    recognition.continuous = false
    recognition.interimResults = false

    recognition.onresult = (event: any) => {
      const result = event.results[0][0].transcript
      setTranscript(result)
    }

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error)
    }

    return () => {
      recognition.abort()
    }
  }, [recognition])

  const startRecognition = () => {
    recognition.start()
  }

  return (
    <div className="flex flex-col justify-center items-center gap-10">
      <button
        className="p-9 rounded-xl bg-gray-400 hover:bg-opacity-10"
        onClick={startRecognition}
      >
        Start Listening
      </button>
      <p>Transcript: </p>
      {/* loading style when script loadded */}
      <div className="p-3 rounded-xl bg-gray-200 w-1/2 text-black">
        {transcript}
      </div>
    </div>
  )
}

export default SpeechRecognitionComponent
