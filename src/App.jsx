import { Routes, Route } from 'react-router-dom'
import { HomeCliente } from './pages/HomeClient'
import { Login } from './pages/Login'
import { AdminDashboard } from './pages/AdminDashboard'

function App() {
  return (
    <Routes>
      {/* Rota Raiz: O cliente acessa site.com e cai aqui */}
      <Route path="/" element={<HomeCliente />} />

      {/* Rota Login: O barbeiro acessa site.com/login */}
      <Route path="/login" element={<Login />} />

      {/* Rota Admin: O barbeiro acessa site.com/admin */}
      <Route path="/admin" element={<AdminDashboard />} />
    </Routes>
  )
}

export default App