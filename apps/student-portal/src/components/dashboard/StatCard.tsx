interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  color: string;
}

export function StatCard({ title, value, subtitle, color }: StatCardProps) {
  return (
    <div className={`${color} text-white rounded-lg shadow p-6`}>
      <p className="text-sm font-semibold opacity-90">{title}</p>
      <p className="text-3xl font-bold mt-2">{value}</p>
      {subtitle && <p className="text-xs opacity-75 mt-1">{subtitle}</p>}
    </div>
  );
}
