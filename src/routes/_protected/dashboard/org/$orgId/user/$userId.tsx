import { useEffect, useState } from 'react'
import { useAuthContext } from '@/lib/auth/use-auth-context'
import { supabase } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { createFileRoute, Link, useRouterState } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import { init } from '@paralleldrive/cuid2'
import { EditIcon } from 'lucide-react'
import {createClient} from "@supabase/supabase-js";

export const Route = createFileRoute(
  '/_protected/dashboard/org/$orgId/user/$userId',
)({
  component: RouteComponent,
  loader: async ({ params, context }) => {
    const { data: user, error: usersError } = await supabase
      .from('users')
      .select(
        `
          id,
          email,
          user_id,
          name,
          organisation_id
        `,
      )
      .eq('id', params.userId)
      .single()

    if (usersError) {
      return usersError
    }

    return user
  },
})


function RouteComponent() {
  const user = Route.useLoaderData()
  const [currentUser, setCurrentUser] = useState(user)

  async function handleSubmit(e) {
    e.preventDefault();
  }

  function handleChange() {}

  return (
    <div>
      <main className="flex-1 flex flex-col py-12 px-6">
        <div className="flex flex-col gap-6 px-30">
          <h2 className="text-xl font-semibold">General details</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" value={currentUser.name || ''} onChange={handleChange} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="slug">Email</Label>
                <div className="flex gap-2">
                  <Input
                    id="email"
                    name="email"
                    value={currentUser.email || ''}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>
            <Button type="submit" className="w-full">{'Update'}</Button>
          </form>
        </div>
      </main>
    </div>
  )
}
