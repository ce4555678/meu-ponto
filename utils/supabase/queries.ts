import { createClient, isSupabaseConfigured } from "./server";
import type { Colaborador, RegistroPonto, DiaAgrupado, TipoBatida } from "@/utils/types";
import { calcularHorasTrabalhadas, calcularStatusDia } from "@/utils/types";

export type QueryResult<T> = 
  | { success: true; data: T }
  | { success: false; error: string };

// Busca usuário autenticado
export async function getAuthUser(): Promise<QueryResult<{ id: string; email: string } | null>> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: "Supabase não configurado" };
  }

  const supabase = await createClient();
  if (!supabase) {
    return { success: false, error: "Erro ao criar cliente Supabase" };
  }

  const { data, error } = await supabase.auth.getUser();

  if (error) {
    return { success: false, error: error.message };
  }

  if (!data.user) {
    return { success: true, data: null };
  }

  return { 
    success: true, 
    data: { id: data.user.id, email: data.user.email ?? "" } 
  };
}

// Busca colaborador pelo user_id
export async function getColaborador(userId: string): Promise<QueryResult<Colaborador & { id: number }>> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: "Supabase não configurado" };
  }

  const supabase = await createClient();
  if (!supabase) {
    return { success: false, error: "Erro ao criar cliente Supabase" };
  }

  const { data, error } = await supabase
    .from("colaborador")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return { success: false, error: "Colaborador não encontrado" };
    }
    return { success: false, error: error.message };
  }

  return {
    success: true,
    data: {
      id: data.id,
      nome: data.nome,
      matricula: data.matricula,
      admissao: data.admissao,
      contratante: data.contratante,
      cnpj: data.cnpj,
      ctps: data.ctps,
      ativo: true,
    },
  };
}

// Busca horários filtrados por mês/ano
export async function getHorarios(
  colaboradorId: number,
  mes: number,
  ano: number
): Promise<QueryResult<{ registros: RegistroPonto[]; diasAgrupados: DiaAgrupado[] }>> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: "Supabase não configurado" };
  }

  const supabase = await createClient();
  if (!supabase) {
    return { success: false, error: "Erro ao criar cliente Supabase" };
  }

  const { data, error } = await supabase
    .from("horarios")
    .select("*")
    .eq("colaborador_id", colaboradorId)
    .eq("mes", mes)
    .eq("ano", ano)
    .order("dia", { ascending: false });

  if (error) {
    return { success: false, error: error.message };
  }

  // Converte os dados para o formato RegistroPonto
  const registros: RegistroPonto[] = (data || []).map((h) => ({
    id: h.id,
    data: `${h.ano}-${String(h.mes).padStart(2, "0")}-${String(h.dia).padStart(2, "0")}`,
    tipo: h.type as TipoBatida,
    horario: h.horario,
    observacao: undefined,
  }));

  // Agrupa por dia
  const map = new Map<string, Record<TipoBatida, string | undefined>>();

  for (const reg of registros) {
    const dt = reg.data;
    if (!map.has(dt)) {
      map.set(dt, {
        inicio_expediente: undefined,
        inicio_almoco: undefined,
        retorno_almoco: undefined,
        inicio_cafe: undefined,
        retorno_cafe: undefined,
        termino_expediente: undefined,
      });
    }
    map.get(dt)![reg.tipo] = reg.horario;
  }

  const diasAgrupados: DiaAgrupado[] = Array.from(map.entries())
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([data, batidas]) => ({
      data,
      batidas,
      horasTrabalhadas: calcularHorasTrabalhadas(batidas),
      status: calcularStatusDia(batidas),
    }));

  return {
    success: true,
    data: { registros, diasAgrupados },
  };
}

// Busca estatísticas do período
export async function getStats(
  registros: RegistroPonto[]
): { totalRegistros: number; diasUnicos: number; ultimoRegistro: RegistroPonto | null } {
  const diasSet = new Set(registros.map((r) => r.data));
  const ultimoRegistro = [...registros].sort((a, b) =>
    `${b.data}${b.horario}`.localeCompare(`${a.data}${a.horario}`)
  )[0] ?? null;

  return {
    totalRegistros: registros.length,
    diasUnicos: diasSet.size,
    ultimoRegistro,
  };
}

// Busca todos os dados necessários para a Home
export async function getHomeData(mes: number, ano: number) {
  const authResult = await getAuthUser();
  
  if (!authResult.success) {
    return { success: false as const, error: authResult.error, requiresAuth: false };
  }

  if (!authResult.data) {
    return { success: false as const, error: "Não autenticado", requiresAuth: true };
  }

  const colaboradorResult = await getColaborador(authResult.data.id);
  
  if (!colaboradorResult.success) {
    // Se colaborador não existe, retorna dados básicos para criação
    return {
      success: true as const,
      data: {
        colaborador: null,
        colaboradorId: null,
        registros: [] as RegistroPonto[],
        diasAgrupados: [] as DiaAgrupado[],
        stats: { totalRegistros: 0, diasUnicos: 0, ultimoRegistro: null },
        userId: authResult.data.id,
      },
    };
  }

  const horariosResult = await getHorarios(colaboradorResult.data.id, mes, ano);
  
  if (!horariosResult.success) {
    return { success: false as const, error: horariosResult.error, requiresAuth: false };
  }

  const stats = getStats(horariosResult.data.registros);

  return {
    success: true as const,
    data: {
      colaborador: colaboradorResult.data,
      colaboradorId: colaboradorResult.data.id,
      registros: horariosResult.data.registros,
      diasAgrupados: horariosResult.data.diasAgrupados,
      stats,
      userId: authResult.data.id,
    },
  };
}
