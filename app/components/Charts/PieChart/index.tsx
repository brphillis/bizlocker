import { Pie, PieChart, ResponsiveContainer } from "recharts";

type Props = {
  data: { name: string; value: number }[];
};

const PieReChart = ({ data }: Props) => {
  return (
    <ResponsiveContainer height={300}>
      <PieChart height={100}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={100}
          className="fill-primary"
          dataKey="value"
          label={({
            cx,
            cy,
            midAngle,
            innerRadius,
            outerRadius,
            value,
            index,
          }) => {
            const RADIAN = Math.PI / 180;
            // eslint-disable-next-line
            const radius = 25 + innerRadius + (outerRadius - innerRadius);
            // eslint-disable-next-line
            const x = cx + radius * Math.cos(-midAngle * RADIAN);
            // eslint-disable-next-line
            const y = cy + radius * Math.sin(-midAngle * RADIAN);

            return (
              <text
                x={x}
                y={y}
                fill="#8884d8"
                textAnchor={x > cx ? "start" : "end"}
                dominantBaseline="central"
              >
                {data[index].name} ({value})
              </text>
            );
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default PieReChart;
