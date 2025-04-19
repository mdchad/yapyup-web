import { createLazyFileRoute } from '@tanstack/react-router'
import { useChat } from "ai/react"
import { Chat } from "@/components/ui/chat"
import { Excalidraw } from "@excalidraw/excalidraw";

export const Route = createLazyFileRoute('/_protected/dashboard/chat')({
  component: RouteComponent,
})

function RouteComponent() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    append,
    isLoading,
    stop,
  } = useChat({
    api: "/api/chat"
})

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <Chat
          messages={messages}
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          isGenerating={isLoading}
          stop={stop}
          append={append}
          suggestions={[
            "Generate a tasty vegan lasagna recipe for 3 people.",
            "Generate a list of 5 questions for a frontend job interview.",
            "Who won the 2022 FIFA World Cup?",
          ]}
        />
      </div>
    </div>
  )
}
