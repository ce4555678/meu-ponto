"use client"

import { useState, useCallback, useMemo, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import type {
  RegistroPonto,
  Colaborador,
  DiaAgrupado,
  TipoBatida,
} from "../utils/types"
import { calcularHorasTrabalhadas, calcularStatusDia } from "../utils/types"

export function usePonto(mesFiltro: number, anoFiltro: number) {
  const [registros, setRegistros] = useState<RegistroPonto[]>([])
  const [colaborador, setColaborador] = useState<Colaborador | null>(null)
  const [colaboradorId, setColaboradorId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const supabase = useMemo(() => createClient(), [])

  // Carrega o colaborador do Supabase
  useEffect(() => {
    async function loadColaborador() {
      setLoading(true)
      setError(null)

      try {
        const { data: userData } = await supabase.auth.getUser()
        const userId = userData?.user?.id

        if (!userId) {
          // Usuário não logado - usa dados padrão para demo
          setColaborador({
            nome: "Usuário Demo",
            matricula: "DEMO-001",
            admissao: new Date().toISOString().split("T")[0],
            contratante: "Empresa Demo",
            cnpj: "00.000.000/0001-00",
            ctps: "0000000/000",
            ativo: true,
          })
          setColaboradorId(null)
          setLoading(false)
          return
        }

        const { data, error: fetchError } = await supabase
          .from("colaborador")
          .select("*")
          .eq("user_id", userId)
          .single()

        if (fetchError && fetchError.code !== "PGRST116") {
          throw fetchError
        }

        if (data) {
          setColaborador({
            nome: data.nome,
            matricula: data.matricula,
            admissao: data.admissao,
            contratante: data.contratante,
            cnpj: data.cnpj,
            ctps: data.ctps,
            ativo: true,
          })
          setColaboradorId(data.id)
        } else {
          // Cria colaborador se não existir
          const { data: newColab, error: insertError } = await supabase
            .from("colaborador")
            .insert({
              user_id: userId,
              nome: "Novo Colaborador",
              matricula: `EMP-${Date.now().toString().slice(-5)}`,
              admissao: new Date().toISOString().split("T")[0],
              contratante: "Empresa",
              cnpj: "00.000.000/0001-00",
              ctps: "0000000/000",
            })
            .select()
            .single()

          if (insertError) throw insertError

          if (newColab) {
            setColaborador({
              nome: newColab.nome,
              matricula: newColab.matricula,
              admissao: newColab.admissao,
              contratante: newColab.contratante,
              cnpj: newColab.cnpj,
              ctps: newColab.ctps,
              ativo: true,
            })
            setColaboradorId(newColab.id)
          }
        }
      } catch (err) {
        console.error("Erro ao carregar colaborador:", err)
        setError("Erro ao carregar dados do colaborador")
        // Fallback para dados demo em caso de erro
        setColaborador({
          nome: "Usuário Demo",
          matricula: "DEMO-001",
          admissao: new Date().toISOString().split("T")[0],
          contratante: "Empresa Demo",
          cnpj: "00.000.000/0001-00",
          ctps: "0000000/000",
          ativo: true,
        })
      } finally {
        setLoading(false)
      }
    }

    loadColaborador()
  }, [supabase])

  // Carrega os registros do Supabase filtrados por mês/ano
  useEffect(() => {
    async function loadRegistros() {
      if (!colaboradorId) {
        setRegistros([])
        return
      }

      setLoading(true)
      setError(null)

      try {
        const { data, error: fetchError } = await supabase
          .from("horarios")
          .select("*")
          .eq("colaborador_id", colaboradorId)
          .eq("mes", mesFiltro)
          .eq("ano", anoFiltro)
          .order("dia", { ascending: false })

        if (fetchError) throw fetchError

        // Converte os dados do Supabase para o formato RegistroPonto
        const registrosConvertidos: RegistroPonto[] = (data || []).map((h) => ({
          id: h.id,
          data: `${h.ano}-${String(h.mes).padStart(2, "0")}-${String(h.dia).padStart(2, "0")}`,
          tipo: h.type as TipoBatida,
          horario: h.horario,
          observacao: undefined,
        }))

        setRegistros(registrosConvertidos)
      } catch (err) {
        console.error("Erro ao carregar registros:", err)
        setError("Erro ao carregar registros de ponto")
        setRegistros([])
      } finally {
        setLoading(false)
      }
    }

    loadRegistros()
  }, [supabase, colaboradorId, mesFiltro, anoFiltro])

  const mesStr = String(mesFiltro).padStart(2, "0")
  const prefixo = `${anoFiltro}-${mesStr}`

  const registrosFiltrados = useMemo(
    () => registros.filter((r) => r.data.startsWith(prefixo)),
    [registros, prefixo]
  )

  const diasAgrupados = useMemo<DiaAgrupado[]>(() => {
    const map = new Map<string, Record<TipoBatida, string | undefined>>()

    for (const reg of registrosFiltrados) {
      const dt = reg.data
      if (!map.has(dt)) {
        map.set(dt, {
          inicio_expediente: undefined,
          inicio_almoco: undefined,
          retorno_almoco: undefined,
          inicio_cafe: undefined,
          retorno_cafe: undefined,
          termino_expediente: undefined,
        })
      }
      map.get(dt)![reg.tipo] = reg.horario
    }

    const formattedEntries = Array.from(map.entries())
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([data, batidas]) => ({
        data,
        batidas,
        horasTrabalhadas: calcularHorasTrabalhadas(batidas),
        status: calcularStatusDia(batidas),
      }))

    return formattedEntries
  }, [registrosFiltrados])

  const totalRegistros = registrosFiltrados.length
  const diasUnicos = diasAgrupados.length
  const ultimoRegistro = useMemo(
    () =>
      [...registrosFiltrados].sort((a, b) =>
        `${b.data}${b.horario}`.localeCompare(`${a.data}${a.horario}`)
      )[0] ?? null,
    [registrosFiltrados]
  )

  // Registra uma nova batida no Supabase
  const registrarBatida = useCallback(
    async (
      tipo: TipoBatida,
      data?: string,
      horario?: string,
      observacao?: string
    ) => {
      if (!colaboradorId) {
        setError("Colaborador não encontrado. Faça login para registrar batidas.")
        return
      }

      const dataAtual = data || new Date().toISOString().split("T")[0]
      const horarioAtual = horario || new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
      
      const [ano, mes, dia] = dataAtual.split("-").map(Number)

      try {
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
          const { error: updateError } = await supabase
            .from("horarios")
            .update({ horario: horarioAtual })
            .eq("id", existente.id)

          if (updateError) throw updateError
        } else {
          // Insere novo registro
          const { error: insertError } = await supabase
            .from("horarios")
            .insert({
              colaborador_id: colaboradorId,
              ano,
              mes,
              dia,
              type: tipo,
              horario: horarioAtual,
            })

          if (insertError) throw insertError
        }

        // Recarrega os registros
        const { data: novosRegistros, error: fetchError } = await supabase
          .from("horarios")
          .select("*")
          .eq("colaborador_id", colaboradorId)
          .eq("mes", mesFiltro)
          .eq("ano", anoFiltro)
          .order("dia", { ascending: false })

        if (fetchError) throw fetchError

        const registrosConvertidos: RegistroPonto[] = (novosRegistros || []).map((h) => ({
          id: h.id,
          data: `${h.ano}-${String(h.mes).padStart(2, "0")}-${String(h.dia).padStart(2, "0")}`,
          tipo: h.type as TipoBatida,
          horario: h.horario,
          observacao: undefined,
        }))

        setRegistros(registrosConvertidos)
        setError(null)
      } catch (err) {
        console.error("Erro ao registrar batida:", err)
        setError("Erro ao registrar batida")
      }
    },
    [supabase, colaboradorId, mesFiltro, anoFiltro]
  )

  // Edita um registro existente
  const editarRegistro = useCallback(
    async (id: number, dados: Partial<Pick<RegistroPonto, "horario" | "observacao">>) => {
      try {
        const { error: updateError } = await supabase
          .from("horarios")
          .update({ horario: dados.horario })
          .eq("id", id)

        if (updateError) throw updateError

        // Atualiza localmente
        setRegistros((prev) =>
          prev.map((r) => (r.id === id ? { ...r, ...dados } : r))
        )
        setError(null)
      } catch (err) {
        console.error("Erro ao editar registro:", err)
        setError("Erro ao editar registro")
      }
    },
    [supabase]
  )

  // Exclui um registro específico
  const excluirRegistro = useCallback(
    async (id: number) => {
      try {
        const { error: deleteError } = await supabase
          .from("horarios")
          .delete()
          .eq("id", id)

        if (deleteError) throw deleteError

        // Remove localmente
        setRegistros((prev) => prev.filter((r) => r.id !== id))
        setError(null)
      } catch (err) {
        console.error("Erro ao excluir registro:", err)
        setError("Erro ao excluir registro")
      }
    },
    [supabase]
  )

  // Exclui todos os registros de um dia
  const excluirDia = useCallback(
    async (dia: string) => {
      if (!colaboradorId) return

      const [ano, mes, diaNum] = dia.split("-").map(Number)

      try {
        const { error: deleteError } = await supabase
          .from("horarios")
          .delete()
          .eq("colaborador_id", colaboradorId)
          .eq("ano", ano)
          .eq("mes", mes)
          .eq("dia", diaNum)

        if (deleteError) throw deleteError

        // Remove localmente
        setRegistros((prev) => prev.filter((r) => r.data !== dia))
        setError(null)
      } catch (err) {
        console.error("Erro ao excluir dia:", err)
        setError("Erro ao excluir registros do dia")
      }
    },
    [supabase, colaboradorId]
  )

  // Salva os dados do colaborador no Supabase
  const salvarColaborador = useCallback(
    async (dados: Colaborador) => {
      if (!colaboradorId) {
        // Apenas atualiza localmente se não há ID
        setColaborador(dados)
        return
      }

      try {
        const { error: updateError } = await supabase
          .from("colaborador")
          .update({
            nome: dados.nome,
            matricula: dados.matricula,
            admissao: dados.admissao,
            contratante: dados.contratante,
            cnpj: dados.cnpj,
            ctps: dados.ctps,
          })
          .eq("id", colaboradorId)

        if (updateError) throw updateError

        setColaborador(dados)
        setError(null)
      } catch (err) {
        console.error("Erro ao salvar colaborador:", err)
        setError("Erro ao salvar dados do colaborador")
      }
    },
    [supabase, colaboradorId]
  )

  return {
    colaborador,
    registros: registrosFiltrados,
    diasAgrupados,
    totalRegistros,
    diasUnicos,
    ultimoRegistro,
    registrarBatida,
    editarRegistro,
    excluirRegistro,
    excluirDia,
    salvarColaborador,
    loading,
    error,
  }
}
