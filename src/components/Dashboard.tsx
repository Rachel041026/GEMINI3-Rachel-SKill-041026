import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const completenessData = [
  { name: 'Software', value: 85 },
  { name: 'Electrical', value: 92 },
  { name: 'Biocompat', value: 45 },
  { name: 'Clinical', value: 70 },
  { name: 'Risk', value: 60 },
];

const riskHeatmapData = [
  { category: 'High', count: 3 },
  { category: 'Medium', count: 12 },
  { category: 'Low', count: 25 },
];

const COLORS = ['#ef4444', '#f59e0b', '#10b981'];

export const Dashboard: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card className="bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs uppercase tracking-widest opacity-70">Submission Completeness %</CardTitle>
        </CardHeader>
        <CardContent className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={completenessData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis dataKey="name" fontSize={10} />
              <YAxis fontSize={10} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#000', border: 'none', borderRadius: '8px', fontSize: '10px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs uppercase tracking-widest opacity-70">Risk Profile Distribution</CardTitle>
        </CardHeader>
        <CardContent className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={riskHeatmapData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={60}
                paddingAngle={5}
                dataKey="count"
              >
                {riskHeatmapData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#000', border: 'none', borderRadius: '8px', fontSize: '10px' }}
                itemStyle={{ color: '#fff' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="bg-card/50 backdrop-blur-sm lg:col-span-1 md:col-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs uppercase tracking-widest opacity-70">Agent Processing Velocity</CardTitle>
        </CardHeader>
        <CardContent className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={[
              { time: '0s', tokens: 0 },
              { time: '10s', tokens: 450 },
              { time: '20s', tokens: 1200 },
              { time: '30s', tokens: 800 },
              { time: '40s', tokens: 2100 },
              { time: '50s', tokens: 1500 },
              { time: '60s', tokens: 2800 },
            ]}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis dataKey="time" fontSize={10} />
              <YAxis fontSize={10} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#000', border: 'none', borderRadius: '8px', fontSize: '10px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Area type="monotone" dataKey="tokens" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.2} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
