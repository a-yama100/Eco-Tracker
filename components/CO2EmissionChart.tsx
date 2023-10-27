// E:\programming\Project\eco-tracker\components\CO2EmissionChart.tsx

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

interface Entry {
  name: string;
  co2_emission: number;
}

interface CO2EmissionChartProps {
  data: Entry[];
  title: string;
}

const CO2EmissionChart: React.FC<CO2EmissionChartProps> = ({ data, title }) => {
  return (
    <div className="mt-4">
      <h4>{title}</h4>
      <BarChart width={600} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="co2_emission" fill="#8884d8" name="CO2排出量" />
      </BarChart>
    </div>
  );
};

export default CO2EmissionChart;
