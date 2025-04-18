import { createLazyFileRoute } from '@tanstack/react-router'
import { useEffect, useRef, useState } from "react"
import { AudioVisualizer } from "@/components/ui/audio-visualizer"
import { Button } from "@/components/ui/button"

// Add type declarations for Speech Recognition API
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
}

interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
  length: number;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

export const Route = createLazyFileRoute('/_protected/dashboard/audio')({
  component: RouteComponent,
})

function RouteComponent() {
  const [isRecording, setIsRecording] = useState(false)
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null)
  const [chatHistory, setChatHistory] = useState<Array<{ role: string; content: string }>>([
    {
      role: "system",
      content: "You are conversational and give short responses of no more than 3 sentences, no matter how complex the question. If you get a complex topic, you will engage in conversation rather than give a long response"
    }
  ])
  const [currentlySpeaking, setCurrentlySpeaking] = useState<"user" | "assistant" | null>(null)
  const speechRecognitionRef = useRef<SpeechRecognition | null>(null)
  const voiceRef = useRef<SpeechSynthesis>(window.speechSynthesis)

  const startChat = async () => {
    setIsRecording(true)
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      console.error("Speech recognition not supported")
      return
    }

    speechRecognitionRef.current = new SpeechRecognition()
    letUserSpeak()
  }

  const stopChat = () => {
    setIsRecording(false)
    if (currentlySpeaking === "user") stopUserRecording()
    if (voiceRef.current.speaking) voiceRef.current.cancel()
    setCurrentlySpeaking(null)
    speechRecognitionRef.current = null
  }

  const appendContent = ({ role, content }: { role: string; content: string }) => {
    setChatHistory(prev => [...prev, { role, content }])
  }

  const letUserSpeak = async () => {
    setCurrentlySpeaking("user")
    try {
      const newStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      })
      setAudioStream(newStream)
      
      console.log("oii")
      if (speechRecognitionRef.current) {
        speechRecognitionRef.current.start()
        speechRecognitionRef.current.onresult = (e: SpeechRecognitionEvent) => {
          const { transcript } = e.results[0][0]
          appendContent({ role: "user", content: transcript })
          stopUserRecording()
          letAISpeak()
        }
      }
    } catch (error) {
      console.error("Error accessing microphone:", error)
    }
  }

  const letAISpeak = async () => {
    console.log(chatHistory)
    setCurrentlySpeaking("assistant")
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: chatHistory
        }),
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
        }
      })
      const data = await response.json()
      const { content } = data.choices[0].message
      appendContent({ role: "assistant", content })

      const spokenResponse = new SpeechSynthesisUtterance(content)
      spokenResponse.onend = () => letUserSpeak()
      voiceRef.current.speak(spokenResponse)
    } catch (error) {
      console.error("Error getting AI response:", error)
    }
  }

  const stopUserRecording = () => {
    if (audioStream) {
      audioStream.getTracks().forEach(track => track.stop())
      setAudioStream(null)
    }
    if (speechRecognitionRef.current) {
      speechRecognitionRef.current.stop()
    }
  }

  useEffect(() => {
    return () => {
      stopChat()
    }
  }, [])

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Audio Chat</h1>
        <Button 
          onClick={() => isRecording ? stopChat() : startChat()}
          variant={isRecording ? "destructive" : "default"}
        >
          {isRecording ? "Stop" : "Start"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="h-[300px]">
          <AudioVisualizer
            stream={audioStream}
            isRecording={isRecording}
            onClick={() => isRecording ? stopChat() : startChat()}
          />
        </div>

        <div className="h-[300px] overflow-y-auto border rounded-lg p-4">
          {chatHistory.map((message, index) => (
            <div
              key={index}
              className={`mb-2 p-2 rounded-lg ${
                message.role === "user" 
                  ? "bg-primary text-primary-foreground ml-4" 
                  : "bg-muted mr-4"
              }`}
            >
              {message.content}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
