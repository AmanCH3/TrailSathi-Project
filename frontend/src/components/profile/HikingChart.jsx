import React, { useMemo } from 'react';
import { 
  ComposedChart, 
  Area, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function HikingChart({ completedTrails }) {
  const chartData = useMemo(() => {
    if (!completedTrails || completedTrails.length === 0) return [];

    // Sort by completion date
    const sorted = [...completedTrails].sort((a, b) => new Date(a.completedAt) - new Date(b.completedAt));

    return sorted.map(hike => ({
      name: hike.trail.name,
      date: new Date(hike.completedAt).toLocaleDateString(),
      elevation: hike.trail.elevationGain || 0,
      distance: hike.trail.length || 0,
      fullDate: new Date(hike.completedAt).toDateString(),
    }));
  }, [completedTrails]);

  if (!completedTrails || completedTrails.length === 0) {
      return null;
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-sm p-4 border border-gray-100 rounded-xl shadow-xl">
          <p className="font-bold text-gray-800 mb-2">{payload[0].payload.name}</p>
          <div className="space-y-1">
             <div className="flex items-center gap-2 text-sm text-amber-600">
               <span className="w-2 h-2 rounded-full bg-amber-500"></span>
               <span className="font-medium">Elevation:</span>
               <span className="font-bold">{payload[0].value} m</span>
             </div>
             <div className="flex items-center gap-2 text-sm text-blue-600">
               <span className="w-2 h-2 rounded-full bg-blue-500"></span>
               <span className="font-medium">Distance:</span>
               <span className="font-bold">{payload[1]?.value} km</span>
             </div>
             <p className="text-xs text-gray-400 mt-2 pt-2 border-t border-gray-100 italic">
                {payload[0].payload.fullDate}
             </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="shadow-sm border border-gray-100 overflow-hidden">
      <CardHeader className="border-b border-gray-50 bg-gray-50/30 pb-4">
        <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-bold text-gray-800 flex items-center gap-2">
                Performance History 
                <Badge variant="secondary" className="text-xs font-normal bg-gray-100 text-gray-600">Elevation & Distance</Badge>
            </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-[350px] w-full bg-gradient-to-b from-white to-gray-50/50 p-4">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#9ca3af', fontSize: 11 }} 
                dy={10}
                tickFormatter={(val) => val.length > 10 ? `${val.substring(0, 8)}...` : val}
              />
              <YAxis 
                yAxisId="left"
                orientation="left"
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#f59e0b', fontSize: 11, fontWeight: 500 }} 
                label={{ value: 'Elevation (m)', angle: -90, position: 'insideLeft', fill: '#d97706', fontSize: 10, dy: 40 }}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#3b82f6', fontSize: 11, fontWeight: 500 }} 
                label={{ value: 'Distance (km)', angle: 90, position: 'insideRight', fill: '#2563eb', fontSize: 10, dy: 40 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="top" height={36} iconType="circle"/>
              
              <Area 
                yAxisId="left"
                type="monotone" 
                dataKey="elevation" 
                name="Elevation Gain"
                stroke="#f59e0b" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#f59e0b)" /* Fallback color since Defs are removed */
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="distance" 
                name="Distance"
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ r: 4, fill: "#fff", stroke: "#3b82f6", strokeWidth: 2 }}
                activeDot={{ r: 6, fill: "#3b82f6" }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
