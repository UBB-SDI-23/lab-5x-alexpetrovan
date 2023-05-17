import * as React from 'react'
import './App.css'
import { AllProductions } from './components/productions/ProductionShowAll'
import Home from './components/homePage'
import { NavBar } from './components/navBar'
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
import { Register } from './components/authentication/register'
import PrivateRoute from './components/privateRoute'
import AdminRoute from './components/adminRoute'
import { AllUsers } from './components/users/UserShowAll'

function App() {
  return (

    <React.Fragment >
      <Router>
        <AuthProvider>
          <NavBar />
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/productions" element={<AllProductions />} />
            <Route path="/productions/:productionId/details" element={<PrivateRoute><ProductionDetails /></PrivateRoute>} />
            <Route path="/productions/:productionId/edit" element={<PrivateRoute><ProductionUpdate /></PrivateRoute>} />
            <Route path="/productions/:productionId/delete" element={<PrivateRoute><ProductionDelete /></PrivateRoute>} />
            <Route path="/productions/add" element={<PrivateRoute><ProductionAdd /></PrivateRoute>} />
            <Route path="/movies" element={<AllMovies />} />
            <Route path="/actors" element={<AllActors />} />
            <Route path="/contracts" element={<AllContracts />} />
            <Route path="/users/:username" element={<PrivateRoute><UserDetails /></PrivateRoute>} />
            <Route path="/users" element={<AdminRoute><AllUsers /></AdminRoute>} />
          </Routes>
        </AuthProvider>
      </Router>
    </React.Fragment>
  )
}

export default App
