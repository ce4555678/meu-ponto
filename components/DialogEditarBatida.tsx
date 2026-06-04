"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BATIDA_META, formatarData, type TipoBatida } from "@/utils/types"

interface DialogEditarBatidaProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  data: string
  tipo: TipoBatida
  horarioAtual: string
  observacaoAtual?: string
  onSalvar: (horario: string, observacao?: string) => void
  onExcluir: () => void
}

export function DialogEditarBatida({
  open, onOpenChange,
  data, tipo, horarioAtual, observacaoAtual,
  onSalvar, onExcluir,
}: DialogEditarBatidaProps) {
  const [horario, setHorario] = useState(horarioAtual)
  const [obs, setObs] = useState(observacaoAtual ?? "")

  function handleSalvar() {
    onSalvar(horario, obs || undefined)
    onOpenChange(false)
  }

  function handleExcluir() {
    onExcluir()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Editar batida</DialogTitle>
          <DialogDescription>
            {BATIDA_META[tipo].label} — {formatarData(data)}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="edit-horario">Horário</Label>
            <Input
              id="edit-horario"
              type="time"
              value={horario}
              onChange={(e) => setHorario(e.target.value)}
              autoFocus
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-obs">
              Observação{" "}
              <span className="text-muted-foreground font-normal">(opcional)</span>
            </Label>
            <Input
              id="edit-obs"
              placeholder="Motivo da alteração..."
              value={obs}
              onChange={(e) => setObs(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:justify-between">
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={handleExcluir}
          >
            Excluir
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSalvar}>Salvar</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
