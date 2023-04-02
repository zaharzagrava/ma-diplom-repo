import React, { FC, useEffect } from 'react';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Brush,
  LineChart,
  Line
} from "recharts";
import { BisMetricDto } from '../../store/types';

type Props = {
  bisMetricsDto: BisMetricDto[];
}

const BisMetricsChart: FC<Props> = ({bisMetricsDto}) => {
  const bisFunctions1 = [
    {
      y: 1000,
      x: 202201,
    },
    {
      y: 1500,
      x: 202202,
    },
    {
      y: 1200,
      x: 202203,
    },
  ]


  return (
    <LineChart width={1000} height={250} data={bisFunctions1}
      margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis domain={["min", "max"]} dataKey="x" />
      <YAxis domain={["min", "max"]} dataKey="y" tickFormatter={(value, index) => `${value}$`}  />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="x" stroke="#8884d8" />
      <Line type="monotone" dataKey="y" stroke="#272727" />
    </LineChart>
  );
};

export default BisMetricsChart;

