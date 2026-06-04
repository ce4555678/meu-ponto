"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Printer, UserCog, AlertCircle, RefreshCw, LogOut } from "lucide-react"
import { DialogNovaBatida } from "@/components/DialogNovaBatida"
import { DialogColaborador } from "@/components/DialogColaborador"
import { ThemeToggle } from "@/components/ThemeToggle"
import type { Colaborador, TipoBatida } from "@/utils/types"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"

interface HeaderProps {
  colaborador: Colaborador | null
  onRegistrarBatida: (tipo: TipoBatida, data: string, horario: string, obs?: string) => void
  onSalvarColaborador: (dados: Colaborador) => void
  error?: string | null
}

export function Header({ colaborador, onRegistrarBatida, onSalvarColaborador, error }: HeaderProps) {
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    if (supabase) {
      await supabase.auth.signOut()
    }
    router.push("/login")
    router.refresh()
  }

  return (
    <>
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
            Sistema Supabase integrado. Gerencie seus registros de ponto.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <DialogNovaBatida onSalvar={onRegistrarBatida} />

          {colaborador && (
            <DialogColaborador
              colaborador={colaborador}
              onSalvar={onSalvarColaborador}
              trigger={
                <Button variant="outline" size="sm">
                  <UserCog className="mr-1.5 h-4 w-4" />
                  Colaborador
                </Button>
              }
            />
          )}

          <Button variant="outline" size="sm" onClick={() => window.print()}>
            <Printer className="mr-1.5 h-4 w-4" />
            Imprimir
          </Button>

          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="mr-1.5 h-4 w-4" />
            Sair
          </Button>

          <ThemeToggle />
        </div>
      </div>

      <Separator />
    </>
  )
}

// Loading skeleton
export function HeaderSkeleton() {
  return (
    <>
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
    </>
  )
}
