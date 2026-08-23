import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent } from '../../../../../components/ui/card';

interface StatsCardProps {
  title: string;
  value: number;
  change: string;
  trend: 'up' | 'down';
}

export function StatsCard({ title, value, change, trend }: StatsCardProps) {
  const TrendIcon = trend === 'up' ? TrendingUp : TrendingDown;
  
  return (
    <Card className="rounded-xl">
      <CardContent className="p-6">
        <div className="text-sm text-muted-foreground mb-2">{title}</div>
        <div className="text-3xl font-bold mb-2">{value}</div>
        <div className="flex items-center gap-2">
          <span className={`text-sm font-medium flex items-center gap-1 ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            <TrendIcon size={16} />
            {change}
          </span>
          <span className="text-sm text-muted-foreground">vs last month</span>
        </div>
      </CardContent>
    </Card>
  );
}
