export interface IWidgetMetrics {
  current: number
  previous: number
  change: number
  changePercent: number
}

export interface IBalanceWidget {
  month: IWidgetMetrics
  year: IWidgetMetrics
}

export interface IOverviewChartData {
  month: number
  revenue: number
  expenses: number
  balance: number
}

export interface IOverviewWidget {
  year: number
  months: IOverviewChartData[]
}
