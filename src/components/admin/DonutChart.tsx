import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import type { DonutSlice } from "../../lib/admin";

const DonutChart = ({
  slices,
  size = 84,
}: {
  slices: DonutSlice[];
  size?: number;
}) => {
  const total = slices.reduce((sum, slice) => sum + slice.value, 0);

  return (
    <div className="flex flex-col items-start sm:flex-row sm:items-center gap-4">
      <div style={{ width: size, height: size }} className="shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={slices}
              dataKey="value"
              nameKey="label"
              innerRadius="62%"
              outerRadius="100%"
              paddingAngle={2}
              stroke="none"
            >
              {slices.map((slice) => (
                <Cell key={slice.label} fill={slice.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="flex flex-col gap-1.5">
        {slices.map((slice) => (
          <li
            key={slice.label}
            className="flex items-center gap-2 text-xs text-admin-gray"
          >
            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: slice.color }}
            />
            <span className="">
              {total > 0 ? Math.round((slice.value / total) * 100) : 0}%{" "}
              {slice.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DonutChart;
