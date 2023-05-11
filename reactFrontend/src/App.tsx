import * as React from 'react'
import './App.css'
import { AllProductions } from './components/productions/ProductionShowAll'
import Home from './components/homePage'
import { NavBar } from './components/NavBar'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ProductionDetails } from './components/productions/ProductionDetailed'
import { ProductionDelete } from './components/productions/ProductionDelete'
import { ProductionAdd } from './components/productions/ProductionAdd'
import { ProductionUpdate } from './components/productions/ProductionUpdate'
import { AllMovies } from './components/movies/MovieShowAll'
import { AllActors } from './components/actors/ActorsShowAll'
import { AllContracts } from './components/contracts/ContractsShowAll'
import { UserDetails } from './components/users/UserDetails'
import Login from './components/authentication/login'
import { AuthProvider } from "./auth";

function App() {
  return (

    <React.Fragment>
      <Router>
        <AuthProvider>
          <NavBar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/productions" element={<AllProductions />} />
            <Route path="/productions/:productionId/details" element={<ProductionDetails />} />
            <Route path="/productions/:productionId/edit" element={<ProductionUpdate />} />
            <Route path="/productions/:productionId/delete" element={<ProductionDelete />} />
            <Route path="/productions/add" element={<ProductionAdd />} />
            <Route path="/movies" element={<AllMovies />} />
            <Route path="/actors" element={<AllActors />} />
            <Route path="/contracts" element={<AllContracts />} />
            <Route path="/user/:username" element={<UserDetails />} />
          </Routes>
        </AuthProvider>
      </Router>
    </React.Fragment>
  )
}

export default App
