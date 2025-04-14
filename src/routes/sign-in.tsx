import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { LoginForm } from "@/components/login-form"

export const Route = createFileRoute('/sign-in')({
  component: SignIn,
})

function SignIn() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-6">
        <LoginForm />
      </div>
    </div>
  )
}
