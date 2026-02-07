import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, Trash2, DollarSign, Clock } from 'lucide-react'

export function MeusServicos() {
  const navigate = useNavigate()
  const [servicos, setServicos] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Estados do Formulário de Novo Serviço
  const [novoTitulo, setNovoTitulo] = useState('')
  const [novoPreco, setNovoPreco] = useState('')
  const [novaDuracao, setNovaDuracao] = useState('30') // Padrão 30min

  useEffect(() => {
    buscarServicos()
  }, [])

  async function buscarServicos() {
    // Pega o usuário atual para garantir segurança
    const { data: { user } } = await supabase.auth.getUser()
    
    // Se não tiver logado, pode dar erro ou retornar vazio (tratamos depois)
    if (user) {
      // 1. Descobre o ID da barbearia desse usuário
      const { data: barbearia } = await supabase
        .from('barbearias')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (barbearia) {
        // 2. Busca os serviços dessa barbearia
        const { data } = await supabase
          .from('servicos')
          .select('*')
          .eq('barbearia_id', barbearia.id)
          .order('created_at', { ascending: false }) // Mais novos primeiro
          
        setServicos(data || [])
      }
    }
    setLoading(false)
  }

  async function handleCriarServico(e) {
    e.preventDefault()
    if (!novoTitulo || !novoPreco) return

    const { data: { user } } = await supabase.auth.getUser()
    
    // Busca ID da barbearia de novo (poderia estar num contexto global, mas aqui é MVP)
    const { data: barbearia } = await supabase
      .from('barbearias')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (barbearia) {
      const { error } = await supabase.from('servicos').insert({
        barbearia_id: barbearia.id,
        titulo: novoTitulo,
        preco: parseFloat(novoPreco),
        duracao_minutos: parseInt(novaDuracao)
      })

      if (error) {
        alert('Erro ao criar: ' + error.message)
      } else {
        // Limpa o form e recarrega a lista
        setNovoTitulo('')
        setNovoPreco('')
        buscarServicos()
      }
    }
  }

  async function handleExcluir(id) {
    if (!confirm('Tem certeza que deseja excluir este serviço?')) return

    const { error } = await supabase.from('servicos').delete().eq('id', id)
    
    if (error) alert('Erro ao excluir')
    else buscarServicos()
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-50 pb-20">
      
      {/* HEADER */}
      <div className="bg-zinc-800 p-6 flex items-center gap-4 shadow-lg border-b border-zinc-700">
        <button onClick={() => navigate('/admin')} className="p-2 bg-zinc-700 rounded-full hover:bg-zinc-600 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold">Meus Serviços</h1>
      </div>

      <div className="p-6 max-w-md mx-auto">
        
        {/* FORMULÁRIO DE CADASTRO */}
        <div className="bg-zinc-800 p-5 rounded-xl border border-zinc-700 mb-8 shadow-lg">
          <h2 className="font-bold text-white mb-4 flex items-center gap-2">
            <Plus size={18} className="text-emerald-500" /> Novo Serviço
          </h2>
          
          <form onSubmit={handleCriarServico} className="space-y-4">
            <div>
              <label className="text-xs text-zinc-400 font-bold uppercase">Nome do Serviço</label>
              <input 
                type="text" 
                placeholder="Ex: Corte Degrade + Sobrancelha"
                value={novoTitulo}
                onChange={e => setNovoTitulo(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 mt-1 focus:border-emerald-500 outline-none"
              />
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-xs text-zinc-400 font-bold uppercase">Preço (R$)</label>
                <input 
                  type="number" 
                  placeholder="30.00"
                  value={novoPreco}
                  onChange={e => setNovoPreco(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 mt-1 focus:border-emerald-500 outline-none"
                />
              </div>
              <div className="w-1/3">
                <label className="text-xs text-zinc-400 font-bold uppercase">Minutos</label>
                <select 
                  value={novaDuracao}
                  onChange={e => setNovaDuracao(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 mt-1 focus:border-emerald-500 outline-none"
                >
                  <option value="15">15 min</option>
                  <option value="30">30 min</option>
                  <option value="45">45 min</option>
                  <option value="60">1h</option>
                </select>
              </div>
            </div>

            <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-lg transition-colors">
              Adicionar Serviço
            </button>
          </form>
        </div>

        {/* LISTA DE SERVIÇOS EXISTENTES */}
        <h3 className="text-zinc-400 font-bold uppercase text-sm mb-4">Serviços Ativos</h3>
        
        <div className="space-y-3">
          {loading && <p className="text-center text-zinc-500">Carregando...</p>}
          
          {servicos.map(servico => (
            <div key={servico.id} className="bg-zinc-800 p-4 rounded-xl border border-zinc-700 flex justify-between items-center group">
              <div>
                <h4 className="font-bold text-white">{servico.titulo}</h4>
                <div className="flex gap-3 text-sm text-zinc-400 mt-1">
                  <span className="flex items-center gap-1"><DollarSign size={14}/> {servico.preco}</span>
                  <span className="flex items-center gap-1"><Clock size={14}/> {servico.duracao_minutos}min</span>
                </div>
              </div>
              
              <button 
                onClick={() => handleExcluir(servico.id)}
                className="p-2 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}

          {!loading && servicos.length === 0 && (
            <p className="text-zinc-500 text-center py-4 border border-dashed border-zinc-700 rounded-xl">
              Nenhum serviço cadastrado ainda.
            </p>
          )}
        </div>

      </div>
    </div>
  )
}