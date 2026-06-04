"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import {
  Header,
  StatsCards,
  ColaboradorCard,
  HorariosTable,
  usePeriodoFilter,
} from "@/components/homeUi"
import {
  registrarBatida,
  editarRegistro,
  excluirRegistro,
  excluirDia,
  salvarColaborador,
} from "./actions"
import type { Colaborador, DiaAgrupado, RegistroPonto, TipoBatida } from "@/utils/types"

interface HomeContentProps {
  initialData: {
    colaborador: (Colaborador & { id: number }) | null
    colaboradorId: number | null
    registros: RegistroPonto[]
    diasAgrupados: DiaAgrupado[]
    stats: {
      totalRegistros: number
      diasUnicos: number
      ultimoRegistro: RegistroPonto | null
    }
    userId: string
  }
  mes: number
  ano: number
}

export function HomeContent({ initialData, mes: initialMes, ano: initialAno }: HomeContentProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  // Estado local para dados
  const [colaborador, setColaborador] = useState(initialData.colaborador)
  const [registros, setRegistros] = useState(initialData.registros)
  const [diasAgrupados, setDiasAgrupados] = useState(initialData.diasAgrupados)
  const [stats, setStats] = useState(initialData.stats)

  // Hook nuqs para filtro de período via URL
  const { mes, ano, setMes, setAno } = usePeriodoFilter()

  // Usa os valores da URL ou os iniciais
  const mesAtual = mes ?? initialMes
  const anoAtual = ano ?? initialAno

  // Handler para registrar batida
  async function handleRegistrarBatida(
    tipo: TipoBatida,
    data: string,
    horario: string,
    obs?: string
  ) {
    if (!initialData.colaboradorId) {
      setError("Colaborador não encontrado")
      return
    }

    startTransition(async () => {
      const result = await registrarBatida(
        initialData.colaboradorId!,
        tipo,
        data,
        horario
      )

      if (!result.success) {
        setError(result.error ?? "Erro ao registrar batida")
        return
      }

      setError(null)
      router.refresh()
    })
  }

  // Handler para editar registro
  async function handleEditarRegistro(
    id: number,
    dados: Partial<Pick<RegistroPonto, "horario" | "observacao">>
  ) {
    if (!dados.horario) return

    startTransition(async () => {
      const result = await editarRegistro(id, dados.horario!)

      if (!result.success) {
        setError(result.error ?? "Erro ao editar registro")
        return
      }

      setError(null)
      router.refresh()
    })
  }

  // Handler para excluir registro
  async function handleExcluirRegistro(id: number) {
    startTransition(async () => {
      const result = await excluirRegistro(id)

      if (!result.success) {
        setError(result.error ?? "Erro ao excluir registro")
        return
      }

      setError(null)
      router.refresh()
    })
  }

  // Handler para excluir dia
  async function handleExcluirDia(data: string) {
    if (!initialData.colaboradorId) return

    startTransition(async () => {
      const result = await excluirDia(initialData.colaboradorId!, data)

      if (!result.success) {
        setError(result.error ?? "Erro ao excluir dia")
        return
      }

      setError(null)
      router.refresh()
    })
  }

  // Handler para salvar colaborador
  async function handleSalvarColaborador(dados: Colaborador) {
    if (!initialData.colaboradorId) return

    startTransition(async () => {
      const result = await salvarColaborador(initialData.colaboradorId!, dados)

      if (!result.success) {
        setError(result.error ?? "Erro ao salvar colaborador")
        return
      }

      setColaborador({ ...dados, id: initialData.colaboradorId! })
      setError(null)
      router.refresh()
    })
  }

  return (
    <>
      <Header
        colaborador={colaborador}
        onRegistrarBatida={handleRegistrarBatida}
        onSalvarColaborador={handleSalvarColaborador}
        error={error}
      />

      {/* Stats + Cadastro */}
      <div className="grid gap-4 xl:grid-cols-[1.4fr_0.6fr]">
        <StatsCards
          totalRegistros={stats.totalRegistros}
          diasUnicos={stats.diasUnicos}
          ultimoRegistro={stats.ultimoRegistro}
        />
        <ColaboradorCard colaborador={colaborador} />
      </div>

      {/* Tabela */}
      <HorariosTable
        diasAgrupados={diasAgrupados}
        registros={registros}
        mes={mesAtual}
        ano={anoAtual}
        onMesChange={(v) => {
          setMes(v)
          router.refresh()
        }}
        onAnoChange={(v) => {
          setAno(v)
          router.refresh()
        }}
        onEditar={handleEditarRegistro}
        onExcluirRegistro={handleExcluirRegistro}
        onExcluirDia={handleExcluirDia}
      />

      {/* Loading overlay */}
      {isPending && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/50 backdrop-blur-sm">
          <div className="rounded-lg bg-card px-6 py-4 shadow-lg">
            <p className="text-sm font-medium">Processando...</p>
          </div>
        </div>
      )}
    </>
  )
}
