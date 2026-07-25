"use client";
import React, { useState } from "react";
import {
  RiLockPasswordLine,
  RiEyeLine,
  RiEyeOffLine,
  RiAdminFill,
} from "react-icons/ri";
import { MdEmail } from "react-icons/md";
import axios from "axios";
import { base_url } from "../components/urls";
import { toast } from "react-toastify";
axios.defaults.withCredentials = true;

const AdminLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handelLogin = async (e) => {
    e.preventDefault();
    try {
      if (!loginData.password || !loginData.email) {
        return;
      }
      const response = await axios.post(`${base_url}/admin/login`, loginData);
      const data = await response.data;
      if (data.success) {
        toast.success(data.message);
        location.href = "/";
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-10 border border-gray-100">
        {/* Simple Branding */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl text-white mb-4 shadow-lg shadow-blue-200">
            <RiAdminFill size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Admin Portal
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Sign in to manage your system
          </p>
        </div>

        <form onSubmit={handelLogin} className="space-y-6">
          {/* Email Input */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-600 ml-1">
              Email Address
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 group-focus-within:text-blue-600 transition-colors">
                <MdEmail size={20} />
              </div>
              <input
                type="email"
                placeholder="admin@example.com"
                value={loginData.email}
                required
                onChange={(e) =>
                  setLoginData((prev) => ({ ...prev, email: e.target.value }))
                }
                className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition-all text-gray-800"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label className="text-xs font-semibold text-gray-600">
                Password
              </label>
              <button
                type="button"
                className="text-xs font-bold text-blue-600 hover:underline"
              >
                Forgot?
              </button>
            </div>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 group-focus-within:text-blue-600 transition-colors">
                <RiLockPasswordLine size={20} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                required
                value={loginData.password}
                onChange={(e) =>
                  setLoginData((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
                className="w-full pl-11 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition-all text-gray-800"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <RiEyeOffLine size={20} />
                ) : (
                  <RiEyeLine size={20} />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 mt-2"
          >
            Sign In
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-gray-400 uppercase tracking-widest font-medium">
          Secure Administrative Access
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
