import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const RequestsChart = ({ data }) => {
    // Transform timeseries data for recharts
    const chartData = data.map(item => ({
        time: item.ts,
        requests: item.count
    }));

    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                    dataKey="time"
                    stroke="#9CA3AF"
                    fontSize={12}
                />
                <YAxis
                    stroke="#9CA3AF"
                    fontSize={12}
                />
                <Tooltip
                    contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '8px'
                    }}
                    labelStyle={{ color: '#9CA3AF' }}
                />
                <Line
                    type="monotone"
                    dataKey="requests"
                    stroke="#06B6D4"
                    strokeWidth={2}
                    dot={{ fill: '#06B6D4', r: 4 }}
                    activeDot={{ r: 6 }}
                />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default RequestsChart;
