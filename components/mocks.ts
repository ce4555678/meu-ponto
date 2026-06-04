import type { RegistroPonto, Colaborador } from "@/utils/types"

// ─── Colaborador mock ─────────────────────────────────────────────────────────

export const MOCK_COLABORADOR: Colaborador = {
  nome: "Ana Paula Souza",
  matricula: "EMP-00421",
  admissao: "12/03/2022",
  contratante: "Empresa Ltda.",
  cnpj: "12.345.678/0001-99",
  ctps: "0012345 / 001",
  ativo: true,
}

// ─── Registros mock — junho 2025 ─────────────────────────────────────────────

let nextId = 1
function reg(data: string, tipo: RegistroPonto["tipo"], horario: string, obs?: string): RegistroPonto {
  return { id: nextId++, data, tipo, horario, observacao: obs }
}

export const MOCK_REGISTROS: RegistroPonto[] = [
  // 02/06 — dia completo com café
  reg("2025-06-02", "inicio_expediente",  "08:00"),
  reg("2025-06-02", "inicio_almoco",      "12:03"),
  reg("2025-06-02", "retorno_almoco",     "13:01"),
  reg("2025-06-02", "inicio_cafe",        "15:30"),
  reg("2025-06-02", "retorno_cafe",       "15:45"),
  reg("2025-06-02", "termino_expediente", "17:00"),

  // 01/06 — completo sem café
  reg("2025-06-01", "inicio_expediente",  "07:58"),
  reg("2025-06-01", "inicio_almoco",      "12:00"),
  reg("2025-06-01", "retorno_almoco",     "13:00"),
  reg("2025-06-01", "termino_expediente", "17:02"),

  // 31/05 — incompleto (saiu sem bater saída)
  reg("2025-05-31", "inicio_expediente",  "08:00"),
  reg("2025-05-31", "inicio_almoco",      "12:00"),
  reg("2025-05-31", "retorno_almoco",     "13:00"),
  reg("2025-05-31", "inicio_cafe",        "15:15"),
  reg("2025-05-31", "retorno_cafe",       "15:30"),

  // 30/05 — completo
  reg("2025-05-30", "inicio_expediente",  "08:05"),
  reg("2025-05-30", "inicio_almoco",      "12:10"),
  reg("2025-05-30", "retorno_almoco",     "13:05"),
  reg("2025-05-30", "termino_expediente", "17:08"),

  // 29/05 — falta total
  // (sem registros)

  // 28/05 — completo com hora extra
  reg("2025-05-28", "inicio_expediente",  "07:55"),
  reg("2025-05-28", "inicio_almoco",      "12:00"),
  reg("2025-05-28", "retorno_almoco",     "13:00"),
  reg("2025-05-28", "termino_expediente", "18:30"),

  // 27/05 — completo com café
  reg("2025-05-27", "inicio_expediente",  "08:00"),
  reg("2025-05-27", "inicio_almoco",      "12:00"),
  reg("2025-05-27", "retorno_almoco",     "13:00"),
  reg("2025-05-27", "inicio_cafe",        "15:00"),
  reg("2025-05-27", "retorno_cafe",       "15:15"),
  reg("2025-05-27", "termino_expediente", "17:00"),

  // 26/05 — apenas entrada (incompleto)
  reg("2025-05-26", "inicio_expediente",  "08:00", "Sistema fora do ar"),
]
