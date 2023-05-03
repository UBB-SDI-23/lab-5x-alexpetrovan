import * as React from 'react'
import './App.css'
import { AllProductions } from './components/productions/ProductionShowAll'
import Home from './components/homePage'
import {NavBar} from './components/NavBar'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ProductionDetails } from './components/productions/ProductionDetailed'
import { ProductionDelete } from './components/productions/ProductionDelete'
import { ProductionAdd } from './components/productions/ProductionAdd'
import { ProductionUpdate } from './components/productions/ProductionUpdate'
import { AllMovies } from './components/movies/MovieShowAll'

function App() {
  return (
    <React.Fragment>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/productions" element={<AllProductions />} />
          <Route path="/productions/:productionId/details" element={<ProductionDetails/>}/>
          <Route path="/productions/:productionId/edit" element={<ProductionUpdate/>}/>
          <Route path="/productions/:productionId/delete" element={<ProductionDelete />} />
          <Route path="/productions/add" element={<ProductionAdd />} />
          <Route path="/movies" element={<AllMovies />} />
          <Route path="/movies/:movieId/details" element={<AllMovies />} />
          <Route path="/movies/:movieId/edit" element={<AllMovies />} />
          <Route path="/movies/:movieId/delete" element={<AllMovies />} />
          <Route path="/movies/add" element={<AllMovies />} />
        </Routes>
      </Router>
    </React.Fragment>
  )
}

export default App
