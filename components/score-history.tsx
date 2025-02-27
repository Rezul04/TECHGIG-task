"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Trash2 } from "lucide-react"

type ScoreData = {
  score: number
  total: number
  date: string
  time: string
}

export default function ScoreHistory({ onBack }: { onBack: () => void }) {
  const [scores, setScores] = useState<ScoreData[]>([])

  useEffect(() => {
    const storedScores = JSON.parse(localStorage.getItem("quizScores") || "[]")
    setScores(storedScores)
  }, [])

  const clearHistory = () => {
    localStorage.removeItem("quizScores")
    setScores([])
  }

  return (
    <Card className="p-6 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Score History</h2>
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
      </div>

      {scores.length === 0 ? (
        <p className="text-center text-gray-500 my-8">No quiz history yet.</p>
      ) : (
        <>
          <div className="space-y-3 mb-4 max-h-[300px] overflow-y-auto">
            {scores.map((scoreData, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">
                      Score: {scoreData.score}/{scoreData.total} (
                      {Math.round((scoreData.score / scoreData.total) * 100)}%)
                    </p>
                    <p className="text-sm text-gray-500">
                      {scoreData.date} at {scoreData.time}
                    </p>
                  </div>
                  <div
                    className={`text-sm font-medium px-2 py-1 rounded-full ${
                      scoreData.score / scoreData.total >= 0.7
                        ? "bg-green-100 text-green-800"
                        : scoreData.score / scoreData.total >= 0.4
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                    }`}
                  >
                    {scoreData.score / scoreData.total >= 0.7
                      ? "Great"
                      : scoreData.score / scoreData.total >= 0.4
                        ? "Good"
                        : "Needs Practice"}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Button variant="destructive" size="sm" onClick={clearHistory} className="w-full">
            <Trash2 className="h-4 w-4 mr-2" /> Clear History
          </Button>
        </>
      )}
    </Card>
  )
}

