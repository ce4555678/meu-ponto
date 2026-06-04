import { Suspense } from "react"
import { redirect } from "next/navigation"
import { getHomeData } from "@/utils/supabase/queries"
import { isSupabaseConfigured } from "@/utils/supabase/server"
import { HomeContent } from "./HomeContent"
import {
  HeaderSkeleton,
  StatsCardsSkeleton,
  ColaboradorCardSkeleton,
  HorariosTableSkeleton,
} from "@/components/homeUi"

interface PageProps {
  searchParams: Promise<{ mes?: string; ano?: string }>
}

export default async function PageHome({ searchParams }: PageProps) {
  const params = await searchParams
  const hoje = new Date()
  const mes = params.mes ? Number(params.mes) : hoje.getMonth() + 1
  const ano = params.ano ? Number(params.ano) : hoje.getFullYear()

  // Verifica se Supabase está configurado
  if (!isSupabaseConfigured()) {
    return (
      <div className="min-h-screen bg-background font-sans">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="rounded-lg border border-amber-500/50 bg-amber-500/10 px-6 py-8 text-center">
            <h2 className="text-lg font-semibold text-amber-700 dark:text-amber-400">
              Supabase não configurado
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Configure as variáveis de ambiente NEXT_PUBLIC_SUPABASE_URL e
              NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY para usar o sistema.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Busca dados via SSR
  const result = await getHomeData(mes, ano)

  // Se requer autenticação, redireciona para login
  if (!result.success && result.requiresAuth) {
    redirect("/login")
  }

  // Se houve erro não relacionado a auth
  if (!result.success) {
    return (
      <div className="min-h-screen bg-background font-sans">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-6 py-8 text-center">
            <h2 className="text-lg font-semibold text-destructive">
              Erro ao carregar dados
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">{result.error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background font-sans">
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <Suspense
          fallback={
            <>
              <HeaderSkeleton />
              <div className="grid gap-4 xl:grid-cols-[1.4fr_0.6fr]">
                <StatsCardsSkeleton />
                <ColaboradorCardSkeleton />
              </div>
              <HorariosTableSkeleton />
            </>
          }
        >
          <HomeContent
            initialData={result.data}
            mes={mes}
            ano={ano}
          />
        </Suspense>
      </div>
    </div>
  )
}
