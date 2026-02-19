interface StatCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  bgColor: string
  textColor: string
  trend?: string
  trendPositive?: boolean
}

export function StatCard({
  title,
  value,
  icon,
  bgColor,
  textColor,
  trend,
  trendPositive,
}: StatCardProps) {
  return (
    <div className={`${bgColor} rounded-2xl p-6 text-white shadow-lg`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-medium opacity-90">{title}</p>
          <h3 className="text-3xl font-bold mt-2">{value}</h3>
        </div>
        <div className="text-white/80">{icon}</div>
      </div>
      {trend && (
        <div className="flex items-center gap-2 pt-4 border-t border-white/20">
          <span className={`text-xs font-semibold ${trendPositive ? 'text-green-300' : 'text-red-300'}`}>
            {trendPositive ? '↑' : '↓'} {trend}
          </span>
          <span className="text-xs opacity-75">vs last month</span>
        </div>
      )}
    </div>
  )
}
