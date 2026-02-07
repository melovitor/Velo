import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { useNavigate } from 'react-router-dom'
import { Calendar, CheckCircle, Clock, DollarSign, LogOut, Trash2, User, Scissors, ChevronRight } from 'lucide-react'

export function AdminDashboard() {
  const [agendamentos, setAgendamentos] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  // Verifica se tem usuário logado ao carregar
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        navigate('/login') // Se não tiver logado, chuta pro login
      } else {
        buscarAgendamentos()
      }
    }
    checkUser()
  }, [])

  async function buscarAgendamentos() {
    setLoading(true)

    // 1. Pega o usuário logado para saber qual barbearia é a dele
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return

    // 2. Busca o ID da barbearia vinculado a esse usuário
    const { data: barbearia, error: erroBarbearia } = await supabase
      .from('barbearias')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (erroBarbearia || !barbearia) {
      alert("Erro: Barbearia não encontrada para este usuário.")
      setLoading(false)
      return
    }

    // 3. Busca os agendamentos APENAS dessa barbearia
    const { data: dadosAgendamentos, error } = await supabase
      .from('agendamentos')
      .select('*')
      .eq('barbearia_id', barbearia.id) // Filtro de segurança
      .order('data_agendamento', { ascending: true })

    if (error) {
      alert('Erro ao buscar agendamentos')
      console.log(error)
    }

    // 4. Busca os nomes dos serviços dessa barbearia
    const { data: dadosServicos } = await supabase
      .from('servicos')
      .select('*')
      .eq('barbearia_id', barbearia.id)

    // 5. Junta as informações (Manual Join)
    if (dadosAgendamentos && dadosServicos) {
      const agendamentosCompletos = dadosAgendamentos.map(agendamento => {
        const servico = dadosServicos.find(s => s.id === agendamento.servico_id)
        return { ...agendamento, titulo_servico: servico?.titulo || 'Serviço excluído' }
      })
      setAgendamentos(agendamentosCompletos)
    }
    
    setLoading(false)
  }

  async function marcarComoConcluido(id) {
    const confirm = window.confirm("Confirmar que o serviço foi realizado?")
    if (!confirm) return

    const { error } = await supabase
      .from('agendamentos')
      .update({ status: 'concluido' })
      .eq('id', id)

    if (error) alert('Erro ao atualizar')
    else buscarAgendamentos() // Recarrega a lista
  }

  async function cancelarAgendamento(id) {
    const confirm = window.confirm("Tem certeza que deseja cancelar este agendamento?")
    if (!confirm) return

    const { error } = await supabase
      .from('agendamentos')
      .delete()
      .eq('id', id)

    if (error) alert('Erro ao cancelar')
    else buscarAgendamentos()
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/login')
  }

  // Formatação de data
  const formatarData = (dataString) => {
    const data = new Date(dataString)
    return {
      dia: new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit' }).format(data),
      hora: new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(data)
    }
  }

  if (loading) return <div className="h-screen bg-zinc-900 flex items-center justify-center text-white">Carregando painel...</div>

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-50 pb-20">
      
      {/* HEADER */}
      <header className="bg-zinc-800 p-6 shadow-lg flex justify-between items-center border-b border-zinc-700">
        <div>
          <h1 className="text-xl font-bold text-white">Painel do Barbeiro</h1>
          <p className="text-zinc-400 text-xs">Gerencie sua agenda</p>
        </div>
        <button onClick={handleLogout} className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors">
          <LogOut size={20} />
        </button>
      </header>

      {/* CONTEÚDO */}
      <main className="p-6">
        
        {/* Resumo Rápido (Cards) */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-zinc-800 p-4 rounded-xl border border-zinc-700">
            <p className="text-zinc-400 text-xs mb-1">Agendados</p>
            <p className="text-2xl font-bold text-white">{agendamentos.length}</p>
          </div>
          <div className="bg-zinc-800 p-4 rounded-xl border border-zinc-700">
            <p className="text-zinc-400 text-xs mb-1">Faturamento (Previsto)</p>
            <p className="text-2xl font-bold text-emerald-400">
              R$ {agendamentos.reduce((acc, cur) => acc + (cur.valor_cobrado || 0), 0)}
            </p>
          </div>
        </div>

        {/* BOTÃO PARA GERENCIAR SERVIÇOS (NOVO) */}
        <div className="mb-8">
          <button 
            onClick={() => navigate('/admin/servicos')}
            className="w-full bg-zinc-800 border border-zinc-700 hover:border-emerald-500 text-white p-4 rounded-xl flex items-center justify-between group transition-all shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="bg-emerald-500/10 p-2 rounded-lg text-emerald-500">
                <Scissors size={24} />
              </div>
              <div className="text-left">
                <p className="font-bold">Gerenciar Serviços</p>
                <p className="text-zinc-400 text-xs">Adicione ou edite seus preços</p>
              </div>
            </div>
            <ChevronRight className="text-zinc-500 group-hover:text-emerald-500 transition-colors" />
          </button>
        </div>

        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Calendar size={20} className="text-emerald-500"/> Próximos Clientes
        </h2>

        {agendamentos.length === 0 ? (
          <div className="text-center py-10 text-zinc-500 border border-dashed border-zinc-800 rounded-xl">
            <p>Nenhum agendamento pendente.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {agendamentos.map((item) => {
              const { dia, hora } = formatarData(item.data_agendamento)
              const isConcluido = item.status === 'concluido'

              return (
                <div 
                  key={item.id} 
                  className={`relative bg-zinc-800 p-5 rounded-xl border ${isConcluido ? 'border-emerald-500/30 opacity-60' : 'border-zinc-700'} shadow-sm`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-lg text-white">{item.cliente_nome}</h3>
                      <div className="flex items-center gap-2 text-zinc-400 text-sm">
                        <User size={14} /> 
                        <span>{item.cliente_telefone}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="bg-zinc-900 px-3 py-1 rounded-lg border border-zinc-700 text-center">
                        <span className="block text-xs text-zinc-500 font-bold uppercase">{dia}</span>
                        <span className="block text-lg font-bold text-white">{hora}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium mb-4 bg-emerald-400/10 w-fit px-3 py-1 rounded-full">
                    <DollarSign size={14} />
                    {item.titulo_servico} - R$ {item.valor_cobrado}
                  </div>

                  {/* Botões de Ação */}
                  {!isConcluido && (
                    <div className="flex gap-3 mt-4 pt-4 border-t border-zinc-700">
                      <button 
                        onClick={() => marcarComoConcluido(item.id)}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-colors"
                      >
                        <CheckCircle size={16} /> Concluir
                      </button>
                      
                      <button 
                        onClick={() => cancelarAgendamento(item.id)}
                        className="w-12 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg flex items-center justify-center transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  )}
                  
                  {isConcluido && (
                    <div className="mt-2 text-center text-emerald-500 text-sm font-bold flex items-center justify-center gap-1">
                      <CheckCircle size={14} /> Atendimento Finalizado
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}