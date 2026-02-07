import { AdminDashboard } from './pages/AdminDashboard'
import { HomeCliente } from './pages/HomeCliente'
import { Login } from './pages/Login'
import { MeusServicos } from './pages/MeusServicos'
import { AgendamentoCliente } from './pages/AgendamentoCliente'
import { Routes, Route } from 'react-router-dom'

function App() {
  return (
      <Routes>
        <Route path="/" element={<h1>Página Inicial do App</h1>} />
        <Route path="/:slug" element={<HomeCliente />} />
        <Route path="/:slug/agendar" element={<AgendamentoCliente />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/servicos" element={<MeusServicos />} />
      </Routes>
  )
}

export default App