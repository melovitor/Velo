import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { useParams, useNavigate } from 'react-router-dom'


export function AgendamentoCliente(){
    const [barbearia, setBarbearia] = useState(null)

    const { slug } = useParams()
    useEffect(() => {
        carregarDados()
    }, [slug])
    console.log('slug', slug)


    async function carregarDados() {
        const { data: dadosBarbearia } = await supabase
        .from('barbearias')
        .select('*')
        .eq('slug', slug) 
        .single()
        setBarbearia(dadosBarbearia)
    }

    console.log('barbearia', barbearia)
    return (
        <div>Agendamentos da barbearia de {barbearia.nome}</div>
    )
}