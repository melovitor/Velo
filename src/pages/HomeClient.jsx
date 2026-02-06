import { Link } from 'react-router-dom'

export function HomeCliente() {
  return (
    <div>
      <h1>Bem-vindo à Barbearia</h1>
      <p>Escolha seu horário...</p>
      {/* Link discreto para o barbeiro entrar */}
      <Link to="/login" style={{ fontSize: '12px', color: '#ccc' }}>Sou Barbeiro</Link>
    </div>
  )
}