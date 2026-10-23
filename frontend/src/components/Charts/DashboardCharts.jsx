import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export const WeeklyCaloriesChart = ({ data, theme = 'light' }) => {
    const isLight = theme === 'light';
    const chartData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
            {
                label: 'Active Calories (kcal)',
                data: data || [620, 780, 840, 710, 950, 890, 840],
                borderColor: '#10B981',
                backgroundColor: isLight ? 'rgba(16, 185, 129, 0.08)' : 'rgba(16, 185, 129, 0.12)',
                borderWidth: 2.5,
                pointBackgroundColor: '#10B981',
                pointBorderColor: isLight ? '#FFFFFF' : '#1E293B',
                pointBorderWidth: 2,
                fill: true,
                tension: 0.4,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
        },
        scales: {
            x: { grid: { color: isLight ? '#F1F5F9' : 'rgba(51, 65, 85, 0.5)' }, ticks: { color: isLight ? '#64748B' : '#94A3B8' } },
            y: { grid: { color: isLight ? '#F1F5F9' : 'rgba(51, 65, 85, 0.5)' }, ticks: { color: isLight ? '#64748B' : '#94A3B8' } },
        },
    };

    return <Line data={chartData} options={options} />;
};

export const WeightProgressChart = ({ data, theme = 'light' }) => {
    const isLight = theme === 'light';
    const chartData = {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
        datasets: [
            {
                label: 'Body Weight (kg)',
                data: data || [81.0, 80.4, 79.8, 79.2, 78.9, 78.5],
                borderColor: '#38BDF8',
                backgroundColor: isLight ? 'rgba(56, 189, 248, 0.08)' : 'rgba(56, 189, 248, 0.12)',
                borderWidth: 2.5,
                pointBackgroundColor: '#38BDF8',
                fill: true,
                tension: 0.3,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            x: { grid: { color: isLight ? '#F1F5F9' : 'rgba(51, 65, 85, 0.5)' }, ticks: { color: isLight ? '#64748B' : '#94A3B8' } },
            y: { grid: { color: isLight ? '#F1F5F9' : 'rgba(51, 65, 85, 0.5)' }, ticks: { color: isLight ? '#64748B' : '#94A3B8' } },
        },
    };

    return <Line data={chartData} options={options} />;
};

export const RevenueGrowthChart = ({ data, theme = 'dark' }) => {
    const isLight = theme === 'light';
    const chartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Monthly Revenue ($)',
                data: data || [32000, 35400, 41200, 39800, 44500, 48920],
                backgroundColor: 'rgba(229, 9, 20, 0.35)',
                borderColor: '#FF1E28',
                borderWidth: 2,
                borderRadius: 8,
                hoverBackgroundColor: 'rgba(255, 30, 40, 0.65)',
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            x: { grid: { color: 'rgba(255, 255, 255, 0.06)' }, ticks: { color: '#a1a1aa' } },
            y: { grid: { color: 'rgba(255, 255, 255, 0.06)' }, ticks: { color: '#a1a1aa' } },
        },
    };

    return <Bar data={chartData} options={options} />;
};

export const AttendanceDoughnutChart = ({ percent = 94.5, theme = 'light' }) => {
    const isLight = theme === 'light';
    const chartData = {
        labels: ['Present', 'Absences'],
        datasets: [
            {
                data: [percent, 100 - percent],
                backgroundColor: ['#10B981', isLight ? '#E2E8F0' : '#334155'],
                borderWidth: 0,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '75%',
        plugins: { legend: { display: false } },
    };

    return <Doughnut data={chartData} options={options} />;
};

