import { useState } from 'react'
import { supabase } from '../supabaseClient'
import { useNavigate } from 'react-router-dom'
import { Lock, Mail, Scissors, UserPlus, LogIn, User } from 'lucide-react'

export function Login() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const gerarSlug = (nome) => {
    return nome
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '') + '-' + Math.floor(Math.random() * 1000) // Adiciona número para evitar duplicatas
  }

  async function handleAuth(e) {
    e.preventDefault()
    setLoading(true)

    try {
      if (isSignUp) {
        // --- 1. CRIAR LOGIN (AUTH) ---
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: email,
          password: password,
        })
        if (authError) throw authError

        if (authData.user) {
          // --- 2. CRIAR DADOS NA TABELA (BARBEARIAS) ---
          const novoSlug = gerarSlug(fullName)
          
          const { error: dbError } = await supabase.from('barbearias').insert([
            {
              user_id: authData.user.id, // O ELO DE LIGAÇÃO
              nome: fullName,
              slug: novoSlug,
              email: email,
              // Adicione outros campos padrões se precisar
            }
          ])

          if (dbError) {
            // Se falhar ao criar a barbearia, avisamos (o usuário auth já foi criado)
            alert('Conta criada, mas houve erro ao salvar dados do perfil: ' + dbError.message)
          } else {
            alert('Cadastro realizado com sucesso! Você já pode entrar.')
            setIsSignUp(false) // Volta para tela de login
          }
        }

      } else {
        // --- LOGIN NORMAL ---
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) throw error
        
        navigate('/admin')
      }
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-900 flex items-center justify-center p-4">
      <div className="bg-zinc-800 p-8 rounded-2xl w-full max-w-sm border border-zinc-700 shadow-2xl relative overflow-hidden">
        
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 to-teal-600"></div>

        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4 border border-emerald-500/20">
            <Scissors size={30} className="text-emerald-500" />
          </div>
          <h1 className="text-2xl font-bold text-white">
            {isSignUp ? 'Criar Barbearia' : 'Área do Barbeiro'}
          </h1>
          <p className="text-zinc-400 text-sm text-center mt-1">
            {isSignUp 
              ? 'Cadastre-se para começar a receber agendamentos' 
              : 'Gerencie sua agenda e faturamento'}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          
          {isSignUp && (
            <div className="animate-in slide-in-from-top-2 fade-in duration-300">
              <label className="text-zinc-400 text-xs uppercase font-bold ml-1">Nome da Barbearia</label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-3 text-zinc-500" size={20} />
                <input 
                  type="text" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg py-3 pl-10 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  placeholder="Ex: Mikael Cuts"
                  required={isSignUp}
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-zinc-400 text-xs uppercase font-bold ml-1">Email</label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-3 text-zinc-500" size={20} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg py-3 pl-10 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                placeholder="admin@barber.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-zinc-400 text-xs uppercase font-bold ml-1">Senha</label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-3 text-zinc-500" size={20} />
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)} 
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg py-3 pl-10 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-lg mt-2 transition-all shadow-lg shadow-emerald-900/20 disabled:opacity-50 flex justify-center items-center gap-2"
          >
            {loading ? 'Processando...' : (isSignUp ? 'Criar Conta Grátis' : 'Acessar Painel')}
            {!loading && (isSignUp ? <UserPlus size={20}/> : <LogIn size={20}/>)}
          </button>
        </form>

        <div className="mt-8 text-center pt-6 border-t border-zinc-700/50">
          <p className="text-zinc-400 text-sm mb-2">
            {isSignUp ? 'Já tem cadastro?' : 'Novo por aqui?'}
          </p>
          <button 
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-emerald-400 text-sm font-bold hover:text-emerald-300 transition-colors hover:underline"
          >
            {isSignUp ? 'Fazer Login' : 'Cadastrar Barbearia'}
          </button>
        </div>

      </div>
    </div>
  )
}