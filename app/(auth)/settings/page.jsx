"use client"
import { base_url } from '@/app/components/urls';
import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { FaCloudUploadAlt, FaEnvelope, FaLock, FaTrash, FaUserEdit } from "react-icons/fa";
import { toast } from 'react-toastify';

const ProfilePage = () => {

    const [userData, setUserData] = useState({
        email: "",
        password: "",
        newemail: "",
        newpassword: "",
        logo: null
    });

    // Clean up object URL to prevent memory leaks
    const [previewUrl, setPreviewUrl] = useState(null);

    useEffect(() => {
        if (userData.logo) {
            const url = URL.createObjectURL(userData.logo);
            setPreviewUrl(url);
            return () => URL.revokeObjectURL(url);
        } else {
            setPreviewUrl(null);
        }
    }, [userData.logo]);

    const handleInput = (e) => {
        const { name, value } = e.target;
        setUserData(prev => ({ ...prev, [name]: value }))
    }

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setUserData(prev => ({ ...prev, logo: e.target.files[0] }))
        }
    }

    const removeLogo = (e) => {
        e.preventDefault();
        setUserData(prev => ({ ...prev, logo: null }));
    }


const handelAdd = async(e)=>{
    try {
        if(!userData.email || !userData.password){
            return 
        }
        const formData = new FormData()
        formData.append("email",userData.email)
        formData.append("password",userData.password)
        if(userData.newemail){

            formData.append("newemail",userData.newemail)
        }
        if(userData.newpassword){

            formData.append("newpassword",userData.newpassword)
        }
        if(userData.logo){

            formData.append("logo",userData.logo)
        }
     
        const response = await axios.put(`${base_url}/admin/update`,formData);
        const data = await response.data;
     
        setUserData({



            
       email: "",
        password: "",
        newemail: "",
        newpassword: "",
        logo: null
        })
        toast.success(data.message)
   
} catch (error) {
        toast.error(error.response.data.message)
        
    }
}

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-black transition-colors duration-300">
            
            <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
                
                {/* Header */}
                <div className="bg-blue-600 dark:bg-blue-700 p-6 text-center">
                    <h2 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
                        <FaUserEdit /> Edit Profile
                    </h2>
                    <p className="text-blue-100 text-sm mt-1">Update your credentials and logo</p>
                </div>

                <div className="p-8 space-y-6">
                    
                    {/* Logo Upload Section */}
                    <div className="flex flex-col items-center justify-center">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 self-start">
                            Profile Logo
                        </label>
                        
                        <div className="relative w-full">
                            {previewUrl ? (
                                <div className="relative group w-32 h-32 mx-auto">
                                    <img 
                                        src={previewUrl} 
                                        alt="Logo Preview" 
                                        className="w-full h-full object-cover rounded-full border-4 border-white dark:border-gray-700 shadow-md"
                                    />
                                    <button 
                                        onClick={removeLogo}
                                        className="absolute top-0 right-0 bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600 transition-transform transform hover:scale-110"
                                        title="Remove Image"
                                    >
                                        <FaTrash size={12} />
                                    </button>
                                </div>
                            ) : (
                                <label 
                                    htmlFor="logo" 
                                    className='flex flex-col justify-center items-center w-full h-32 bg-gray-50 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors'
                                >
                                    <div className="flex flex-col justify-center items-center pt-5 pb-6 text-gray-500 dark:text-gray-400">
                                        <FaCloudUploadAlt className="w-8 h-8 mb-2 text-blue-500" />
                                        <p className="text-sm font-medium">Click to upload logo</p>
                                        <p className="text-xs text-gray-400">SVG, PNG, JPG (MAX. 2MB)</p>
                                    </div>
                                    <input 
                                        type="file" 
                                        accept='image/*' 
                                        hidden 
                                        id="logo" 
                                        onChange={handleFileChange} 
                                    />
                                </label>
                            )}
                        </div>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-4">
                        
                        {/* Current Credentials */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <FaEnvelope />
                                </div>
                                <input 
                                    type="text" 
                                    name="email" 
                                    placeholder="Current Email"
                                    value={userData.email} 
                                    onChange={handleInput} 
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block transition-colors placeholder-gray-400 dark:placeholder-gray-500"
                                />
                            </div>

                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <FaLock />
                                </div>
                                <input 
                                    type="text" 
                                    name="password" 
                                    placeholder="Current Password"
                                    value={userData.password} 
                                    onChange={handleInput} 
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block transition-colors placeholder-gray-400 dark:placeholder-gray-500"
                                />
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="relative flex py-2 items-center">
                            <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
                            <span className="flex-shrink-0 mx-4 text-gray-400 text-xs uppercase font-semibold">Change Credentials</span>
                            <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
                        </div>

                        {/* New Credentials */}
                        <div className="space-y-4">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <FaEnvelope />
                                </div>
                                <input 
                                    type="text" 
                                    name="newemail" 
                                    placeholder="New Email Address"
                                    value={userData.newemail} 
                                    onChange={handleInput} 
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 block transition-colors placeholder-gray-400 dark:placeholder-gray-500"
                                />
                            </div>

                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <FaLock />
                                </div>
                                <input 
                                    type="text" 
                                    name="newpassword" 
                                    placeholder="New Password"
                                    value={userData.newpassword} 
                                    onChange={handleInput} 
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 block transition-colors placeholder-gray-400 dark:placeholder-gray-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Submit Button (Optional Placeholder) */}
                    <button onClick={handelAdd} className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg shadow transition-colors duration-200">
                        Save Changes
                    </button>

                </div>
            </div>
        </div>
    )
}

export default ProfilePage