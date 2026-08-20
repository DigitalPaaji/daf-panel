"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
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
import { base_url } from "../components/urls";
import { toast } from "react-toastify";



const months = [
  "",
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
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
  const [allCategory, setAllCategory] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
const [orderDetails,setOrderDetails]=useState({
   totalOrders: 0,
  paidOrders: 0,
  monthlyOrders: 0,
  monthlyPaidOrders: 0,
  totalSales: 0,
  paidSales: 0,
  latestOrders: [],
})
const getCategory = async () => {
    try {
      const response = await axios.get(`${base_url}/category/get-all`);

      if (response.data.success) {
        const categoryChartData = response?.data?.data.map((category) => ({
  name: category.name,
  products: category.product.length,
}));
        setAllCategory(categoryChartData);
      }
    } catch (error) {
      setAllCategory([]);
      toast.error(
        error.response?.data?.message || "Failed to fetch categories"
      );
    }
  };



const getOrder = async () => {
    try {
      const response = await axios.get(`${base_url}/order/get/details`);

      if (response.data.success) {
   
        setOrderDetails(response.data.data);
      const chartData = response.data.data.monthlyOrdersChart.map((item) => ({
  name: months[item._id.month],
  revenue: item.revenue,
  paidRevenue: item.paidRevenue,
  orders: item.orders,
  paidOrders: item.paidOrders,
}));

setRevenueData(chartData);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch Order"
      );
    }
  };



useEffect(() => {
    getCategory();
    getOrder()
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-slate-100 p-4 md:p-8 transition-colors duration-200">
      
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Overview</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Welcome back to your store dashboard.</p>
      </header>

      {/* Top Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
   <StatCard
  title="Total Revenue"
  value={`₹${orderDetails.totalSales.toLocaleString()}`}
  icon={FaRupeeSign}
  trend="Overall Revenue"
  trendUp
/>

<StatCard
  title="Paid Revenue"
  value={`₹${orderDetails.paidSales.toLocaleString()}`}
  icon={FiDollarSign}
  trend="Paid Revenue"
  trendUp
/>

<StatCard
  title="This Month Orders"
  value={orderDetails.monthlyOrders}
  icon={FiShoppingBag}
  trend={`${orderDetails.totalOrders} Total Orders`}
  trendUp
/>

<StatCard
  title="This Month Paid"
  value={orderDetails.monthlyPaidOrders}
  icon={FiTrendingUp}
  trend={`${orderDetails.paidOrders} Total Paid`}
  trendUp
/>
</div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Chart - Spans 2 columns on large screens */}
        <div className="lg:col-span-2 p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm transition-colors">
          <h2 className="text-lg font-semibold mb-6 text-slate-800 dark:text-white">Revenue Analytics</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
            <LineChart
  data={revenueData}
  margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
>
  <CartesianGrid strokeDasharray="3 3" vertical={false} />

  <XAxis dataKey="name" />

  <YAxis />

  <Tooltip content={<CustomTooltip />} />

  <Legend />

  <Line
    type="monotone"
    dataKey="revenue"
    name="Revenue"
    stroke="#3b82f6"
    strokeWidth={3}
    dot={{ r: 4 }}
    activeDot={{ r: 6 }}
  />

  <Line
    type="monotone"
    dataKey="paidRevenue"
    name="Paid Revenue"
    stroke="#10b981"
    strokeWidth={3}
    dot={{ r: 4 }}
    activeDot={{ r: 6 }}
  />
</LineChart>
            </ResponsiveContainer>
          </div>
        </div>

    
      <div className="p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm transition-colors">
  <h2 className="text-lg font-semibold mb-6 text-slate-800 dark:text-white">
    Products by Category
  </h2>

  <div className="h-[300px] w-full">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={allCategory}
        margin={{ top: 5, right: 0, bottom: 5, left: 0 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          className="stroke-slate-200 dark:stroke-slate-700"
          vertical={false}
        />

        <XAxis
          dataKey="name"
          stroke="currentColor"
          className="text-slate-500 dark:text-slate-400 text-xs"
        />

        <YAxis />

        <Tooltip
          cursor={{ fill: "#f3f4f6" }}
          content={<CustomTooltip />}
        />

        <Bar
          dataKey="products"
          fill="#8b5cf6"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  </div>
</div>

      </div>






      <div className="mt-8 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
  <div className="p-6 border-b border-slate-200 dark:border-slate-700">
    <h2 className="text-lg font-semibold">Latest Orders</h2>
  </div>

  <div className="overflow-x-auto">
    <table className="min-w-full">
      <thead className="bg-slate-100 dark:bg-slate-700">
        <tr>
          <th className="px-4 py-3 text-left">Customer</th>
          <th className="px-4 py-3 text-left">Amount</th>
          <th className="px-4 py-3 text-left">Payment</th>
          <th className="px-4 py-3 text-left">Status</th>
        </tr>
      </thead>

      <tbody>
        {orderDetails.latestOrders.map((order) => (
          <tr
            key={order._id}
            className="border-b border-slate-200 dark:border-slate-700"
          >
            <td className="px-4 py-3">
              {order.user?.name}
            </td>

            <td className="px-4 py-3">
              ₹{order.totalPrice}
            </td>

            <td className="px-4 py-3">
              <span
                className={`px-2 py-1 rounded text-xs ${
                  order.paymentStatus === "Paid"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {order.paymentStatus}
              </span>
            </td>

            <td className="px-4 py-3">
              {order.orderStatus}
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

export default Dashboard;