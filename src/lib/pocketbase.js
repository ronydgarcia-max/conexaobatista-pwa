import PocketBase from 'pocketbase'

// Usa variável de ambiente em produção, ou localhost em desenvolvimento
const PB_URL = import.meta.env.VITE_POCKETBASE_URL || 'http://localhost:8090'

export const pb = new PocketBase(PB_URL)

// Desativa o auto-cancellation que causa o erro "autocancelled"
pb.autoCancellation(false)

export const login = async (email, password) => {
  const authData = await pb.collection('users').authWithPassword(email, password)
  return authData
}

export const logout = () => {
  pb.authStore.clear()
}

export const getCurrentUser = () => {
  return pb.authStore.model
}

export const getPendencias = async (igrejaId) => {
  const records = await pb.collection('users').getList(1, 50, {
    filter: `igreja_id = "${igrejaId}" && status_aprovacao = "pendente"`,
    sort: '-created',
  })
  return records.items
}

export const aprovarUsuario = async (usuarioId, representanteId, justificativa = '') => {
  const agora = new Date()
  const dataAcao = agora.toISOString().split('T')[0]
  const horaAcao = agora.toTimeString().split(' ')[0].substring(0, 5)

  await pb.collection('users').update(usuarioId, {
    status_aprovacao: 'aprovado',
  })

  await pb.collection('decisoes_aprovacao_igreja').create({
    usuario_id: usuarioId,
    representante_id: representanteId,
    data_acao: dataAcao,
    hora_acao: horaAcao,
    status: 'aprovado',
    tipo_acao: 'aprovacao',
    justificativa: justificativa,
  })
}

export const recusarUsuario = async (usuarioId, representanteId, justificativa) => {
  const agora = new Date()
  const dataAcao = agora.toISOString().split('T')[0]
  const horaAcao = agora.toTimeString().split(' ')[0].substring(0, 5)

  await pb.collection('users').update(usuarioId, {
    status_aprovacao: 'recusado',
  })

  await pb.collection('decisoes_aprovacao_igreja').create({
    usuario_id: usuarioId,
    representante_id: representanteId,
    data_acao: dataAcao,
    hora_acao: horaAcao,
    status: 'recusado',
    tipo_acao: 'recusa',
    justificativa: justificativa,
  })
}
