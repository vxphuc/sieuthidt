import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

function ChartColum({ data }) {
  // const data = [{name: 'Page A', uv: 400, pv: 2400, amt: 2400}];
  return (
    <div>
      <ResponsiveContainer width="100%" height={300} >
        <BarChart data={data}>
          <XAxis dataKey="name" stroke="#8884d8" />
          <YAxis type="number" domain={["auto", "auto"]} />
          <Tooltip
            //value chính là giá trị uv, và name chính là key của nó
            formatter={(value, name) => {
              const formatted = Number.parseFloat(value).toLocaleString(
                "vi-VN",
                {
                  style: "currency",
                  currency: "VND",
                }
              );
              return [formatted, "Số tiền"];
            }}
          />
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <Bar dataKey="số tiền" fill="#8884d8" barSize={30} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ChartColum;
