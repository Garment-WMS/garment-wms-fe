import Colors from '@/constants/color';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

interface PieChartComponentProps {
  data: { name: string; value: number }[];
  colors: string[];
  width?: number;
  height?: number;
  innerRadius?: number;
  outerRadius?: number;
  labelType?: 'percentage' | 'value';
  showLegend?: boolean;
  legendHeight?: number;
  showValue?: boolean; // Added prop to toggle label display
}

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = (
  { cx, cy, midAngle, innerRadius, outerRadius, percent, value }: any,
  labelType: 'percentage' | 'value'
) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      style={{
        fontSize: '16px',
        fontWeight: 'bold',
        stroke: 'black',
        strokeWidth: '0.5px',
        fill: Colors.commonBtnText
      }}>
      {labelType === 'percentage' ? `${(percent * 100).toFixed(0)}%` : value}
    </text>
  );
};

const PieChartComponent: React.FC<PieChartComponentProps> = ({
  data,
  colors,
  width = 500,
  height = 550,
  innerRadius = 100,
  outerRadius = 180,
  labelType = 'percentage',
  showLegend = false,
  legendHeight = 40,
  showValue = true // Default is true to show values
}) => {
  // Enforce legendHeight when showLegend is true
  if (showLegend && !legendHeight) {
    throw new Error(
      'If "showLegend" is true, "legendHeight" must be provided. Please specify a legendHeight value.'
    );
  }

  const filteredData = data.filter((entry) => entry.value !== 0);

  return (
    <div className="flex justify-center">
      <PieChart width={width} height={height}>
        <Pie
          data={filteredData}
          isAnimationActive={false}
          cx={width / 2}
          cy={height / 2}
          labelLine={false}
          label={showValue ? (props) => renderCustomizedLabel(props, labelType) : undefined} // Render labels conditionally
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          fill="#8884d8"
          dataKey="value">
          {data.map((entry, index) => (
            <Cell
              style={{ outline: 'none' }}
              key={`cell-${index}`}
              fill={colors[index % colors.length]}
            />
          ))}
        </Pie>
        <Tooltip />
        {showLegend && (
          <Legend
            iconType="circle"
            layout="vertical"
            verticalAlign="bottom"
            height={legendHeight}
            align="center"
          />
        )}
      </PieChart>
    </div>
  );
};

export default PieChartComponent;
