"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"

interface OverviewChartProps {
  data: Array<{
    name: string
    servidores: number
    contrataciones: number
  }>
}

export function OverviewChart({ data }: OverviewChartProps) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Tooltip
          content={({ active, payload, label }) => {
            if (active && payload && payload.length) {
              return (
                <div className="rounded-lg border bg-background p-2 shadow-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">
                        {label}
                      </span>
                      <span className="font-bold text-muted-foreground">
                        Servidores: {payload[0].value}
                      </span>
                      <span className="font-bold text-muted-foreground">
                        Contrataciones: {payload[1].value}
                      </span>
                    </div>
                  </div>
                </div>
              )
            }
            return null
          }}
        />
        <Legend />
        <Bar
          dataKey="servidores"
          fill="#8B1538"
          radius={[4, 4, 0, 0]}
          name="Servidores Públicos"
        />
        <Bar
          dataKey="contrataciones"
          fill="#1C4E80"
          radius={[4, 4, 0, 0]}
          name="Contrataciones"
        />
      </BarChart>
    </ResponsiveContainer>
  )
}