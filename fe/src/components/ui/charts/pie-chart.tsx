import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { Loader2 } from 'lucide-react'

interface PieChartData {
  name: string
  value: number
}

interface ReusablePieChartProps {
  icon: React.ReactNode
  data: PieChartData[]
  title: string
  isPending?: boolean
  className?: string
  colors?: Record<string, string>
  height?: string
  showAnimation?: boolean
  animationDelay?: number
}

const DEFAULT_COLORS = {
  'In Use': '#3b82f6',
  'Under Maintenance': '#f59e0b',
  'Retired / Disposed': '#ef4444',
  New: '#22c55e',
}

const renderCustomizedLabel = ({ cx, cy, midAngle, outerRadius, percent, fill }: any, showLabels: boolean) => {
  if (percent < 0.02 || !showLabels) return null

  const RADIAN = Math.PI / 180
  const screenWidth = window.innerWidth

  const getResponsiveConfig = () => {
    if (screenWidth < 360) return { labelRadius: outerRadius + 25, lineEndOffset: 20 }
    if (screenWidth < 640) return { labelRadius: outerRadius + 30, lineEndOffset: 25 }
    if (screenWidth < 1024) return { labelRadius: outerRadius + 28, lineEndOffset: 25 }
    if (screenWidth < 1440) return { labelRadius: outerRadius + 35, lineEndOffset: 33 }
    return { labelRadius: outerRadius + 40, lineEndOffset: 38 }
  }

  const { labelRadius, lineEndOffset } = getResponsiveConfig()

  const radius = labelRadius
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  const lineStartRadius = outerRadius + 5
  const lineStartX = cx + lineStartRadius * Math.cos(-midAngle * RADIAN)
  const lineStartY = cy + lineStartRadius * Math.sin(-midAngle * RADIAN)

  const lineEndRadius = outerRadius + lineEndOffset
  const lineEndX = cx + lineEndRadius * Math.cos(-midAngle * RADIAN)
  const lineEndY = cy + lineEndRadius * Math.sin(-midAngle * RADIAN)

  return (
    <g
      style={{
        opacity: showLabels ? 1 : 0,
        transition: 'opacity 0.5s ease-in-out',
      }}
    >
      <line
        x1={lineStartX}
        y1={lineStartY}
        x2={lineEndX}
        y2={lineEndY}
        stroke={fill}
        strokeWidth={2}
      />
      <text
        x={x}
        y={y}
        fill='currentColor'
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline='central'
        className='text-foreground text-xs font-semibold sm:text-sm'
      >
        {`${(percent * 100).toFixed(1)}%`}
      </text>
    </g>
  )
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className='bg-background max-w-[200px] rounded-lg border p-2 shadow-lg'>
        <p className='text-foreground text-sm font-medium'>{data.name}</p>
        <p className='text-muted-foreground text-xs'>{`${data.value} (${(data.percent * 100).toFixed(1)}%)`}</p>
      </div>
    )
  }
  return null
}

const CustomLegend = ({ payload }: any) => {
  return (
    <div className='mt-2 flex flex-wrap justify-center gap-2 sm:mt-4 sm:gap-4 lg:gap-6'>
      {payload.map((entry: any) => (
        <div
          key={entry.value}
          className='flex items-center gap-1 sm:gap-2'
        >
          <div
            className='h-2 w-2 rounded-full sm:h-2.5 sm:w-2.5'
            style={{ backgroundColor: entry.color }}
          />
          <span className='text-muted-foreground text-xs sm:text-sm'>{entry.value}</span>
        </div>
      ))}
    </div>
  )
}

const applyLargestRemainder = (data: Array<{ value: number; name: string }>) => {
  if (!data.length) return []

  const total = data.reduce((sum, item) => sum + item.value, 0)
  if (total === 0) return data.map((item) => ({ ...item, percent: 0 }))

  const withPercentages = data.map((item) => ({
    ...item,
    exactPercent: item.value / total,
    percent: Math.floor((item.value / total) * 1000) / 1000,
    remainder: ((item.value / total) * 1000) % 1,
  }))

  const totalPercent = withPercentages.reduce((sum, item) => sum + item.percent, 0)

  const remainingPercent = Math.max(0, 1 - totalPercent)
  const extraPoints = Math.round(remainingPercent * 1000)

  const sorted = [...withPercentages].sort((a, b) => b.remainder - a.remainder)

  for (let i = 0; i < extraPoints && sorted.length > 0; i++) {
    sorted[i % sorted.length].percent += 0.001
  }

  return sorted.map(({ name, value, percent }) => ({
    name,
    value,
    percent,
  }))
}

export const ReusablePieChart = ({
  icon,
  data,
  title,
  isPending = false,
  className = '',
  colors = DEFAULT_COLORS,
  height = 'h-[250px] sm:h-[300px] lg:h-[350px]',
  showAnimation = true,
  animationDelay = 2000,
}: ReusablePieChartProps) => {
  const [showLabels, setShowLabels] = useState(!showAnimation)

  useEffect(() => {
    if (!isPending && data && data.length > 0 && showAnimation) {
      const timer = setTimeout(() => {
        setShowLabels(true)
      }, animationDelay)

      return () => clearTimeout(timer)
    }
  }, [isPending, data, showAnimation, animationDelay])

  useEffect(() => {
    if (isPending || !data || data.length === 0) {
      setShowLabels(!showAnimation)
    }
  }, [isPending, data, showAnimation])

  const rawData = data.filter((item) => item.value > 0)
  const pieChartData = applyLargestRemainder(rawData)
  const isMobile = window.innerWidth <= 430
  return (
    <Card className={`transition-shadow duration-200 hover:shadow-lg ${className}`}>
      <CardHeader className='pb-3 sm:pb-6'>
        <CardTitle className='text-base sm:text-lg'>
          <div className='flex items-center gap-2'>
            {icon}
            {title}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isPending ? (
          <div className={`flex items-center justify-center ${height}`}>
            <Loader2 className='h-6 w-6 animate-spin sm:h-8 sm:w-8' />
          </div>
        ) : (
          <div className={height}>
            <ResponsiveContainer
              width='100%'
              height='100%'
            >
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx='50%'
                  cy='45%'
                  outerRadius={isMobile ? '50%' : '65%'}
                  dataKey='value'
                  startAngle={90}
                  endAngle={-270}
                  label={(props) => renderCustomizedLabel(props, showLabels)}
                  labelLine={false}
                  strokeWidth={0}
                >
                  {(pieChartData || []).map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={colors[entry.name as keyof typeof colors] || '#8884d8'}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend content={<CustomLegend />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
