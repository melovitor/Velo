import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { ArrowLeft, Plus, Settings } from 'lucide-react'
import { useParams, useNavigate } from 'react-router-dom'


export function GerenciamentoNegocio(){
  const navigate = useNavigate()
    const [barbearia, setBarbearia] = useState(null)
    const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        navigate('/login') // Se não tiver logado, chuta pro login
      } else {
        buscaNegocio()
      }
    }
    checkUser()
  }, [])

    async function buscaNegocio() {
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
         console.log('barbearia', barbearia)
        // 2. Busca os serviços dessa barbearia
        // const { data } = await supabase
        //   .from('servicos')
        //   .select('*')
        //   .eq('barbearia_id', barbearia.id)
        //   .order('created_at', { ascending: false }) // Mais novos primeiro
          
        // setServicos(data || [])
      }
    }
    setLoading(false)
  }

    async function handleCriarServico(e) {
        e.preventDefault()
        console.log('e', e)
        // if (!novoTitulo || !novoPreco) return

        // const { data: { user } } = await supabase.auth.getUser()
        
        // // Busca ID da barbearia de novo (poderia estar num contexto global, mas aqui é MVP)
        // const { data: barbearia } = await supabase
        //   .from('barbearias')
        //   .select('id')
        //   .eq('user_id', user.id)
        //   .single()

        // if (barbearia) {
        //   const { error } = await supabase.from('servicos').insert({
        //     barbearia_id: barbearia.id,
        //     titulo: novoTitulo,
        //     preco: parseFloat(novoPreco),
        //     duracao_minutos: parseInt(novaDuracao)
        //   })

        //   if (error) {
        //     alert('Erro ao criar: ' + error.message)
        //   } else {
        //     // Limpa o form e recarrega a lista
        //     setNovoTitulo('')
        //     setNovoPreco('')
        //     buscarServicos()
        //   }
        // }
      }




    return (
      <div className="min-h-screen bg-zinc-900 text-zinc-50 pb-20">
      
        {/* HEADER */}
        <div className="bg-zinc-800 p-6 flex items-center gap-4 shadow-lg border-b border-zinc-700">
          <button onClick={() => navigate('/admin')} className="p-2 bg-zinc-700 rounded-full hover:bg-zinc-600 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold">Meu Negócio</h1>
        </div>

        <div className="p-6 max-w-md mx-auto">
          <div className="bg-zinc-800 p-5 rounded-xl border border-zinc-700 mb-8 shadow-lg">
            <h2 className="font-bold text-white mb-4 flex items-center gap-2">
              <Settings size={18} className="text-emerald-500" /> Configuração
            </h2>
            

            <form onSubmit={handleCriarServico} className="space-y-4">
              <div>
                <label className="text-xs text-zinc-400 font-bold uppercase">Nome do Negocío</label>
                <input 
                  type="text" 
                  placeholder="Digite o nome do seu negócio"
                  // value={novoTitulo}
                  onChange={e => setNovoTitulo(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 mt-1 focus:border-emerald-500 outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-zinc-400 font-bold uppercase">Telefone</label>
                <input 
                  type="number" 
                  placeholder="(00) 0000-0000"
                  // value={novoTitulo}
                  onChange={e => setNovoTitulo(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 mt-1 focus:border-emerald-500 outline-none"
                />
              </div>

              <div className="flex gap-4">
                <div className="w-2/3" >
                  <label className="text-xs text-zinc-400 font-bold uppercase">Endereço</label>
                  <input 
                    type="text" 
                    placeholder="R. Tal"
                    // value={novoTitulo}
                    onChange={e => setNovoTitulo(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 mt-1 focus:border-emerald-500 outline-none"
                  />
                </div>
                <div className="w-1/3" >
                  <label className="text-xs text-zinc-400 font-bold uppercase">Numero</label>
                  <input 
                    type="number" 
                    placeholder="01"
                    // value={novoTitulo}
                    onChange={e => setNovoTitulo(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 mt-1 focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-zinc-400 font-bold uppercase">Tipo</label>
                <select 
                  // value={novaDuracao}
                  // onChange={e => setNovaDuracao(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 mt-1 focus:border-emerald-500 outline-none"
                >
                  <option value="0">A domicílio</option>
                  <option value="1">Fixo</option>
                </select>
              </div> 

              <div className="flex justify-between gap-10">
                <div>
                  <label className="text-xs text-zinc-400 font-bold uppercase">Abertura</label>
                  <input 
                    type="time" 
                    // value={novoPreco}
                    onChange={e => setNovoPreco(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 mt-1 focus:border-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-400 font-bold uppercase">Fechamento</label>
                  <input 
                    type="time" 
                    // value={novoPreco}
                    onChange={e => setNovoPreco(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 mt-1 focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>
              <div className="flex justify-between gap-10">
                <div>
                  <label className="text-xs text-zinc-400 font-bold uppercase">Pausa Início</label>
                  <input 
                    type="time" 
                    // value={novoPreco}
                    onChange={e => setNovoPreco(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 mt-1 focus:border-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-400 font-bold uppercase">Pausa Fim</label>
                  <input 
                    type="time" 
                    // value={novoPreco}
                    onChange={e => setNovoPreco(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 mt-1 focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>
              <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-lg transition-colors">
                Atualizar Configuração
              </button>
            </form>
          </div>
        </div>
      </div>
    )
}