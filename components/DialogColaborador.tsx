"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Colaborador } from "@/utils/types"

interface DialogColaboradorProps {
  colaborador: Colaborador
  onSalvar: (dados: Colaborador) => void
  trigger?: React.ReactNode
}

const CAMPOS: { key: keyof Omit<Colaborador, "ativo">; label: string; placeholder?: string }[] = [
  { key: "nome",        label: "Nome completo",   placeholder: "João da Silva" },
  { key: "matricula",   label: "Matrícula",        placeholder: "EMP-00001" },
  { key: "admissao",    label: "Data de admissão", placeholder: "01/01/2024" },
  { key: "contratante", label: "Contratante",      placeholder: "Empresa Ltda." },
  { key: "cnpj",        label: "CNPJ",             placeholder: "00.000.000/0001-00" },
  { key: "ctps",        label: "CTPS",             placeholder: "0000000 / 000" },
]

export function DialogColaborador({ colaborador, onSalvar, trigger }: DialogColaboradorProps) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<Colaborador>(colaborador)

  useEffect(() => { setForm(colaborador) }, [colaborador, open])

  function update(key: keyof Colaborador, value: string) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function handleSalvar() {
    onSalvar(form)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="outline" size="sm">
            Cadastrar colaborador
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Dados do colaborador</DialogTitle>
          <DialogDescription>
            Informações que aparecem no cabeçalho do relatório impresso.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 py-2 sm:grid-cols-2">
          {CAMPOS.map(({ key, label, placeholder }) => (
            <div key={key} className="grid gap-2">
              <Label htmlFor={key}>{label}</Label>
              <Input
                id={key}
                placeholder={placeholder}
                value={String(form[key])}
                onChange={(e) => update(key, e.target.value)}
              />
            </div>
          ))}
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
