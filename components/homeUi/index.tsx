// Componentes da Home
export { ColaboradorCard, ColaboradorCardSkeleton } from "./ColaboradorCard"
export { StatsCards, StatsCardsSkeleton } from "./StatsCards"
export { Header, HeaderSkeleton } from "./Header"
export { HorariosTable, HorariosTableSkeleton } from "./HorariosTable"
export { usePeriodoFilter } from "./usePeriodoFilter"

// Re-export do card antigo para compatibilidade
import CardHomeUi from "./card.homeUi"
export { CardHomeUi }

const HomeUi = {
  card: CardHomeUi,
}

export default HomeUi
