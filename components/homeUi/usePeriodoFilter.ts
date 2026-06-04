"use client"

import { parseAsInteger, useQueryState } from "nuqs"

const hoje = new Date()

export function usePeriodoFilter() {
  const [mes, setMes] = useQueryState(
    "mes",
    parseAsInteger.withDefault(hoje.getMonth() + 1)
  )
  const [ano, setAno] = useQueryState(
    "ano",
    parseAsInteger.withDefault(hoje.getFullYear())
  )

  return {
    mes,
    ano,
    setMes,
    setAno,
  }
}
