import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const RevenueStatisticsChart = (props) => {
  const { data } = props;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="label">
            {`${label} : ${payload[0].value?.toLocaleString()}`} VND
          </p>
        </div>
      );
    }
    return null;
  };
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        width={800}
        height={300}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        {/* <CartesianGrid strokeDasharray="3 3" /> */}
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Bar dataKey="pv" barSize={35} fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default RevenueStatisticsChart;
