import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { Colaborador } from "@/utils/types"

interface ColaboradorCardProps {
  colaborador: Colaborador | null
}

export function ColaboradorCard({ colaborador }: ColaboradorCardProps) {
  if (!colaborador) {
    return (
      <Card className="h-full border-border/60 shadow-none">
        <CardContent className="px-5 pt-5 pb-5">
          <div className="space-y-2">
            {Array.from({ length: 7 }).map((_, i) => (
              <Skeleton key={i} className="h-5 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const campos = [
    { label: "Nome", value: colaborador.nome },
    { label: "Matrícula", value: colaborador.matricula },
    { label: "Admissão", value: colaborador.admissao },
    { label: "Contratante", value: colaborador.contratante },
    { label: "CNPJ", value: colaborador.cnpj },
    { label: "CTPS", value: colaborador.ctps },
    { label: "Ativo", value: colaborador.ativo ? "Sim" : "Não" },
  ]

  return (
    <Card className="h-full border-border/60 shadow-none">
      <CardContent className="px-5 pt-5 pb-5">
        <dl className="space-y-1.5 text-sm">
          {campos.map(({ label, value }) => (
            <div key={label} className="flex gap-2">
              <dt className="w-24 shrink-0 font-medium text-foreground">
                {label}
              </dt>
              <dd className="truncate text-muted-foreground">{value}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  )
}

// Loading skeleton component
export function ColaboradorCardSkeleton() {
  return (
    <Card className="h-full border-border/60 shadow-none">
      <CardContent className="px-5 pt-5 pb-5">
        <div className="space-y-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-5 w-full" />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
