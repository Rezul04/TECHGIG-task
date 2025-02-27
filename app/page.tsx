import Quiz from "@/components/quiz"

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md w-full">
        <h1 className="text-3xl font-bold text-center text-indigo-800 mb-2">Language Learning Quiz</h1>
        <p className="text-center text-gray-600 mb-6">Test your knowledge about languages with this True/False quiz!</p>
        <Quiz />
      </div>
    </main>
  )
}

