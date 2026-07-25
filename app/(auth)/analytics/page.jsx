"use client";
import React from "react";
import { 
  FiEye, 
  FiMousePointer, 
  FiClock, 
  FiActivity,
  FiArrowUpRight,
  FiArrowDownRight
} from "react-icons/fi";
import { 
  AreaChart, 
  Area, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from "recharts";

// --- Dummy Data ---
const trafficData = [
  { name: "Mon", organic: 4000, paid: 2400 },
  { name: "Tue", organic: 3000, paid: 1398 },
  { name: "Wed", organic: 2000, paid: 9800 },
  { name: "Thu", organic: 2780, paid: 3908 },
  { name: "Fri", organic: 1890, paid: 4800 },
  { name: "Sat", organic: 2390, paid: 3800 },
  { name: "Sun", organic: 3490, paid: 4300 },
];

const deviceData = [
  { name: "Mobile", value: 65 },
  { name: "Desktop", value: 25 },
  { name: "Tablet", value: 10 },
];

const COLORS = ["#3b82f6", "#8b5cf6", "#10b981"];

const topProducts = [
  { id: "PRD-001", name: "Bridal Lehenga Set", views: 1245, sales: 142, conversion: "11.4%" },
  { id: "PRD-002", name: "Silk Saree", views: 982, sales: 85, conversion: "8.6%" },
  { id: "PRD-003", name: "Embroidered Kurta", views: 840, sales: 110, conversion: "13.1%" },
  { id: "PRD-004", name: "Statement Necklace", views: 650, sales: 45, conversion: "6.9%" },
];

// --- Custom Tailwind Tooltip for Recharts ---
const CustomTooltip = ({ active, payload, label, suffix = "" }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 rounded-lg shadow-sm">
        {label && <p className="font-semibold text-slate-800 dark:text-slate-200 mb-2">{label}</p>}
        {payload.map((entry, index) => (
          <p key={index} className="text-sm font-medium" style={{ color: entry.color }}>
            {entry.name}: {entry.value}{suffix}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// --- Sub-components ---
const MetricCard = ({ title, value, icon: Icon, change, isPositive }) => (
  <div className="p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between transition-colors">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
        <Icon size={20} />
      </div>
      <span className={`flex items-center text-sm font-medium ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
        {isPositive ? <FiArrowUpRight className="mr-1" /> : <FiArrowDownRight className="mr-1" />}
        {change}
      </span>
    </div>
    <div>
      <h3 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-1">{value}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
    </div>
  </div>
);

const AnalyticsPage = () => {
  return (
    <div className="min-h-screen bg-gray-200 dark:bg-black text-slate-900 dark:text-slate-100 p-4 md:p-8 transition-colors duration-200">
      

      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Traffic & Analytics</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Detailed breakdown of your store's performance.</p>
      </header>


      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard title="Total Page Views" value="45.2K" icon={FiEye} change="12.5%" isPositive={true} />
        <MetricCard title="Bounce Rate" value="42.3%" icon={FiActivity} change="2.1%" isPositive={false} />
        <MetricCard title="Avg. Session Duration" value="3m 12s" icon={FiClock} change="4.5%" isPositive={true} />
        <MetricCard title="Click-Through Rate" value="6.8%" icon={FiMousePointer} change="1.2%" isPositive={true} />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Area Chart: Traffic Sources */}
        <div className="lg:col-span-2 p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm transition-colors">
          <h2 className="text-lg font-semibold mb-6 text-slate-800 dark:text-white">Traffic Sources (Last 7 Days)</h2>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trafficData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorOrganic" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPaid" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                {/* Replaced hardcoded stroke with Tailwind classes */}
                <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" vertical={false} />
                <XAxis dataKey="name" stroke="currentColor" className="text-slate-500 dark:text-slate-400 text-xs" axisLine={false} tickLine={false} />
                <YAxis stroke="currentColor" className="text-slate-500 dark:text-slate-400 text-xs" axisLine={false} tickLine={false} />
                
                {/* Using Custom Tooltip */}
                <Tooltip content={<CustomTooltip />} />
                
                <Legend wrapperStyle={{ paddingTop: '10px' }} />
                <Area type="monotone" dataKey="organic" stroke="#3b82f6" fillOpacity={1} fill="url(#colorOrganic)" name="Organic Search" />
                <Area type="monotone" dataKey="paid" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorPaid)" name="Paid Traffic" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart: Device Usage */}
        <div className="p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm transition-colors flex flex-col">
          <h2 className="text-lg font-semibold mb-2 text-slate-800 dark:text-white">Device Breakdown</h2>
          <div className="flex-grow h-[320px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={deviceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {deviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                {/* Custom Tooltip with % suffix passed down */}
                <Tooltip content={<CustomTooltip suffix="%" />} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden transition-colors">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Top Performing Products</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400">
              <tr>
                <th className="px-6 py-4 font-medium">Product ID</th>
                <th className="px-6 py-4 font-medium">Product Name</th>
                <th className="px-6 py-4 font-medium">Total Views</th>
                <th className="px-6 py-4 font-medium">Total Sales</th>
                <th className="px-6 py-4 font-medium">Conversion Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {topProducts.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-700 dark:text-slate-300">{product.id}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{product.name}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{product.views.toLocaleString()}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{product.sales}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                      {product.conversion}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default AnalyticsPage;