import {createLazyFileRoute, useNavigate} from '@tanstack/react-router'
import { supabase } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {useAuthContext} from "@/lib/auth/use-auth-context";

export const Route = createLazyFileRoute('/_protected/dashboard/account')({
  component: Dashboard,
})

function Dashboard() {
  const navigate = useNavigate()
  const { user } = useAuthContext();

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    // navigate({ to: '/sign-in' })
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading...</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Account</h1>
          <Button variant="outline" onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Welcome, {user.email}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Email</h3>
                <p className="text-gray-600">{user.email}</p>
              </div>
              <div>
                <h3 className="font-medium">Last Sign In</h3>
                <p className="text-gray-600">
                  {new Date(user.last_sign_in_at).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 