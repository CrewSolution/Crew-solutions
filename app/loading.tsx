import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-yellow-50">
      <Loader2 className="h-12 w-12 animate-spin text-yellow-500" />
    </div>
  )
}
