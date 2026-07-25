"use client"
import { base_url, img_url } from '@/app/components/urls';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { FaCloudUploadAlt, FaTrash, FaPlus, FaMoon, FaSun, FaLayerGroup } from "react-icons/fa";
import { MdCancel } from 'react-icons/md';
import { toast } from 'react-toastify';


const CategoryPage = () => {

    const [newCategoryData, setNewCategoryData] = useState({
        image: null,
        name: ""
    })
    const [allCategory, setAllCategory] = useState([])




    const handelSubmit = async (e) => {
        e.preventDefault()
        try {
            if (!newCategoryData.name || !newCategoryData.image) {
                toast.error("Please provide both name and image")
                return
            }

            const newData = new FormData();
            newData.append("image", newCategoryData.image)
            newData.append("name", newCategoryData.name)

            const response = await axios.post(`${base_url}/category/create`, newData)
            if (response.data.success) {
                toast.success(response.data.message)
                setAllCategory(prev => ([...prev, response.data.data]))
                setNewCategoryData({ image: null, name: "" })
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong")
        }
    }

    const getcategory = async () => {
        try {
            const response = await axios.get(`${base_url}/category/get-all`);
            if (response.data.success) {
                setAllCategory(response.data.data)
            }
        } catch (error) {
            setAllCategory([])
        }
    }

    const deleteCategory = async (id) => {
        if (window.confirm("Delete this category? Products inside might be affected.")) {
            try {
                const response = await axios.delete(`${base_url}/category/delete/${id}`);
                if (response.data.success) {
                    setAllCategory(prev => prev.filter(item => item._id !== id));
                    toast.success("Category deleted");
                }
            } catch (error) {
                toast.error("Failed to delete category");
            }
        }
    }

    useEffect(() => { getcategory() }, [])



    return (
        <div className="p-6 bg-white dark:bg-black min-h-screen transition-colors duration-300">
            <div className=" mx-auto">
                
           

                {/* Form Section */}
                <form onSubmit={handelSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 bg-gray-100 dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    
                    {/* Image Upload Area */}
                    <div className="col-span-1">
                        {newCategoryData.image ? (
                            <div className="relative group h-44 w-full rounded-xl overflow-hidden border-2 border-slate-100 dark:border-slate-700">
                                <img src={URL.createObjectURL(newCategoryData.image)} alt="Preview" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                                    <MdCancel 
                                        onClick={() => setNewCategoryData(prev => ({ ...prev, image: null }))} 
                                        className="text-4xl text-white hover:text-red-500 transition-colors" 
                                    />
                                </div>
                            </div>
                        ) : (
                            <label htmlFor="image" className="flex flex-col items-center justify-center h-44 w-full border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer group">
                                <FaCloudUploadAlt className="text-4xl text-slate-400 group-hover:text-rose-900 mb-2" />
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Upload Image</p>
                                <span className="text-[10px] text-red-500 mt-1">* Required</span>
                                <input type="file" id="image" accept="image/*" hidden onChange={(e) => setNewCategoryData(prev => ({ ...prev, image: e.target.files[0] }))} />
                            </label>
                        )}
                    </div>

                    {/* Inputs Area */}
                    <div className="col-span-1 md:col-span-2 flex flex-col justify-center gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Category Name <span className="text-red-500">*</span></label>
                            <input 
                                type="text" 
                                required 
                                placeholder="Enter category name..."
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-rose-900 outline-none dark:text-white transition-all"
                                value={newCategoryData.name} 
                                onChange={(e) => setNewCategoryData(prev => ({ ...prev, name: e.target.value }))} 
                            />
                        </div>
                        <button type="submit" className="w-full md:w-max px-8 py-3 bg-rose-900 hover:bg-rose-800 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-rose-900/20 active:scale-95">
                            <FaPlus size={14} /> Add Category
                        </button>
                    </div>
                </form>

                {/* Categories List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {allCategory.length > 0 ? allCategory.map((item, index) => (
                        <div key={item._id || index} className="flex items-center gap-4 p-3 bg-gray-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
                            <img 
                                src={`${img_url}${item.image}`} 
                                alt={item.name} 
                                className="h-16 w-16 rounded-full object-cover border-2 border-slate-100 dark:border-slate-700 shadow-inner" 
                            />
                            <div className="flex-1">
                                <p className="font-bold text-slate-800 dark:text-white text-sm line-clamp-1">{item.name}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[10px] px-2 py-0.5 bg-rose-50 dark:bg-rose-900/20 text-rose-900 dark:text-rose-400 rounded-full font-bold">
                                        {item.product?.length || 0} Products
                                    </span>
                                </div>
                            </div>
                            <button 
                                onClick={() => deleteCategory(item._id)}
                                className="p-2.5 cursor-pointer text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                            >
                                <FaTrash size={16} />
                            </button>
                        </div>
                    )) : (
                        <div className="col-span-full py-20 text-center text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl">
                            No categories available yet.
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default CategoryPage;