"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle, XCircle, RotateCcw, Trophy, ArrowRight } from "lucide-react"
import { questions } from "@/data/questions"
import ScoreHistory from "@/components/score-history"

export default function Quiz() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null)
  const [score, setScore] = useState(0)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [shuffledQuestions, setShuffledQuestions] = useState(questions)
  const [showHistory, setShowHistory] = useState(false)

  // Shuffle questions on component mount
  useEffect(() => {
    const shuffled = [...questions].sort(() => Math.random() - 0.5)
    setShuffledQuestions(shuffled)
  }, [])

  const currentQuestion = shuffledQuestions[currentQuestionIndex]
  const isLastQuestion = currentQuestionIndex === shuffledQuestions.length - 1

  const handleAnswer = (answer: boolean) => {
    setSelectedAnswer(answer)
    if (answer === currentQuestion.answer) {
      setScore(score + 1)
    }
  }

  const handleNextQuestion = () => {
    if (isLastQuestion) {
      setQuizCompleted(true)
      // Save score to local storage
      const date = new Date().toLocaleDateString()
      const time = new Date().toLocaleTimeString()
      const scoreData = { score, total: shuffledQuestions.length, date, time }

      const existingScores = JSON.parse(localStorage.getItem("quizScores") || "[]")
      localStorage.setItem("quizScores", JSON.stringify([...existingScores, scoreData]))
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedAnswer(null)
    }
  }

  const resetQuiz = () => {
    setCurrentQuestionIndex(0)
    setSelectedAnswer(null)
    setScore(0)
    setQuizCompleted(false)
    const shuffled = [...questions].sort(() => Math.random() - 0.5)
    setShuffledQuestions(shuffled)
  }

  const toggleHistory = () => {
    setShowHistory(!showHistory)
  }

  if (showHistory) {
    return <ScoreHistory onBack={() => setShowHistory(false)} />
  }

  if (quizCompleted) {
    return (
      <Card className="p-6 shadow-lg">
        <div className="text-center">
          <Trophy className="w-16 h-16 mx-auto text-yellow-500 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Quiz Completed!</h2>
          <p className="text-lg mb-4">
            Your score: <span className="font-bold text-indigo-600">{score}</span> out of {shuffledQuestions.length}
          </p>
          <p className="text-gray-600 mb-6">
            {score === shuffledQuestions.length
              ? "Perfect score! You're a language expert!"
              : score > shuffledQuestions.length / 2
                ? "Great job! You know your languages well!"
                : "Keep learning! You'll improve with practice."}
          </p>
          <div className="flex flex-col gap-3">
            <Button onClick={resetQuiz} className="w-full">
              <RotateCcw className="mr-2 h-4 w-4" /> Try Again
            </Button>
            <Button onClick={toggleHistory} variant="outline" className="w-full">
              View Score History
            </Button>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6 shadow-lg">
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-500">
            Question {currentQuestionIndex + 1} of {shuffledQuestions.length}
          </span>
          <span className="text-sm font-medium text-indigo-600">Score: {score}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-indigo-600 h-2.5 rounded-full"
            style={{
              width: `${((currentQuestionIndex + 1) / shuffledQuestions.length) * 100}%`,
            }}
          ></div>
        </div>
      </div>

      <h3 className="text-xl font-medium mb-6">{currentQuestion.question}</h3>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <Button
          onClick={() => handleAnswer(true)}
          variant={selectedAnswer === true ? "default" : "outline"}
          disabled={selectedAnswer !== null}
          className="h-14"
        >
          True
        </Button>
        <Button
          onClick={() => handleAnswer(false)}
          variant={selectedAnswer === false ? "default" : "outline"}
          disabled={selectedAnswer !== null}
          className="h-14"
        >
          False
        </Button>
      </div>

      {selectedAnswer !== null && (
        <div
          className={`p-4 rounded-lg mb-6 ${
            selectedAnswer === currentQuestion.answer
              ? "bg-green-50 border border-green-200"
              : "bg-red-50 border border-red-200"
          }`}
        >
          <div className="flex items-start">
            {selectedAnswer === currentQuestion.answer ? (
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
            )}
            <div>
              <p
                className={`font-medium ${
                  selectedAnswer === currentQuestion.answer ? "text-green-700" : "text-red-700"
                }`}
              >
                {selectedAnswer === currentQuestion.answer ? "Correct!" : "Incorrect!"}
              </p>
              <p className="text-gray-600 mt-1">{currentQuestion.explanation}</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={toggleHistory} size="sm">
          View History
        </Button>
        {selectedAnswer !== null && (
          <Button onClick={handleNextQuestion}>
            {isLastQuestion ? "Finish Quiz" : "Next Question"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </Card>
  )
}

