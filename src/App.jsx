import { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Pendencias from './pages/Pendencias'
import { pb } from './lib/pocketbase'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(pb.authStore.isValid)

  useEffect(() => {
    const unsub = pb.authStore.onChange(() => {
      setIsAuthenticated(pb.authStore.isValid)
    })
    return unsub
  }, [])

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/pendencias" /> : <Login />}
      />
      <Route
        path="/pendencias"
        element={isAuthenticated ? <Pendencias /> : <Navigate to="/login" />}
      />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  )
}

export default App
