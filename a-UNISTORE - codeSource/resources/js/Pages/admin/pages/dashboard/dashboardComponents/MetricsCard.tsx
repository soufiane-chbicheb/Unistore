import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useTheme } from "@/contextHooks/useTheme";

interface MetricsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: number;
}

export function MetricsCard({ title, value, icon, change }: MetricsCardProps) {
  const { theme: currentTheme } = useTheme();
  const isPositive = change !== undefined && change > 0;
  const isNegative = change !== undefined && change < 0;

  return (
    <div 
      className="p-6 rounded-3xl border space-y-4"
      style={{ 
        backgroundColor: currentTheme.card, 
        borderColor: `${currentTheme.border}40` // subtle border
      }}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h3 className="text-3xl font-bold" style={{ color: currentTheme.text }}>{value}</h3>
          <p className="text-sm font-medium" style={{ color: currentTheme.textMuted }}>{title}</p>
        </div>
        <div className="p-3 rounded-2xl" style={{ backgroundColor: `${currentTheme.text}10` }}>
          {icon}
        </div>
      </div>
      
      {change !== undefined && (
        <div className="flex items-center gap-2">
          <div 
            className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full`}
            style={{ 
              color: isPositive ? currentTheme.success : isNegative ? currentTheme.error : currentTheme.textMuted,
              backgroundColor: isPositive ? `${currentTheme.success}20` : isNegative ? `${currentTheme.error}20` : `${currentTheme.text}10`
            }}
          >
            {isPositive ? <TrendingUp size={12} /> : isNegative ? <TrendingDown size={12} /> : null}
            {Math.abs(change)}%
          </div>
          <span className="text-xs font-medium" style={{ color: currentTheme.textMuted }}>vs last period</span>
        </div>
      )}
    </div>
  );
}
