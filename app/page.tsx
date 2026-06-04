"use client"
import { PontoStats } from "@/components/PontoStats"
import { PontoTable } from "@/components/PontoTable"
import { DialogNovaBatida } from "@/components/DialogNovaBatida"
import { DialogColaborador } from "@/components/DialogColaborador"
import { ThemeToggle } from "@/components/ThemeToggle"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Printer, UserCog } from "lucide-react"
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
  } = usePonto(mes, ano)

  if (!colaborador) return <div>Carregando...</div>

  return (
    <div className="min-h-screen bg-background font-sans">
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
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
