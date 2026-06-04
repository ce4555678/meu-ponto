"use client"
import { PontoStats } from "@/components/PontoStats"
import { PontoTable } from "@/components/PontoTable"
import { DialogNovaBatida } from "@/components/DialogNovaBatida"
import { DialogColaborador } from "@/components/DialogColaborador"
import { ThemeToggle } from "@/components/ThemeToggle"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Printer, UserCog, AlertCircle, RefreshCw } from "lucide-react"
import HomeUi from "@/components/homeUi"
import { usePonto } from "@/components/usePonto"
import { useState } from "react"

export default function PageHome() {
  const hoje = new Date()
  const [mes, setMes] = useState<number>(hoje.getMonth() + 1)
  const [ano, setAno] = useState<number>(hoje.getFullYear())

  const {
    colaborador,
    registros,
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
  } = usePonto(mes, ano)

  // Estado de carregamento inicial
  if (loading && !colaborador) {
    return (
      <div className="min-h-screen bg-background font-sans">
        <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-9 w-32" />
              <Skeleton className="h-9 w-28" />
              <Skeleton className="h-9 w-24" />
            </div>
          </div>
          <Separator />
          <div className="grid gap-4 xl:grid-cols-[1.4fr_0.6fr]">
            <div className="grid gap-3 md:grid-cols-3">
              <Skeleton className="h-24 rounded-lg" />
              <Skeleton className="h-24 rounded-lg" />
              <Skeleton className="h-24 rounded-lg" />
            </div>
            <Skeleton className="h-24 rounded-lg" />
          </div>
          <Skeleton className="h-96 rounded-lg" />
        </div>
      </div>
    )
  }

  if (!colaborador) return null

  return (
    <div className="min-h-screen bg-background font-sans">
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        {/* Alerta de erro */}
        {error && (
          <div className="flex items-center gap-3 rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-destructive">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p className="text-sm font-medium">{error}</p>
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto h-8 text-destructive hover:text-destructive hover:bg-destructive/20"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="mr-1.5 h-4 w-4" />
              Tentar novamente
            </Button>
          </div>
        )}

        {/* Cabeçalho */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-blue-600 uppercase dark:text-blue-400">
              Painel de ponto
            </p>
            <h1 className="mt-1.5 text-3xl font-semibold tracking-tight text-foreground">
              Controle de horários
            </h1>
            <p className="mt-1.5 max-w-xl text-sm leading-6 text-muted-foreground">
              Sistema Supabase integrado. Gerencie seus registros de ponto
              completo.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <DialogNovaBatida onSalvar={registrarBatida} />

            <DialogColaborador
              colaborador={colaborador}
              onSalvar={salvarColaborador}
              trigger={
                <Button variant="outline" size="sm">
                  <UserCog className="mr-1.5 h-4 w-4" />
                  Colaborador
                </Button>
              }
            />

            <Button variant="outline" size="sm" onClick={() => window.print()}>
              <Printer className="mr-1.5 h-4 w-4" />
              Imprimir
            </Button>

            <ThemeToggle />
          </div>
        </div>

        <Separator />

        {/* Stats + Cadastro */}
        <div className="grid gap-4 xl:grid-cols-[1.4fr_0.6fr]">
          <PontoStats
            totalRegistros={totalRegistros}
            diasUnicos={diasUnicos}
            ultimoRegistro={ultimoRegistro}
            loading={loading}
          />
          <HomeUi.card />
        </div>

        {/* Tabela */}
        <PontoTable
          diasAgrupados={diasAgrupados}
          registros={registros}
          mes={mes}
          ano={ano}
          onMesChange={setMes}
          onAnoChange={setAno}
          onEditar={editarRegistro}
          onExcluirRegistro={excluirRegistro}
          onExcluirDia={excluirDia}
          loading={loading}
        />
      </div>
    </div>
  )
}
