import React from "react"
import {Link} from "react-router-dom"

export default function HomePage() {
  return (
    <div className="homepage">
      <h1 className="homepage--title">Quizzical</h1>
      <h3 className="homepage--h3">Let's get started!</h3>
      <Link to="/questions" className="questions">
        <button class="start-btn">Start Quiz</button>
      </Link>
    </div>
  )
}