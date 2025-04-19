import { createLazyFileRoute } from '@tanstack/react-router'
import { useChat } from 'ai/react'
import { Excalidraw, WelcomeScreen } from '@excalidraw/excalidraw'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import { RefreshCcw } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {useEffect, useState} from 'react'
import { toast } from 'sonner'
import {Chat} from "@/components/ui/chat";

export const Route = createLazyFileRoute('/_protected/dashboard/canvas')({
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
  const [name, setName] = useState("");

  return (
    <div style={{ height: "500px"}}>
        <Excalidraw
          // excalidrawAPI={(api) => setExcalidrawAPI(api)}
          // initialData={{ appState: { theme: theme } }}
          renderTopRightUI={() => (
            <div className="flex gap-2">
              <Input
                onChange={(e) => setName(e.target.value)}
                value={name}
                className="w-40"
              />
              {/*<Button variant="secondary" onClick={setSceneData}>*/}
              {/*  Save*/}
              {/*</Button>*/}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    {/*<Button*/}
                    {/*  variant="secondary"*/}
                    {/*  size="icon"*/}
                    {/*  onClick={updateScene}*/}
                    {/*>*/}
                    {/*  <RefreshCcw className="h-5 w-5" />*/}
                    {/*</Button>*/}
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      Refreshes the page. This removes any unsaved changes. Use
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
  )
}
