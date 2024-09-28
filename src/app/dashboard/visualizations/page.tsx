"use client";
import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement, PointElement, ArcElement } from 'chart.js';
import BarChart from '../components/BarChart';
import LineChart from '../components/LineChart';
import PieChart from '../components/PieChart';
import DoughnutChart from '../components/DoughnutChart';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  ArcElement
);

const VisualizationsPage: React.FC = () => {
  // State for counts and loading
  const [universitiesCount, setUniversitiesCount] = useState<number>(0);
  const [studentsCount, setStudentsCount] = useState<number>(0);
  const [industryExpertsCount, setIndustryExpertsCount] = useState<number>(0);
  const [facultiesCount, setFacultiesCount] = useState<number>(0);
  const [companiesCount, setCompaniesCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedChart, setSelectedChart] = useState<string>('bar');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [universitiesRes, studentsRes, industryExpertsRes, facultiesRes, companiesRes] = await Promise.all([
          fetch('https://localhost:7053/api/universities/get-all-universities'),
          fetch('https://localhost:7053/api/get-student/students'),
          fetch('https://localhost:7053/api/get-industry-expert/industry-experts'),
          fetch('https://localhost:7053/api/get-faculty/faculties'),
          fetch('https://localhost:7053/api/companies/get-all-companies'),
        ]);

        const [universitiesData, studentsData, industryExpertsData, facultiesData, companiesData] = await Promise.all([
          universitiesRes.json(),
          studentsRes.json(),
          industryExpertsRes.json(),
          facultiesRes.json(),
          companiesRes.json(),
        ]);

        setUniversitiesCount(universitiesData.length);
        setStudentsCount(studentsData.length);
        setIndustryExpertsCount(industryExpertsData.length);
        setFacultiesCount(facultiesData.length);
        setCompaniesCount(companiesData.length);
      } catch (error) {
        console.error('An error occurred while fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const data = {
    labels: ['Universities', 'Students', 'Industry Experts', 'Faculties', 'Companies'],
    datasets: [
      {
        label: 'Count',
        data: [universitiesCount, studentsCount, industryExpertsCount, facultiesCount, companiesCount],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
        borderColor: '#000',
        borderWidth: 1,
      },
    ],
  };

  const renderChart = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-96">
          
          <span className="text-lg text-gray-500 ml-4">Loading...</span>
        </div>
      );
    }

    switch (selectedChart) {
      case 'bar':
        return <BarChart data={data} />;
      case 'line':
        return <LineChart data={data} />;
      case 'pie':
        return <PieChart data={data} />;
      case 'doughnut':
        return <DoughnutChart data={data} />;
      default:
        return <p>Unknown chart type</p>;
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Data Visualizations</h1>
      <div className="mb-4 flex flex-wrap justify-center gap-4">
        <button
          onClick={() => setSelectedChart('bar')}
          className={`p-3 border rounded shadow-md ${selectedChart === 'bar' ? 'bg-blue-500 text-white' : 'bg-white text-gray-800'} transition-colors`}
        >
          Bar Chart
        </button>
        <button
          onClick={() => setSelectedChart('line')}
          className={`p-3 border rounded shadow-md ${selectedChart === 'line' ? 'bg-blue-500 text-white' : 'bg-white text-gray-800'} transition-colors`}
        >
          Line Chart
        </button>
        <button
          onClick={() => setSelectedChart('pie')}
          className={`p-3 border rounded shadow-md ${selectedChart === 'pie' ? 'bg-blue-500 text-white' : 'bg-white text-gray-800'} transition-colors`}
        >
          Pie Chart
        </button>
        <button
          onClick={() => setSelectedChart('doughnut')}
          className={`p-3 border rounded shadow-md ${selectedChart === 'doughnut' ? 'bg-blue-500 text-white' : 'bg-white text-gray-800'} transition-colors`}
        >
          Doughnut Chart
        </button>
      </div>
      <div className="w-full max-w-4xl h-96">
        {renderChart()}
      </div>
    </div>
  );
};

export default VisualizationsPage;
