import { createLazyFileRoute } from '@tanstack/react-router'
import { useChat } from "ai/react"
import { Chat } from "@/components/ui/chat"
import { Excalidraw } from "@excalidraw/excalidraw";
import {Dropzone, DropzoneContent, DropzoneEmptyState} from "@/components/ui/dropzone";
import {useEffect, useRef, useState} from "react";
import {Button} from "@/components/ui/button";
import {useCompletion} from "@ai-sdk/react";

export const Route = createLazyFileRoute('/_protected/dashboard/transcribe')({
  component: RouteComponent,
})

function RouteComponent() {
  const [files, setFiles] = useState<File[] | undefined>();
  const [transcriptData, setTranscriptData] = useState(null);
  const [audioUrl, setAudioUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleDrop = (files: File[]) => {
    const file = files[0];

    console.log(files);
    setFiles(files);

    const objectUrl = URL.createObjectURL(file);
    setAudioUrl(objectUrl);
  };

  const handleSubmit = async () => {
    if (!files || files.length === 0) {
      console.error("No files selected");
      return;
    }

    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("file", file);
      });

      const response = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setTranscriptData(data);

      // Handle the transcription result here
    } catch (error) {
      console.error("Error transcribing audio:", error);
    } finally {
      setIsLoading(false)
    }
  };

  return (
    <div className="bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <Dropzone
          maxSize={1024 * 1024 * 10}
          minSize={1024}
          maxFiles={10}
          accept={{ 'audio/mpeg': [] }}
          onDrop={handleDrop}
          src={files}
          onError={console.error}
        >
          <DropzoneEmptyState />
          <DropzoneContent />
        </Dropzone>
        <div className="mt-6">
          <Button onClick={handleSubmit}>Submit</Button>
        </div>
      </div>

      {isLoading && <p className="text-center my-8">Processing transcription...</p>}

      {transcriptData && audioUrl && (
        <TranscriptHighlighter
          audioSrc={audioUrl}
          transcript={transcriptData}
        />
      )}

      {!transcriptData && !isLoading && audioUrl && (
        <div className="text-center my-8">
          <p>No transcription available yet. Upload an audio file to see the transcript.</p>
        </div>
      )}
    </div>
  )
}

const TranscriptHighlighter = ({ audioSrc, transcript }) => {
  const {
    complete,
    completion,
    isLoading: isSummarizing
  } = useCompletion({
    api: "/api/summarise", // You'll need to set up this endpoint
  })

  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef(null);
  const transcriptRef = useRef(null);
  const [summary, setSummary] = useState('');

  // Update the current time of the audio player
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  // Get the full transcript text and words with timestamps
  const fullTranscript = transcript?.results?.channels[0]?.alternatives[0]?.transcript || '';
  const words = transcript?.results?.channels[0]?.alternatives[0]?.words || [];

  // Find which word should be highlighted based on current playback time
  const currentWordIndex = words.findIndex(
    word => currentTime >= word.start && currentTime <= word.end
  );

  // Prepare data for rendering
  const prepareHighlightedText = () => {
    // Create array of words with their highlight status
    return words.map((word, index) => ({
      text: word.punctuated_word || word.word,
      isActive: index === currentWordIndex,
      start: word.start,
      end: word.end
    }));
  };

  const highlightedWords = prepareHighlightedText();

  // Handle clicking on a word to jump to that timestamp
  const handleWordClick = (start) => {
    if (audioRef.current) {
      audioRef.current.currentTime = start;
      if (audioRef.current.paused) {
        audioRef.current.play();
      }
    }
  };

  // Scroll active word into view
  useEffect(() => {
    if (currentWordIndex >= 0 && transcriptRef.current) {
      const activeElement = transcriptRef.current.querySelector('.active-word');
      if (activeElement) {
        activeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    }
  }, [currentWordIndex]);

  // Handle summarize button click
  const handleSummarize = async () => {
    try {
      const result = await complete(fullTranscript);
      setSummary(result);
    } catch (error) {
      console.error("Error generating summary:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto my-8">
      <div className="mb-6">
        <audio
          ref={audioRef}
          controls
          src={audioSrc}
          onTimeUpdate={handleTimeUpdate}
          className="w-full"
        />
      </div>

      <div
        ref={transcriptRef}
        className="p-6 border rounded-lg bg-gray-50 h-64 overflow-y-auto leading-relaxed text-lg w-full flex flex-wrap content-start"
      >
        {highlightedWords.map((word, index) => (
          <span
            key={`word-${index}`}
            className={`
              cursor-pointer 
              mx-1 
              hover:bg-blue-50 
              ${word.isActive ? 'active-word border-b-2 border-blue-500 bg-blue-100' : 'border-b-2 border-transparent'}
            `}
            onClick={() => handleWordClick(word.start)}
            data-start={word.start}
            data-end={word.end}
          >
            {word.text}
          </span>
        ))}
      </div>

      <div className="mt-4 text-gray-500 text-sm">
        <div className="flex gap-2">
          <Button 
            className="rounded-full" 
            onClick={handleSummarize}
            disabled={isSummarizing}
          >
            {isSummarizing ? "Summarizing..." : "Summarize"}
          </Button>
          <Button className="rounded-full">Diagram</Button>
        </div>
        <p className="mt-2 text-gray-600">
          Click on any word to jump to that position in the audio
        </p>
      </div>

      {summary && (
        <div className="mt-6 p-4 border rounded-lg bg-white">
          <h3 className="text-lg font-medium mb-2">Summary</h3>
          <p className="text-gray-700">{summary}</p>
        </div>
      )}
    </div>
  );
};
