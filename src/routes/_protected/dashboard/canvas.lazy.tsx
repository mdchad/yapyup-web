import { createLazyFileRoute } from '@tanstack/react-router'
import { useChat, useCompletion } from 'ai/react'
import { Excalidraw, WelcomeScreen, convertToExcalidrawElements } from '@excalidraw/excalidraw'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import { RefreshCcw } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { toast } from 'sonner'
import { Chat } from "@/components/ui/chat"
import { parseMermaidToExcalidraw } from "@excalidraw/mermaid-to-excalidraw"

export const Route = createLazyFileRoute('/_protected/dashboard/canvas')({
  component: RouteComponent,
})

function RouteComponent() {
  // Chat functionality
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    append,
    isLoading: isChatLoading,
    stop,
  } = useChat({
    api: "/api/chat"
  })

  // Separate completion API for generating mermaid diagrams
  const {
    complete,
    completion,
    isLoading: isCompletionLoading,
  } = useCompletion({
    api: "/api/completion", // You'll need to set up this endpoint
  })

  const [name, setName] = useState("")
  const [mermaidSyntax, setMermaidSyntax] = useState("")
  const [converting, setConverting] = useState(false)
  const [canSave, setCanSave] = useState(false)
  const [excalidrawAPI, setExcalidrawAPI] = useState(null)
  const [showExcalidraw, setShowExcalidraw] = useState(false)

  // Function to request mermaid diagram from the LLM
  const requestMermaidDiagram = async () => {
    if (messages.length === 0) {
      toast("No content to visualize", {
        description: "Chat with the AI first to generate content.",
      })
      return
    }

    setConverting(true)

    // Get the last AI message (not user message)
    const lastAiMessage = [...messages]
      .reverse()
      .find(message => message.role === "assistant")

    if (!lastAiMessage) {
      toast("No AI response to visualize", {
        description: "There must be an AI response to generate a diagram from.",
      })
      setConverting(false)
      return
    }

    // Create a prompt that asks the LLM to convert the last message to a mermaid diagram
    const mermaidPrompt = `Based on the following content, generate a mermaid diagram that visualizes the key concepts, the details and explanation, and their relationships:
    
${lastAiMessage.content}

`
// Generate a Mermaid \`flowchart TD\` string based on \`relationships["details"]\`, using indices to identify nodes (potentially translated names) and the concise \`label\` (potentially translated) for edges.
// Please respond with ONLY the mermaid syntax (without any markdown or explanation), starting with \`\`\`mermaid and ending with \`\`\`.
// Use flowchart, mindmap, or another appropriate diagram type.`

    try {
      // Use the completion API to get the mermaid syntax
      const response = await complete(mermaidPrompt)
      console.log(response)

      // Extract mermaid syntax from the response
      const mermaidMatch = response.match(/```mermaid([\s\S]*?)```/)

      if (mermaidMatch && mermaidMatch[1]) {
        const extractedSyntax = mermaidMatch[1].trim()
        setMermaidSyntax(extractedSyntax)
        setShowExcalidraw(true)
        toast("Mermaid diagram generated", {
          description: "Click 'Convert to Excalidraw' to visualize.",
        })
      } else {
        toast("No valid mermaid syntax found", {
          description: "The AI didn't generate a proper mermaid diagram. Try again.",
        })
      }
    } catch (error) {
      toast("Failed to generate diagram", {
        description: `Error: ${error.message}`,
      })
    } finally {
      setConverting(false)
    }
  }

  // Function to convert mermaid to Excalidraw
  const generateExcalidraw = async () => {
    if (!mermaidSyntax) {
      toast("No mermaid syntax to convert", {
        description: "Generate mermaid diagram first.",
      })
      return
    }

    setConverting(true)
    try {
      console.log(mermaidSyntax)
      const { elements, files } = await parseMermaidToExcalidraw(mermaidSyntax)
      const convertedElements = convertToExcalidrawElements(elements)
      console.log("heyyy", convertedElements)

      excalidrawAPI?.updateScene({
        elements: convertedElements,
        appState: { fileHandle: files },
      })

      setCanSave(true)
      toast("Diagram converted to Excalidraw", {
        description: "You can now edit the diagram.",
      })
    } catch (e) {
      toast("An error occurred", {
        description: `Error: ${e}`,
      })
    } finally {
      setConverting(false)
    }
  }

  return (
    <div className="flex h-full">
      <div className={`${showExcalidraw ? 'w-1/2' : 'w-full'} p-4`}>
        <div className="flex gap-2 mt-4">
          <Button
            onClick={requestMermaidDiagram}
            disabled={isChatLoading || isCompletionLoading || converting || messages.length === 0}
          >
            Generate Mermaid Diagram
          </Button>
          {mermaidSyntax && (
            <Button
              onClick={generateExcalidraw}
              disabled={converting || !mermaidSyntax}
            >
              Convert to Excalidraw
            </Button>
          )}
        </div>
        <Chat
          messages={messages}
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          isGenerating={isChatLoading}
          stop={stop}
          append={append}
        />

        {/*{mermaidSyntax && (*/}
        {/*  <div className="mt-4 p-4 border rounded-md bg-gray-50">*/}
        {/*    <h3 className="font-medium mb-2">Generated Mermaid Syntax:</h3>*/}
        {/*    <pre className="whitespace-pre-wrap bg-gray-100 p-2 rounded text-sm overflow-auto max-h-40">*/}
        {/*      {mermaidSyntax}*/}
        {/*    </pre>*/}
        {/*  </div>*/}
        {/*)}*/}
      </div>

      {showExcalidraw && (
        <div className="w-1/2 h-full border-l">
          <Excalidraw
            excalidrawAPI={(api) => setExcalidrawAPI(api)}
            renderTopRightUI={() => (
              <div className="flex gap-2">
                <Input
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  placeholder="Diagram name"
                  className="w-40"
                />
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="secondary"
                        size="icon"
                        onClick={() => {
                          if (window.confirm("Reset diagram? Unsaved changes will be lost.")) {
                            excalidrawAPI?.resetScene();
                          }
                        }}
                      >
                        <RefreshCcw className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        Resets the diagram. This removes any unsaved changes. Use
                        with caution.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            )}
            autoFocus
          >
            <WelcomeScreen />
          </Excalidraw>
        </div>
      )}
    </div>
  )
}