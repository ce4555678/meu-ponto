"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Pencil, Trash2 } from "lucide-react"
import {
  BATIDA_META, minutosParaLabel, formatarData,
  type TipoBatida, type DiaAgrupado, type RegistroPonto,
} from "@/utils/types"
import { StatusBadge } from "./StatusBadge"
import { DialogEditarBatida } from "./DialogEditarBatida"

const MESES = [
  { value: "1",  label: "Janeiro"  }, { value: "2",  label: "Fevereiro" },
  { value: "3",  label: "Março"    }, { value: "4",  label: "Abril"     },
  { value: "5",  label: "Maio"     }, { value: "6",  label: "Junho"     },
  { value: "7",  label: "Julho"    }, { value: "8",  label: "Agosto"    },
  { value: "9",  label: "Setembro" }, { value: "10", label: "Outubro"   },
  { value: "11", label: "Novembro" }, { value: "12", label: "Dezembro"  },
]

const COLUNAS: TipoBatida[] = [
  "inicio_expediente", "inicio_almoco", "retorno_almoco",
  "inicio_cafe", "retorno_cafe", "termino_expediente",
]

const anoAtual = new Date().getFullYear()
const ANOS = [anoAtual - 1, anoAtual, anoAtual + 1]

interface PontoTableProps {
  diasAgrupados: DiaAgrupado[]
  registros: RegistroPonto[]
  mes: number
  ano: number
  onMesChange: (v: number) => void
  onAnoChange: (v: number) => void
  onEditar: (id: number, dados: Partial<Pick<RegistroPonto, "horario" | "observacao">>) => void
  onExcluirRegistro: (id: number) => void
  onExcluirDia: (data: string) => void
  loading?: boolean
}

interface EditTarget {
  id: number
  data: string
  tipo: TipoBatida
  horario: string
  observacao?: string
}

export function PontoTable(
  {
  diasAgrupados, registros, mes, ano,
  onMesChange, onAnoChange,
  onEditar, onExcluirRegistro, onExcluirDia,
  loading,
}: PontoTableProps
) {
  const [editTarget, setEditTarget] = useState<EditTarget | null>(null)

  function abrirEdicao(dia: DiaAgrupado, tipo: TipoBatida) {
    const reg = registros.find((r) => r.data === dia.data && r.tipo === tipo)
    if (!reg) return
    setEditTarget({ id: reg.id, data: dia.data, tipo, horario: reg.horario, observacao: reg.observacao })
  }

  return (
    <>
      <Card className="border-border/60 shadow-none">
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <CardTitle>Registros de horário</CardTitle>
              <CardDescription className="mt-1">
                Clique em um horário para editá-lo. Linhas com "—" indicam batida ausente.
              </CardDescription>
            </div>

            <div className="flex flex-wrap gap-3 items-end shrink-0">
              <div className="grid gap-1.5">
                <Label htmlFor="filterMonth" className="text-xs text-muted-foreground">Mês</Label>
                <Select value={String(mes)} onValueChange={(v) => onMesChange(Number(v))}>
                  <SelectTrigger id="filterMonth" className="w-36 h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MESES.map((m) => (
                      <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="filterYear" className="text-xs text-muted-foreground">Ano</Label>
                <Select value={String(ano)} onValueChange={(v) => onAnoChange(Number(v))}>
                  <SelectTrigger id="filterYear" className="w-24 h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ANOS.map((a) => (
                      <SelectItem key={a} value={String(a)}>{a}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-11 w-full rounded-md" />
              ))}
            </div>
          ) : diasAgrupados.length === 0 ? (
            <div className="rounded-lg border border-dashed px-6 py-12 text-center">
              <p className="text-sm text-muted-foreground">
                Nenhum registro para{" "}
                {MESES.find((m) => m.value === String(mes))?.label} de {ano}.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-md border border-border/60">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40 hover:bg-muted/40">
                    <TableHead className="w-28">Data</TableHead>
                    {COLUNAS.map((tipo) => (
                      <TableHead key={tipo} className="text-center whitespace-nowrap text-xs">
                        {BATIDA_META[tipo].labelCurto}
                      </TableHead>
                    ))}
                    <TableHead className="text-center w-20">Horas</TableHead>
                    <TableHead className="w-28">Status</TableHead>
                    <TableHead className="w-10" />
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {diasAgrupados.map((dia) => (
                    <TableRow key={dia.data}>
                      <TableCell className="font-medium tabular-nums text-sm">
                        {formatarData(dia.data)}
                      </TableCell>

                      {COLUNAS.map((tipo) => {
                        const valor = dia.batidas[tipo]
                        return (
                          <TableCell key={tipo} className="text-center p-2">
                            <TooltipProvider delayDuration={300}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button
                                    onClick={() => valor && abrirEdicao(dia, tipo)}
                                    className={`tabular-nums text-sm px-2 py-1 rounded transition-colors ${
                                      valor
                                        ? "hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-950 dark:hover:text-blue-300 cursor-pointer"
                                        : "text-muted-foreground/40 cursor-default"
                                    }`}
                                  >
                                    {valor ?? "—"}
                                  </button>
                                </TooltipTrigger>
                                {valor && (
                                  <TooltipContent side="top">
                                    <p className="text-xs">Clique para editar</p>
                                  </TooltipContent>
                                )}
                              </Tooltip>
                            </TooltipProvider>
                          </TableCell>
                        )
                      })}

                      <TableCell className="text-center tabular-nums text-sm font-medium">
                        {dia.horasTrabalhadas !== null
                          ? minutosParaLabel(dia.horasTrabalhadas)
                          : <span className="text-muted-foreground/40">—</span>}
                      </TableCell>

                      <TableCell>
                        <StatusBadge status={dia.status} />
                      </TableCell>

                      <TableCell className="p-2">
                        <TooltipProvider delayDuration={300}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                onClick={() => onExcluirDia(dia.data)}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="left">
                              <p className="text-xs">Excluir dia</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {editTarget && (
        <DialogEditarBatida
          open={!!editTarget}
          onOpenChange={(o) => !o && setEditTarget(null)}
          data={editTarget.data}
          tipo={editTarget.tipo}
          horarioAtual={editTarget.horario}
          observacaoAtual={editTarget.observacao}
          onSalvar={(horario, observacao) =>
            onEditar(editTarget.id, { horario, observacao })
          }
          onExcluir={() => onExcluirRegistro(editTarget.id)}
        />
      )}
    </>
  )
}
