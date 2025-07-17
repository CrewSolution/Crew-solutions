import { Loader2 } from "lucide-react"

export default function SignupLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-yellow-500" />
        <p className="text-gray-600 dark:text-gray-400">Loading signup form...</p>
      </div>
    </div>
  )
}
