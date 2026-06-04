"use server"

import { createClient, isSupabaseConfigured } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import type { TipoBatida, Colaborador } from "@/utils/types"

// Registra uma nova batida
export async function registrarBatida(
  colaboradorId: number,
  tipo: TipoBatida,
  data: string,
  horario: string
) {
  if (!isSupabaseConfigured()) {
    return { success: false, error: "Supabase não configurado" }
  }

  const supabase = await createClient()
  if (!supabase) {
    return { success: false, error: "Erro ao criar cliente Supabase" }
  }

  const [ano, mes, dia] = data.split("-").map(Number)

  // Verifica se já existe um registro para este tipo/dia
  const { data: existente } = await supabase
    .from("horarios")
    .select("id")
    .eq("colaborador_id", colaboradorId)
    .eq("ano", ano)
    .eq("mes", mes)
    .eq("dia", dia)
    .eq("type", tipo)
    .single()

  if (existente) {
    // Atualiza o registro existente
    const { error } = await supabase
      .from("horarios")
      .update({ horario })
      .eq("id", existente.id)

    if (error) {
      return { success: false, error: error.message }
    }
  } else {
    // Insere novo registro
    const { error } = await supabase.from("horarios").insert({
      colaborador_id: colaboradorId,
      ano,
      mes,
      dia,
      type: tipo,
      horario,
    })

    if (error) {
      return { success: false, error: error.message }
    }
  }

  revalidatePath("/")
  return { success: true }
}

// Edita um registro existente
export async function editarRegistro(id: number, horario: string) {
  if (!isSupabaseConfigured()) {
    return { success: false, error: "Supabase não configurado" }
  }

  const supabase = await createClient()
  if (!supabase) {
    return { success: false, error: "Erro ao criar cliente Supabase" }
  }

  const { error } = await supabase
    .from("horarios")
    .update({ horario })
    .eq("id", id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/")
  return { success: true }
}

// Exclui um registro
export async function excluirRegistro(id: number) {
  if (!isSupabaseConfigured()) {
    return { success: false, error: "Supabase não configurado" }
  }

  const supabase = await createClient()
  if (!supabase) {
    return { success: false, error: "Erro ao criar cliente Supabase" }
  }

  const { error } = await supabase.from("horarios").delete().eq("id", id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/")
  return { success: true }
}

// Exclui todos os registros de um dia
export async function excluirDia(
  colaboradorId: number,
  data: string
) {
  if (!isSupabaseConfigured()) {
    return { success: false, error: "Supabase não configurado" }
  }

  const supabase = await createClient()
  if (!supabase) {
    return { success: false, error: "Erro ao criar cliente Supabase" }
  }

  const [ano, mes, dia] = data.split("-").map(Number)

  const { error } = await supabase
    .from("horarios")
    .delete()
    .eq("colaborador_id", colaboradorId)
    .eq("ano", ano)
    .eq("mes", mes)
    .eq("dia", dia)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/")
  return { success: true }
}

// Salva dados do colaborador
export async function salvarColaborador(id: number, dados: Omit<Colaborador, "ativo">) {
  if (!isSupabaseConfigured()) {
    return { success: false, error: "Supabase não configurado" }
  }

  const supabase = await createClient()
  if (!supabase) {
    return { success: false, error: "Erro ao criar cliente Supabase" }
  }

  const { error } = await supabase
    .from("colaborador")
    .update({
      nome: dados.nome,
      matricula: dados.matricula,
      admissao: dados.admissao,
      contratante: dados.contratante,
      cnpj: dados.cnpj,
      ctps: dados.ctps,
    })
    .eq("id", id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/")
  return { success: true }
}

// Cria um novo colaborador
export async function criarColaborador(userId: string, dados: Omit<Colaborador, "ativo">) {
  if (!isSupabaseConfigured()) {
    return { success: false, error: "Supabase não configurado" }
  }

  const supabase = await createClient()
  if (!supabase) {
    return { success: false, error: "Erro ao criar cliente Supabase" }
  }

  const { data, error } = await supabase
    .from("colaborador")
    .insert({
      user_id: userId,
      nome: dados.nome,
      matricula: dados.matricula,
      admissao: dados.admissao,
      contratante: dados.contratante,
      cnpj: dados.cnpj,
      ctps: dados.ctps,
    })
    .select()
    .single()

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/")
  return { success: true, data }
}
