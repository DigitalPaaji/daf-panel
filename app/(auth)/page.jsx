"use client";
import React from "react";
import { FaRupeeSign } from "react-icons/fa";
import { 
  FiUsers, 
  FiDollarSign, 
  FiShoppingBag, 
  FiTrendingUp
} from "react-icons/fi";
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from "recharts";

// --- Dummy Data ---
const revenueData = [
  { name: "Jan", revenue: 4000, profit: 2400 },
  { name: "Feb", revenue: 3000, profit: 1398 },
  { name: "Mar", revenue: 2000, profit: 9800 },
  { name: "Apr", revenue: 2780, profit: 3908 },
  { name: "May", revenue: 1890, profit: 4800 },
  { name: "Jun", revenue: 2390, profit: 3800 },
  { name: "Jul", revenue: 3490, profit: 4300 },
];

const categoryData = [
  { name: "Clothing", sales: 4000 },
  { name: "Jewelry", sales: 3000 },
  { name: "Accessories", sales: 2000 },
  { name: "Footwear", sales: 2780 },
];

// --- Custom Tailwind Tooltip for Recharts ---
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 rounded-lg shadow-sm">
        <p className="font-semibold text-slate-800 dark:text-slate-200 mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm font-medium" style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const StatCard = ({ title, value, icon: Icon, trend, trendUp }) => (
  <div className="p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center justify-between transition-colors">
    <div>
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{value}</h3>
      <p className={`text-sm mt-2 flex items-center gap-1 ${trendUp ? 'text-green-500' : 'text-red-500'}`}>
        <FiTrendingUp className={trendUp ? '' : 'rotate-180'} />
        {trend}
      </p>
    </div>
    <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-full text-blue-500 dark:text-blue-400">
      <Icon size={24} />
    </div>
  </div>
);

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-slate-100 p-4 md:p-8 transition-colors duration-200">
      
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Overview</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Welcome back to your store dashboard.</p>
      </header>

      {/* Top Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Revenue" value="₹45,231.89" icon={FaRupeeSign} trend="+20.1% from last month" trendUp={true} />
        <StatCard title="Active Users" value="2,350" icon={FiUsers} trend="+15.5% from last month" trendUp={true} />
        <StatCard title="Total Orders" value="1,240" icon={FiShoppingBag} trend="-3.2% from last month" trendUp={false} />
        <StatCard title="Conversion Rate" value="3.24%" icon={FiTrendingUp} trend="+1.2% from last month" trendUp={true} />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Chart - Spans 2 columns on large screens */}
        <div className="lg:col-span-2 p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm transition-colors">
          <h2 className="text-lg font-semibold mb-6 text-slate-800 dark:text-white">Revenue Analytics</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                {/* Replaced hardcoded stroke with Tailwind classes using currentColor */}
                <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" vertical={false} />
                <XAxis dataKey="name" stroke="currentColor" className="text-slate-500 dark:text-slate-400 text-xs" />
                <YAxis stroke="currentColor" className="text-slate-500 dark:text-slate-400 text-xs" />
                
                {/*     */}
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                
                <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Secondary Chart */}
        <div className="p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm transition-colors">
          <h2 className="text-lg font-semibold mb-6 text-slate-800 dark:text-white">Sales by Category</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} margin={{ top: 5, right: 0, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" vertical={false} />
                <XAxis dataKey="name" stroke="currentColor" className="text-slate-500 dark:text-slate-400 text-xs" />
                
                <Tooltip 
                  cursor={{ className: 'fill-slate-100 dark:fill-slate-700/50' }}
                  content={<CustomTooltip />} 
                />
                <Bar dataKey="sales" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;