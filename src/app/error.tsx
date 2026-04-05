'use client'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Something went wrong</h1>
      <p className="text-lg text-gray-600 mb-8">An unexpected error occurred.</p>
      <button
        onClick={reset}
        className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition"
      >
        Try Again
      </button>
    </div>
  )
}
