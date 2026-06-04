import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { formatarData } from "@/utils/types"
import type { RegistroPonto } from "@/utils/types"

interface StatsCardsProps {
  totalRegistros: number
  diasUnicos: number
  ultimoRegistro: RegistroPonto | null
}

export function StatsCards({ totalRegistros, diasUnicos, ultimoRegistro }: StatsCardsProps) {
  const stats = [
    {
      label: "Total de registros",
      value: String(totalRegistros),
      size: "text-3xl",
    },
    {
      label: "Dias únicos",
      value: String(diasUnicos),
      size: "text-3xl",
    },
    {
      label: "Último registro",
      value: ultimoRegistro
        ? `${formatarData(ultimoRegistro.data)} ${ultimoRegistro.horario}`
        : "—",
      size: "text-lg",
    },
  ]

  return (
    <section className="grid gap-3 md:grid-cols-3">
      {stats.map(({ label, value, size }) => (
        <Card key={label} className="border-border/60 shadow-none">
          <CardContent className="pt-5 pb-5">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {label}
            </p>
            <p className={`mt-2 font-semibold tabular-nums ${size}`}>{value}</p>
          </CardContent>
        </Card>
      ))}
    </section>
  )
}

// Loading skeleton
export function StatsCardsSkeleton() {
  return (
    <section className="grid gap-3 md:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i} className="border-border/60 shadow-none">
          <CardContent className="pt-5 pb-5">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="mt-3 h-8 w-20" />
          </CardContent>
        </Card>
      ))}
    </section>
  )
}
