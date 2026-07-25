"use client"
import { base_url } from '@/app/components/urls'
import axios from 'axios'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
// Make sure to install: npm install react-icons
import { FaUser, FaEnvelope, FaCalendarAlt, FaEdit, FaTrash, FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { HiCheckCircle, HiXCircle } from 'react-icons/hi'

const UserCompo = () => {
    const [users, setUsers] = useState([]);
     const searchQueries = useSearchParams()
        const page = searchQueries.get("page") || 1;
    const [loading, setLoading] = useState(false);
    const route = useRouter()  

    const [pagination, setPagination] = useState({
        page: 1,
        totalPages: 1,
        totalUsers: 0
    });

    const fetchUser = async (pageNumber = 1) => {
        setLoading(true);
        try {
            // Passing page number as a query parameter (adjust param name if backend differs)
            const response = await axios.get(`${base_url}/user/getusers?page=${pageNumber}`);
            const data = await response.data;

            if (data.success) {
                setUsers(data.users);
                // Update pagination state from the 'page' object in response
                setPagination(data.page); 
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchUser(page); // Fetch page 1 on mount
    }, []);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            fetchUser(newPage);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: 'numeric', month: 'short', year: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-800 dark:text-gray-100 p-6 transition-colors duration-300">
            <div className="max-w-8xl mx-auto">
                
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg text-blue-600 dark:text-blue-300">
                            <FaUser />
                        </div>
                        User Management
                    </h2>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                        Total Users: <span className="text-blue-600 dark:text-blue-400">{pagination.totalUsers}</span>
                    </div>
                </div>

                {/* Table Container */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                    {loading ? (
                        <div className="h-64 flex items-center justify-center text-gray-500 animate-pulse">
                            Loading data...
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-gray-50 dark:bg-gray-700/50 text-xs uppercase text-gray-500 dark:text-gray-400">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold tracking-wider">User</th>
                                        <th className="px-6 py-4 font-semibold tracking-wider">Status</th>
                                        <th className="px-6 py-4 font-semibold tracking-wider">Joined</th>
                                        <th className="px-6 py-4 font-semibold tracking-wider text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {users.map((user) => (
                                        <tr onClick={()=>route.push(`/customers/${user._id}`)} key={user._id} className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                           
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-gray-900 dark:text-white">{user.name}</div>
                                                        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                                            <FaEnvelope size={12} /> {user.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Status Badge */}
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
                                                    user.status 
                                                    ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800' 
                                                    : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800'
                                                }`}>
                                                    {user.status ? <HiCheckCircle size={14} /> : <HiXCircle size={14} />}
                                                    {user.status ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>

                                            {/* Joined Date */}
                                            <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                                <div className="flex items-center gap-2">
                                                    <FaCalendarAlt className="text-gray-400" />
                                                    {formatDate(user.createdAt)}
                                                </div>
                                            </td>

                                            {/* Actions */}
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30">
                                                        <FaEdit size={16} />
                                                    </button>
                                                    <button className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30">
                                                        <FaTrash size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Pagination Footer */}
                    <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex items-center justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            Page <span className="font-semibold text-gray-900 dark:text-white">{pagination.page}</span> of <span className="font-semibold text-gray-900 dark:text-white">{pagination.totalPages}</span>
                        </span>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handlePageChange(pagination.page - 1)}
                                disabled={pagination.page === 1}
                                className={`p-2 rounded-lg border flex items-center gap-1 text-sm font-medium transition-colors ${
                                    pagination.page === 1
                                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed dark:bg-gray-800 dark:border-gray-700 dark:text-gray-600'
                                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600'
                                }`}
                            >
                                <FaChevronLeft size={12} /> Prev
                            </button>
                            
                            <button
                                onClick={() => handlePageChange(pagination.page + 1)}
                                disabled={pagination.page === pagination.totalPages}
                                className={`p-2 rounded-lg border flex items-center gap-1 text-sm font-medium transition-colors ${
                                    pagination.page === pagination.totalPages
                                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed dark:bg-gray-800 dark:border-gray-700 dark:text-gray-600'
                                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600'
                                }`}
                            >
                                Next <FaChevronRight size={12} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserCompo