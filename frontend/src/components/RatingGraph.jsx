import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export default function RatingGraph({ data }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          tickFormatter={(date) => new Date(date).toLocaleDateString()}
        />
        <YAxis domain={['auto', 'auto']} />
        <Tooltip
          labelFormatter={(date) => new Date(date).toLocaleString()}
          formatter={(value, name) => [value, 'Rating']}
        />
        <Line type="monotone" dataKey="newRating" stroke="#1d4ed8" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
}