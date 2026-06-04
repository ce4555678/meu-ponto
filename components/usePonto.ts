"use client"

import { useState, useCallback, useMemo, useEffect } from "react"
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

  useEffect(() => {
    async function loadColaborador() {
      setColaborador({
        nome: "Ana Paula Souza",
        matricula: "EMP-00421",
        admissao: "2022-03-12",
        contratante: "Empresa Ltda.",
        cnpj: "12.345.678/0001-99",
        ctps: "0012345/001",
        ativo: true,
      })
      setLoading(false)
    }

    loadColaborador()
  }, [])

  useEffect(() => {
    async function loadRegistros() {
      setRegistros([])
      setLoading(false)
    }

    loadRegistros()
  }, [mesFiltro, anoFiltro])

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

  const registrarBatida = useCallback(
    async (
      tipo: TipoBatida,
      data?: string,
      horario?: string,
      observacao?: string
    ) => {
      console.log("Registrar batida Supabase:", {
        tipo,
        data,
        horario,
        observacao,
      })
    },
    []
  )

  const editarRegistro = async (id: number, dados: any) => {
    console.log("Editar registro Supabase:", { id, dados })
  }

  const excluirRegistro = useCallback(async (id: number) => {
    console.log("Excluir registro Supabase:", { id })
  }, [])

  const excluirDia = useCallback(async (dia: string) => {
    console.log("Excluir dia Supabase:", { dia })
  }, [])

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
    salvarColaborador: (dados: Colaborador) => setColaborador(dados),
    loading,
  }
}
