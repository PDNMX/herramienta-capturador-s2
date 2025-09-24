"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

interface PieChartComponentProps {
  data: Array<{
    name: string
    value: number
    color: string
  }>
  title?: string
}

export function PieChartComponent({ data, title }: PieChartComponentProps) {
  return (
    <div className="w-full h-80">
      {title && (
        <h3 className="text-lg font-semibold mb-4 text-center">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name) => [value, name]}
            labelFormatter={() => ''}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}