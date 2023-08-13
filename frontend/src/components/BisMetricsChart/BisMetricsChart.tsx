import React, { FC, useEffect } from 'react';

import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  ReferenceLine
} from "recharts";
import { BisMetriscDto } from '../../store/types';

type Props = {
  bisMetricsDto: BisMetriscDto['balance'];
}

const BisMetricsChart: FC<Props> = ({bisMetricsDto}) => {
  return (
    <LineChart width={1000} height={400} data={bisMetricsDto}
      margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis domain={[202201, 202212]} dataKey="period" />
      <YAxis domain={[-1000, "max"]} dataKey="balance" tickFormatter={(value, index) => `${value}$`}  />
      <Tooltip />
      <Legend />
      <ReferenceLine y={0} label="Bankrupcy" stroke="red" strokeDasharray="3 3" strokeWidth={2} />
      <Line type="monotone" dataKey="period" stroke="#8884d8" />
      <Line type="monotone" dataKey="balance" stroke="#272727" />
      {/* <Line type="monotone" dataKey="balance1" stroke="#c41515" /> */}
    </LineChart>
  );
};

export default BisMetricsChart;

