import { createLazyFileRoute } from '@tanstack/react-router'
import { format } from 'date-fns'
import { Suspense } from 'react'
import {
  prefetchQuery,
} from '@supabase-cache-helpers/postgrest-react-query'
import { supabase } from '@/lib/supabase/client'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {useSuspenseQuery} from "@/lib/supabase/useSuspenseQuery";
import NotesSidebar from '@/components/NotesSidebar'

// Define the query function separate from the component for reuse
const getNotesQuery = () =>
  supabase.from('audio').select('id, url, users (name), created_at')

export const Route = createLazyFileRoute('/_protected/dashboard/notes')({
  component: RouteComponent,
})

function NotesLoadingFallback() {
  return (
    <div className="text-center py-8 text-muted-foreground">
      Loading notes...from prefetch
    </div>
  )
}

function RouteComponent() {
  return (
    <Suspense fallback={<NotesLoadingFallback />}>
      <NotesDisplay />
    </Suspense>
  )
}

function NotesDisplay() {
  // Use useQuery from supabase-cache-helpers, which will automatically use the same cache key
  // that was used during prefetching
  const { data: notes, isLoading, error } = useSuspenseQuery(getNotesQuery())

  // Error handling
  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        Error loading notes: {error.message}
      </div>
    )
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 items-start">
      <div className="flex-1 p-24">
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">
            Loading notes...
          </div>
        ) : !notes || notes.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No notes found.
          </div>
        ) : (
          <div className="grid gap-4">
            {notes.map((note) => (
              <Card key={note.id}>
                <CardHeader>
                  <CardTitle>
                    {note.created_at
                      ? format(new Date(note.created_at), 'PPpp')
                      : 'Untitled'}
                  </CardTitle>
                  <CardDescription>
                    {note.users?.name}
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
      <NotesSidebar />
    </div>
  )
}
