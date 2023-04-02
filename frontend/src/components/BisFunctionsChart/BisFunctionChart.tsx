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
  bisFunctions: BisFunctionDto[];
}

const BisFunctionChart: FC<Props> = ({bisFunctions}) => {
  const bisFunctions1 = [
    {
      name: "Закупка Ресурсів",
      uv: [202203, 202205]
    },
    {
      name: "Виготовлення Ресурсів",
      uv: [202201, 202202]
    },
    {
      name: "Виплата Кредиту",
      uv: [202204, 202207]
    },
  ]


  return (
    <BarChart
      width={1000}
      height={300}
      data={bisFunctions1}
      layout='vertical'
      margin={{
        top: 5,
        right: 30,
        left: 100,
        bottom: 5
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis  domain={["min", "max"]} type="number" dataKey="uv" />
      <YAxis tickMargin={10} type='category' dataKey="name"  />
      <Bar dataKey="uv" fill="#333333"  />
    </BarChart>
  );
};

export default BisFunctionChart;
