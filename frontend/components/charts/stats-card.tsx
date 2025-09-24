import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

interface StatsCardProps {
  title: string
  value: string | number
  change?: {
    value: number
    label: string
    type: "increase" | "decrease" | "neutral"
  }
  icon: LucideIcon
  className?: string
}

export function StatsCard({ title, value, change, icon: Icon, className }: StatsCardProps) {
  return (
    <Card className={cn("", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <div className="flex items-center space-x-2 mt-2">
            <Badge
              variant={
                change.type === "increase"
                  ? "success"
                  : change.type === "decrease"
                  ? "destructive"
                  : "secondary"
              }
              className="text-xs"
            >
              {change.type === "increase" && "+"}
              {change.value}%
            </Badge>
            <p className="text-xs text-muted-foreground">{change.label}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}