import {createLazyFileRoute, useNavigate} from '@tanstack/react-router'
import { supabase } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {useAuthContext} from "@/lib/auth/use-auth-context";

export const Route = createLazyFileRoute('/_protected/dashboard/')({
  component: Dashboard,
})

function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
        </div>
      </div>
    </div>
  )
} 