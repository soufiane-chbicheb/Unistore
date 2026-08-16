import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from "@/contextHooks/useTheme";

interface SalesChartProps {
  data: any[];
}

export function SalesChart({ data }: SalesChartProps) {
  const { theme: currentTheme } = useTheme();

  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={currentTheme.accent} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={currentTheme.accent} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={`${currentTheme.border}20`} />
          <XAxis 
            dataKey="date" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: currentTheme.textMuted, fontSize: 11, fontWeight: 600 }}
            tickFormatter={(value) => {
              const date = new Date(value);
              return `${date.getDate()}/${date.getMonth() + 1}`;
            }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: currentTheme.textMuted, fontSize: 11, fontWeight: 600 }}
            tickFormatter={(value) => value >= 1000 ? `${value / 1000}K` : value}
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
            cursor={{ stroke: currentTheme.accent, strokeWidth: 2, strokeDasharray: '5 5' }}
          />
          <Area 
            type="monotone" 
            dataKey="total" 
            stroke={currentTheme.accent} 
            strokeWidth={4}
            fillOpacity={1} 
            fill="url(#colorTotal)" 
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
