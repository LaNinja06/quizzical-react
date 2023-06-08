import React, { useState } from 'react'
import { Routes, Route } from "react-router-dom"

import HomePage from '../components/Homepage'
import Questions from '../components/Questions'

export default function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route exact path="/questions" element={<Questions />}></Route>
      </Routes>
    </>
  )
}



