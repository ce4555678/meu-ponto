"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { formatarData } from "@/utils/types"
import type { RegistroPonto } from "@/utils/types"

interface PontoStatsProps {
  totalRegistros: number
  diasUnicos: number
  ultimoRegistro: RegistroPonto | null
  loading?: boolean
}

export function PontoStats({
  totalRegistros,
  diasUnicos,
  ultimoRegistro,
  loading,
}: PontoStatsProps) {
  const stats = [
    {
      label: "Total de registros",
      value: loading ? null : String(totalRegistros),
      size: "text-3xl",
    },
    {
      label: "Dias únicos",
      value: loading ? null : String(diasUnicos),
      size: "text-3xl",
    },
    {
      label: "Último registro",
      value: loading
        ? null
        : ultimoRegistro
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
            {value === null ? (
              <Skeleton className="mt-3 h-8 w-20" />
            ) : (
              <p className={`mt-2 font-semibold tabular-nums ${size}`}>{value}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </section>
  )
}
