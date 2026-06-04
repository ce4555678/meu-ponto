import { Badge } from "@/components/ui/badge"
import type { DiaAgrupado } from "@/utils/types"

interface StatusBadgeProps {
  status: DiaAgrupado["status"]
}

const CONFIG = {
  completo: {
    label: "Completo",
    className:
      "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  },
  incompleto: {
    label: "Incompleto",
    className:
      "border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-300",
  },
  falta: {
    label: "Falta",
    className:
      "border-rose-300 bg-rose-50 text-rose-700 dark:border-rose-700 dark:bg-rose-950 dark:text-rose-300",
  },
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const { label, className } = CONFIG[status]
  return (
    <Badge variant="outline" className={className}>
      {label}
    </Badge>
  )
}
