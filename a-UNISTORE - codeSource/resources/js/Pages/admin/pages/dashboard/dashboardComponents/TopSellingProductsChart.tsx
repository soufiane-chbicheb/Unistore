import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from "@/contextHooks/useTheme";

interface TopSellingProductsChartProps {
  products: any[];
}

export function TopSellingProductsChart({ products }: TopSellingProductsChartProps) {
  const { theme: currentTheme } = useTheme();

  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={products} margin={{ top: 10, right: 10, left: 0, bottom: 40 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={`${currentTheme.border}20`} />
          <XAxis 
            dataKey="name" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: currentTheme.textMuted, fontSize: 10, fontWeight: 600 }}
            angle={-25}
            textAnchor="end"
            interval={0}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: currentTheme.textMuted, fontSize: 11, fontWeight: 600 }}
            tickFormatter={(value) => value >= 1000 ? `${(value / 1000).toFixed(0)}K` : value}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: currentTheme.card, 
              borderColor: `${currentTheme.border}40`,
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 'bold',
              color: currentTheme.text
            }}
            itemStyle={{ color: currentTheme.accent }}
            cursor={{ fill: `${currentTheme.text}05` }}
            formatter={(value: any) => [`${value.toLocaleString()} MAD`, 'Revenue']}
          />
          <Bar 
            dataKey="revenue" 
            fill={currentTheme.accent} 
            radius={[6, 6, 0, 0]}
            animationDuration={1500}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
