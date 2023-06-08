import React, { useState, useEffect } from "react"
import { decode } from "html-entities"
import { v4 as uuidv4 } from "uuid" 

export default function Questions() {
  const [quiz, setQuiz] = useState([])
  const [showAnswers, setShowAnswers] = useState(false)
  const [selectedAnswers, setSelectedAnswers] = useState([])
  const [scores, setScores] = useState(0)

  const url = "https://opentdb.com/api.php?amount=5&category=9&type=multiple"

  // creates an answer object with the provided answer and its status
  function extendAnswerObj(answer, isCorrect) {
      // Return an answer object with properties: id, answer, isCorrect, and selected
    return {
      id: uuidv4(),
      answer: decode(answer),
      isCorrect: isCorrect,
      selected: false
    }
  }

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
      const res = await fetch(url)
      const data = await res.json()

      // Map the results from the fetched data to create an array of quiz questions
      const results = data.results.map((result, index) => {
      
      // Map the incorrect answers from the result to create an array of answer objects
      const answers = result.incorrect_answers.map(answer => {
        // Create an answer object using the extendAnswerObj function with isCorrect set to false
        return extendAnswerObj(answer, false)
      });
      
      // Create an answer object for the correct answer and push it to the answers array
        answers.push(extendAnswerObj(result.correct_answer, true))

      // Shuffle the answers array randomly
      answers.sort(() => 0.5 - Math.random())
    
      // Return an object representing a quiz question with its id, question, and answers
        return {
          id: uuidv4(),
          question: result.question,
          answers: answers
        }
      })
      setQuiz(results)
    } catch (error) {
      console.log(error)
    }
}
  fetchQuestions()
}, [])


  // handles the selected answers  
  function handleSelectedAnswers(questionIndex, selectedAnswerIndex) {
    setSelectedAnswers(prevSelectedAnswers => {
      // Create a new array by spreading the previous selected answers
      const updatedSelectedAnswers = [...prevSelectedAnswers];
      // Update the selected answer for the specific question index
      updatedSelectedAnswers[questionIndex] = selectedAnswerIndex
      return updatedSelectedAnswers
    });
  }

  // checks the selected answers and calculate the score
  function checkAnswersBtn() {
    setShowAnswers(true); 
    // Calculate the score by iterating over selectedAnswers array
    const score = selectedAnswers.reduce((totalScore, answerIndex, index) => {
      // Check if the answerIndex is not undefined and the corresponding answer exists in the quiz data
      if (answerIndex !== undefined && quiz[index].answers[answerIndex]) {
        // Check if the selected answer is correct
        if (quiz[index].answers[answerIndex].isCorrect) {
          // Increment the total score by 1 if the answer is correct
          return totalScore + 1
        }
      }
      return totalScore
    }, 0)
    setScores(score)
  } 

  // resets the quiz app to play again
  function playAgainBtn() {
    setShowAnswers(false)
    setScores(0)
    setQuiz([])
    setSelectedAnswers([])

    fetchQuestions()
  }

  return (
    <div className="quiz--container">
    {showAnswers ? (
      <>
        {quiz.map((question, index) => (
          <div className="quiz--questions" key={index}>
            <h3 className="questions">{decode(question.question)}</h3>
            <div className="answers">
              {question.answers.map((answer, i) => (
                <button
                  className={`answers-btn
                    ${showAnswers && answer.isCorrect ? "correct" : ""}
                    ${selectedAnswers[index] === i ? "selected" : ""}`}
                  key={i}
                  onClick={() => handleSelectedAnswers(index, i)}
                >
                  {decode(answer.answer)}
                </button>
              ))}
            </div>
          </div>
        ))}
        <div className="scores-container">
        <p className="scores">
            You scored {scores}/{quiz.length} correct answers
          </p>
          <button className="playAgain-btn" onClick={playAgainBtn}>
            Play Again!
          </button>
        </div>
      </>
    ) : (
      <div className="quiz--container">
        {quiz.length > 0 ? (
          quiz.map((question, index) => (
            <div className="quiz--questions" key={index}>
              <h3 className="questions">{decode(question.question)}</h3>
              <div className="answers">
                {question.answers.map((answer, i) => (
                  <button
                    className={`answers-btn ${
                      selectedAnswers[index] === i ? "selected" : ""
                    }`}
                    key={i}
                    onClick={() => handleSelectedAnswers(index, i)}
                  >
                    {decode(answer.answer)}
                  </button>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p>Loading...</p>
        )}
        <button className="checkAnswer-btn" onClick={checkAnswersBtn}>
          Check answers
        </button>
      </div>
    )}
    </div>  
  )
}