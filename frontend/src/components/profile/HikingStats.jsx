import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, Compass, Clock, Users, UserCheck } from 'lucide-react';
import { HikingChart } from './HikingChart';

const StatCard = ({ title, value, icon: Icon }) => (
  <Card className="bg-white">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
      <Icon className="h-4 w-4 text-gray-400" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
    </CardContent>
  </Card>
);

export function HikingStats({ stats, completedTrails }) {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Your Hiking Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <StatCard title="Total Hikes" value={stats.totalHikes || 0} icon={BarChart3} />
            <StatCard title="Total Distance" value={`${stats.totalDistance || 0} km`} icon={Compass} />
            <StatCard title="Elevation Gain" value={`${stats.totalElevation || 0} m`} icon={TrendingUp} />
            <StatCard title="Hiking Hours" value={stats.totalHours || 0} icon={Clock} />
            <StatCard title="Groups Joined" value={stats.hikesJoined || 0} icon={Users} />
            <StatCard title="Groups Led" value={stats.hikesLed || 0} icon={UserCheck} />
          </div>
        </CardContent>
      </Card>
      
      {/* Chart Section */}
      <div className="grid grid-cols-1 gap-6">
           <HikingChart completedTrails={completedTrails} />
      </div>
    </div>
  );
}