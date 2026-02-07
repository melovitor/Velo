import { AdminDashboard } from './pages/AdminDashboard'
import { HomeCliente } from './pages/HomeCliente'
import { Login } from './pages/Login'
import { MeusServicos } from './pages/MeusServicos' // <--- 1. Importe aqui
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeCliente />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/servicos" element={<MeusServicos />} /> {/* <--- 2. Adicione aqui */}
      </Routes>
    </BrowserRouter>
  )
}

export default App