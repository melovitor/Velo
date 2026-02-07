import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { Clock, DollarSign, Scissors } from 'lucide-react'


export function HomeCliente() {
  const { slug } = useParams()
  const [servicos, setServicos] = useState([])
  const [barbearia, setBarbearia] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    carregarDados()
  }, [slug])

  async function carregarDados() {
    const { data: dadosBarbearia } = await supabase
      .from('barbearias')
      .select('*')
      .eq('slug', slug) 
      .single()

    setBarbearia(dadosBarbearia)

    if (dadosBarbearia) {
      const { data: dadosServicos } = await supabase
        .from('servicos')
        .select('*')
        .eq('barbearia_id', dadosBarbearia.id)
      
      setServicos(dadosServicos || [])
    }
    setLoading(false)
  }

  if (loading === true) {  
    return <div className="h-screen bg-zinc-900 text-white flex items-center justify-center">Carregando...</div>
  } else if (loading === false && !barbearia) {
    return <div className="h-screen bg-zinc-900 text-white flex items-center justify-center">Barbearia não encontrada.</div>
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-50 pb-20">
      <div className="bg-zinc-800 p-6 pb-10 rounded-b-3xl shadow-lg relative">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-white">{barbearia.nome}</h1>
            <p className="text-zinc-400 text-sm">São Paulo • {barbearia.tipo_servico}</p>
          </div>
          
          {barbearia.aberto === true ? 
            <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full font-bold uppercase">
              Aberto
            </span>
          : 
            <span className="bg-red-500/20 text-red-400 text-xs px-2 py-1 rounded-full font-bold uppercase">
              Fechado
            </span>
          }
        </div>

        {/* Foto do Perfil (Placeholder) */}
        <div className="absolute -bottom-6 left-6">
          <div className="w-16 h-16 bg-zinc-700 rounded-full border-4 border-zinc-900 flex items-center justify-center overflow-hidden">
             {/* Se tiver foto no banco, usa img. Se não, usa ícone */}
             <Scissors size={24} className="text-zinc-400" />
          </div>
        </div>
      </div>

      {/* --- LISTA DE SERVIÇOS --- */}
      <div className="mt-12 px-6">
        <h2 className="text-lg font-bold mb-4">Serviços</h2>

        <div className="space-y-3">
          {servicos.map((servico) => (
            <div 
              key={servico.id}
              className="bg-zinc-800 p-4 rounded-xl flex justify-between items-center border border-zinc-700/50 hover:border-zinc-600 transition-colors"
            >
              <div>
                <h3 className="font-semibold text-white">{servico.titulo}</h3>
                <div className="flex items-center gap-4 mt-1 text-sm text-zinc-400">
                  <span className="flex items-center gap-1">
                    <DollarSign size={14} /> R$ {servico.preco}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={14} /> {servico.duracao_minutos}min
                  </span>
                </div>
              </div>
              
              <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors">
                Agendar
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}