import React, { FC, useEffect } from 'react';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Brush
} from "recharts";
import { BisFunctionDto } from '../../store/bis-function.types';

type Props = {
  bisFunctions: { name: string; periodRange: [number, number]}[];
}

const BisFunctionsChart: FC<Props> = ({bisFunctions}) => {
  bisFunctions = bisFunctions.map(x => {
    if(x.periodRange[0] === x.periodRange[1]) {
      return {
        ...x,
        periodRange: [x.periodRange[0] - 0.15, x.periodRange[1] + 0.15]
      }
    }

    return x;
  })

  return (
    <BarChart
      width={1000}
      height={300}
      data={bisFunctions}
      layout='vertical'
      margin={{
        top: 5,
        right: 30,
        left: 100,
        bottom: 5
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis tickCount={12} domain={["min", 202212]} type="number" dataKey="periodRange" />
      <YAxis tickMargin={10} type='category' dataKey="name"  />
      <Bar dataKey="periodRange" fill="#333333"  />
    </BarChart>
  );
};

export default BisFunctionsChart;
