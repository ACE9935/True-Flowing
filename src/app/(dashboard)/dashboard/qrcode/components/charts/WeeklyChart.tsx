import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  ChartData,
} from 'chart.js';
import { Line } from 'react-chartjs-2'
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { ChartProps } from '../QrcodeStatsContainer';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

const getYesterdayDate = () => {
  const today = new Date();
  today.setDate(today.getDate() - 1);
  return today;
};

// Helper function to calculate the date one week ago
const getLastWeekDate = (date: Date) => {
  const newDate = new Date(date);
  newDate.setDate(date.getDate() - 7);
  return newDate;
};

// Helper function to calculate the date one week forward
const getNextWeekDate = (date: Date) => {
  const newDate = new Date(date);
  newDate.setDate(date.getDate() + 7);
  return newDate;
};

export function WeeklyChart({ xAxis, yAxis, qrCode, chartType, setChartType, label, secondaryColor, color, title }: ChartProps) {
  
  const [endDate, setEndDate] = useState(new Date());

  const handlePreviousWeek = () => {
    setEndDate(getLastWeekDate(endDate));
  };

  const handleNextWeek = () => {
    setEndDate(getNextWeekDate(endDate));
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true, // Ensure the Y-axis starts at zero
      },
    },
    plugins: {
      legend: {
        display: false, // Hide the legend
      },
    },
  };

  const labels = xAxis(endDate);
  const data = {
    labels,
    datasets: [
      {
        fill: true,
        data: yAxis(qrCode, endDate),
        borderColor: secondaryColor,
        backgroundColor: color,
      },
    ],
  };

  return (
    <div className='p-6 bg-white border-2 w-full flex flex-col gap-4 rounded-md'>
      <div className='flex justify-between'>
        <h2 className='font-bold text-lg'>{title}</h2>
        <div className='flex gap-3 items-center'>
          <div style={{ background: color, borderColor: secondaryColor }} className='w-[3rem] h-[1rem] border-4 border-blue-700'></div>
          <div>{label}/day</div>
          <div className='flex gap-3'>
            <button onClick={handlePreviousWeek} className='hover:bg-black/20 w-[2rem] aspect-square rounded-full transition-all'>
              <ArrowBack />
            </button>
            <button onClick={handleNextWeek} className='hover:bg-black/20 w-[2rem] aspect-square rounded-full transition-all'>
              <ArrowForward />
            </button>
          </div>
        </div>
      </div>
      <div className='flex justify-end'>
        <select className='border-2 border-primary-blue p-1 rounded-md cursor-pointer' value={chartType} onChange={(e) => setChartType(e.target.value as "weekly" | "monthly" | "yearly")}>
          <option value="weekly">Week</option>
          <option value="monthly">Month</option>
          <option value="yearly">Year</option>
        </select>
      </div>
      <Line options={options} data={data} />
    </div>
  );
}
