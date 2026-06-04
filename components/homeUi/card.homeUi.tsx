import { Card, CardContent } from "@/components/ui/card"

export default function CardHomeUi() {
  return (
    <Card className="h-full border-border/60 shadow-none">
      <CardContent className="px-5 pt-5 pb-5">
        <dl className="space-y-1.5 text-sm">
          <div className="flex gap-2">
            <dt className="w-24 shrink-0 font-medium text-foreground">Nome</dt>
            <dd className="truncate text-muted-foreground">Ana Paula Souza</dd>
          </div>
          <div className="flex gap-2">
            <dt className="w-24 shrink-0 font-medium text-foreground">
              Matrícula
            </dt>
            <dd className="truncate text-muted-foreground">EMP-00421</dd>
          </div>
          <div className="flex gap-2">
            <dt className="w-24 shrink-0 font-medium text-foreground">
              Admissão
            </dt>
            <dd className="truncate text-muted-foreground">12/03/2022</dd>
          </div>
          <div className="flex gap-2">
            <dt className="w-24 shrink-0 font-medium text-foreground">
              Contratante
            </dt>
            <dd className="truncate text-muted-foreground">Empresa Ltda.</dd>
          </div>
          <div className="flex gap-2">
            <dt className="w-24 shrink-0 font-medium text-foreground">CNPJ</dt>
            <dd className="truncate text-muted-foreground">
              12.345.678/0001-99
            </dd>
          </div>
          <div className="flex gap-2">
            <dt className="w-24 shrink-0 font-medium text-foreground">CTPS</dt>
            <dd className="truncate text-muted-foreground">0012345 / 001</dd>
          </div>
          <div className="flex gap-2">
            <dt className="w-24 shrink-0 font-medium text-foreground">Ativo</dt>
            <dd className="truncate text-muted-foreground">Sim</dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  )
}
