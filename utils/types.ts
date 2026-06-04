// ─── Tipos de batida ────────────────────────────────────────────────────────

export type TipoBatida =
  | "inicio_expediente"
  | "inicio_almoco"
  | "retorno_almoco"
  | "inicio_cafe"
  | "retorno_cafe"
  | "termino_expediente"

export const BATIDA_META: Record<
  TipoBatida,
  { label: string; labelCurto: string; ordem: number; grupo: "entrada" | "pausa" | "retorno" | "saida" }
> = {
  inicio_expediente:  { label: "Início de expediente", labelCurto: "Entrada",     ordem: 1, grupo: "entrada" },
  inicio_almoco:      { label: "Início do almoço",     labelCurto: "Almoço",      ordem: 2, grupo: "pausa"   },
  retorno_almoco:     { label: "Retorno do almoço",    labelCurto: "Ret. almoço", ordem: 3, grupo: "retorno" },
  inicio_cafe:        { label: "Início do café",       labelCurto: "Café",        ordem: 4, grupo: "pausa"   },
  retorno_cafe:       { label: "Retorno do café",      labelCurto: "Ret. café",   ordem: 5, grupo: "retorno" },
  termino_expediente: { label: "Término do expediente",labelCurto: "Saída",       ordem: 6, grupo: "saida"   },
}

export interface RegistroPonto {
  id: number
  data: string   // "YYYY-MM-DD"
  tipo: TipoBatida
  horario: string // "HH:mm"
  observacao?: string
}

export interface Colaborador {
  nome: string
  matricula: string
  admissao: string
  contratante: string
  cnpj: string
  ctps: string
  ativo: boolean
}

export interface DiaAgrupado {
  data: string
  batidas: Record<TipoBatida, string | undefined>
  horasTrabalhadas: number | null
  status: "completo" | "incompleto" | "falta"
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function horarioParaMinutos(h: string): number {
  const [hh, mm] = h.split(":").map(Number)
  return hh * 60 + mm
}

export function minutosParaLabel(min: number): string {
  if (min <= 0) return "—"
  const h = Math.floor(min / 60)
  const m = min % 60
  return m === 0 ? `${h}h` : `${h}h${String(m).padStart(2, "0")}`
}

export function calcularHorasTrabalhadas(
  batidas: Record<TipoBatida, string | undefined>
): number | null {
  const { inicio_expediente: ini, termino_expediente: fim,
          inicio_almoco: ia, retorno_almoco: ra,
          inicio_cafe: ic, retorno_cafe: rc } = batidas
  if (!ini || !fim) return null
  let total = horarioParaMinutos(fim) - horarioParaMinutos(ini)
  if (ia && ra) total -= horarioParaMinutos(ra) - horarioParaMinutos(ia)
  if (ic && rc) total -= horarioParaMinutos(rc) - horarioParaMinutos(ic)
  return total
}

export function calcularStatusDia(batidas: Record<TipoBatida, string | undefined>): DiaAgrupado["status"] {
  const temEntrada = !!batidas.inicio_expediente
  const temSaida   = !!batidas.termino_expediente
  if (!temEntrada && !temSaida) return "falta"
  if (temEntrada && temSaida)   return "completo"
  return "incompleto"
}

export function formatarData(iso: string): string {
  const [y, m, d] = iso.split("-")
  return `${d}/${m}/${y}`
}
