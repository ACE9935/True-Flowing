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
import { Line } from 'react-chartjs-2';
import { configurations } from '@/app-configurations';
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

export function YearlyChart({ xAxis, yAxis, qrCode, chartType, setChartType, label, color, secondaryColor, title }: ChartProps) {
  const [endDate, setEndDate] = useState(new Date());

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

  const handlePrevYear = () => {
    const newDate = new Date(endDate);
    newDate.setFullYear(newDate.getFullYear() - 1);
    setEndDate(newDate);
  };

  const handleNextYear = () => {
    const newDate = new Date(endDate);
    newDate.setFullYear(newDate.getFullYear() + 1);
    setEndDate(newDate);
  };

  const labels = xAxis;
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
    <div className='p-6 bg-white border-2 w-full flex flex-col gap-3 rounded-md'>
      <div className='flex justify-between'>
        <h2 className='font-bold text-lg'>{title}</h2>
        <div className='flex gap-3 items-center'>
          <div style={{ background: color, borderColor: secondaryColor }} className='w-[3rem] h-[1rem] border-4'></div>
          <div>{label}/month</div>
          <div className='flex gap-3'>
            <button onClick={handlePrevYear} className='hover:bg-black/20 w-[2rem] aspect-square rounded-full transition-all'>
              <ArrowBack />
            </button>
            <button onClick={handleNextYear} className='hover:bg-black/20 w-[2rem] aspect-square rounded-full transition-all'>
              <ArrowForward />
            </button>
          </div>
        </div>
      </div>
      <div className='pb-2 flex justify-between'>
        <div className='font-bold text-slate-500'>{endDate.getFullYear()}</div>
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
