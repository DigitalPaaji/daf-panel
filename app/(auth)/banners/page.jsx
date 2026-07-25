"use client"
import React, { useEffect, useState } from 'react'
import ImageUploader from './ImageUploader'
import axios from 'axios'
import { base_url, img_url } from '@/app/components/urls'
import { FaTrash, FaToggleOn, FaToggleOff, FaCircle } from 'react-icons/fa'
import { toast } from 'react-toastify'


const BannerPage = () => {
    const [allBanners, setAllbanners] = useState([])

    const fetchAllBanners = async () => {
        try {
            const response = await axios.get(`${base_url}/banners/get-all`);
            if (response.data.success) {
                setAllbanners(response.data.data)
            }
        } catch (error) {
            console.error("Error fetching banners", error)
        }
    }

    const toggleStatus = async (id) => {
        try {
            const response = await axios.put(`${base_url}/banners/toggle/${id}`,);
            if (response.data.success) {
                fetchAllBanners(); 
            }
        } catch (error) {
            console.error("Failed to update status");
        }
    }

    const deleteBanner = async (id) => {
        if (window.confirm("Are you sure you want to delete this banner?")) {
            try {
                const response = await axios.delete(`${base_url}/banners/delete/${id}`);
                if (response.data.success) {
                    setAllbanners(prev => prev.filter(item => item._id !== id));
                }
            } catch (error) {
                console.error("Failed to delete banner");
            }
        }
    }

    useEffect(() => {
        fetchAllBanners()
    }, [])

    return (
        <div className="p-6  dark:bg-black min-h-screen transition-colors duration-300">
            <div className="max- mx-auto">
                
             

                {/* Upload Section */}
                <div className="mb-8 bg-gray-100 dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                    <ImageUploader setAllbanners={setAllbanners} />
                </div>

                {/* Banners List */}
                <div className="grid grid-cols-1 gap-6">
                    {allBanners.length > 0 ? (
                        allBanners.map((item, index) => (
                            <div 
                                key={item._id || index} 
                                className="group relative bg-gray-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all"
                            >
                                {/* Images Grid */}
                                <div className="grid grid-cols-4 items-center">
                                    <div className="col-span-3 border-r border-slate-200 dark:border-slate-700">
                                        <p className="text-[10px] text-gray-400 dark:text-slate-500 pl-2 pt-1 uppercase font-bold">Desktop View</p>
                                        <img 
                                            src={`${img_url}${item.desktop_Image}`} 
                                            alt="Desktop Banner" 
                                            className="w-full h-32 object-cover p-2" 
                                        />
                                    </div>
                                    <div className="col-span-1">
                                        <p className="text-[10px] text-gray-400 dark:text-slate-500 pl-2 pt-1 uppercase font-bold text-center">Mobile</p>
                                        <img 
                                            src={`${img_url}${item.mobile_Image}`} 
                                            alt="Mobile Banner" 
                                            className="w-full h-32 object-contain p-2" 
                                        />
                                    </div>
                                </div>

                                {/* Action Buttons Overlay */}
                                <div className="absolute top-2 right-2 flex gap-2">
                                    <button 
                                        onClick={() => toggleStatus(item._id, item.status)}
                                        className={`flex items-center gap-1 px-3 py-1 rounded-full text-white text-xs font-medium transition-colors ${
                                            item.status ? "bg-green-600 hover:bg-green-700" : "bg-slate-400 dark:bg-slate-600 hover:bg-slate-500"
                                        }`}
                                    >
                                        {item.status ? <FaToggleOn size={18} /> : <FaToggleOff size={18} />}
                                        {item.status ? "Active" : "Inactive"}
                                    </button>

                                    <button 
                                        onClick={() => deleteBanner(item._id)}
                                        className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full hover:bg-red-600 hover:text-white dark:hover:bg-red-600 transition-all shadow-sm"
                                    >
                                        <FaTrash size={14} />
                                    </button>
                                </div>

                                <div className="absolute bottom-2 left-2 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded">
                                    Banner #{index + 1}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-20 text-gray-400 dark:text-slate-500 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
                            No banners found. Upload one to get started.
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default BannerPage