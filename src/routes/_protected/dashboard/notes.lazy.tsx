import { createLazyFileRoute } from '@tanstack/react-router'
import { useChat } from "ai/react"
import { Chat } from "@/components/ui/chat"
import { Excalidraw } from "@excalidraw/excalidraw";
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { format } from "date-fns"

export const Route = createLazyFileRoute('/_protected/dashboard/notes')({
  component: RouteComponent,
})

function RouteComponent() {
  const [notes, setNotes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from("audio")
        // .select("*")
        .select("id, url, users (name), created_at")
        // .order("created_at", { ascending: false })
      if (!error && data) setNotes(data)

      console.log(data)
      setLoading(false)
    }
    fetchNotes()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading notes...</div>
          ) : notes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No notes found.</div>
          ) : (
            <div className="grid gap-4">
              {notes.map(note => (
                <Card key={note.id}>
                  <CardHeader>
                    <CardTitle>
                      {note.created_at ? format(new Date(note.created_at), "PPpp") : "Untitled"}
                    </CardTitle>
                    <CardDescription>
                      {note.users.name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {note.url ? (
                      <audio controls src={note.url} className="w-full" />
                    ) : (
                      <span className="text-muted-foreground">No audio file</span>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
