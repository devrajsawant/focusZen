'use client'

import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis, ResponsiveContainer } from 'recharts'

const data = [
  { day: 'Mon', DSA: 1, Gym: 1, Guitar: 0 },
  { day: 'Tue', DSA: 1, Gym: 1, Guitar: 1 },
  { day: 'Wed', DSA: 1, Gym: 0, Guitar: 1 },
  { day: 'Thu', DSA: 1, Gym: 1, Guitar: 0 },
  { day: 'Fri', DSA: 1, Gym: 1, Guitar: 1 },
  { day: 'Sat', DSA: 0, Gym: 1, Guitar: 1 },
  { day: 'Sun', DSA: 1, Gym: 0, Guitar: 1 },
]

export default function ProgressChart() {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">📊 Weekly Progress</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="DSA" fill="#6366f1" />
          <Bar dataKey="Gym" fill="#10b981" />
          <Bar dataKey="Guitar" fill="#f59e0b" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
