"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { BATIDA_META, type TipoBatida } from "@/utils/types"

interface DialogNovaBatidaProps {
  onSalvar: (tipo: TipoBatida, data: string, horario: string, obs?: string) => void
  trigger?: React.ReactNode
}

export function DialogNovaBatida({ onSalvar, trigger }: DialogNovaBatidaProps) {
  const [open, setOpen] = useState(false)
  const [tipo, setTipo] = useState<TipoBatida>("inicio_expediente")
  const [data, setData] = useState(new Date().toISOString().slice(0, 10))
  const [horario, setHorario] = useState(new Date().toTimeString().slice(0, 5))
  const [obs, setObs] = useState("")

  function handleSalvar() {
    onSalvar(tipo, data, horario, obs || undefined)
    setOpen(false)
    setObs("")
  }

  const tiposOrdenados = (
    Object.entries(BATIDA_META) as [TipoBatida, (typeof BATIDA_META)[TipoBatida]][]
  ).sort(([, a], [, b]) => a.ordem - b.ordem)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? <Button size="sm">+ Novo horário</Button>}
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Registrar horário</DialogTitle>
          <DialogDescription>
            Adicione ou sobrescreva uma batida de ponto. Se já existir para o mesmo dia e
            tipo, o horário será atualizado.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="tipo">Tipo de batida</Label>
            <Select value={tipo} onValueChange={(v) => setTipo(v as TipoBatida)}>
              <SelectTrigger id="tipo">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {tiposOrdenados.map(([key, meta]) => (
                  <SelectItem key={key} value={key}>
                    <span className="flex items-center gap-2">
                      <span className="text-muted-foreground text-xs w-4 text-right">
                        {meta.ordem}
                      </span>
                      {meta.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label htmlFor="data">Data</Label>
              <Input
                id="data"
                type="date"
                value={data}
                onChange={(e) => setData(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="horario">Horário</Label>
              <Input
                id="horario"
                type="time"
                value={horario}
                onChange={(e) => setHorario(e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="obs">
              Observação{" "}
              <span className="text-muted-foreground font-normal">(opcional)</span>
            </Label>
            <Input
              id="obs"
              placeholder="Ex: Sistema fora do ar"
              value={obs}
              onChange={(e) => setObs(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSalvar}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
