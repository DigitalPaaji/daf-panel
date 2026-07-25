"use client"
import { base_url } from "@/app/components/urls";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { FaDesktop, FaMobileAlt, FaCloudUploadAlt, FaSpinner,FaCheckCircle  } from "react-icons/fa";
import { IoMdCloseCircle } from "react-icons/io";
import { toast } from "react-toastify";

const ImageUploader = ({setAllbanners}) => {
  const [newImages, setNewImages] = useState({
    desktop: null,
    mobile: null,
  });
  const [isLoading, setIsLoading] = useState(false);

  // Helper to handle file updates
  const handleFileUpdate = (type, file) => {
    if (file && file.type.startsWith("image/")) {
      setNewImages((prev) => ({ ...prev, [type]: file }));
    } else {
      alert("Please upload a valid image file.");
    }
  };

  // Helper to remove files
  const removeFile = (type) => {
    setNewImages((prev) => ({ ...prev, [type]: null }));
  };

  // Submit Handler
  const handleSubmit = async () => {
    if (!newImages.desktop && !newImages.mobile) {
      alert("Please select at least one image to upload.");
      return;
    }

    setIsLoading(true);

    // --- Backend Simulation Logic ---
    try {
      // 1. Create FormData
      const formData = new FormData();
      if (newImages.desktop) formData.append("desktop_Image", newImages.desktop);
      if (newImages.mobile) formData.append("mobile_Image", newImages.mobile);

      // 2. Simulate API Call (Replace this with your actual fetch/axios call)

    const response = await axios.post(`${base_url}/banners/create`,formData);
    const data = await response.data
    if(data.success){
        toast.success(data.message)
        setAllbanners(prev=>([...prev,data.data]))
setNewImages({
      desktop: null,
    mobile: null,
})
    }
    else{
        toast.error(data.message)
    }
} catch (error) {
    console.log(error)
            toast.error(error.message)

}finally {
      setIsLoading(false);
    }
  };

  return (
    <div className=" w-full  p-6 flex flex-col items-center justify-center transition-colors duration-300">
      
      <div className="w-full  mx-auto">
     

        <div className="flex flex-col lg:flex-row justify-center gap-6 mb-8">
          {/* Desktop Section - 2/3 Width */}
          <div className="w-full lg:w-2/3">
            <h3 className="mb-3 font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <FaDesktop /> Desktop View
            </h3>
            <UploadCard
              id="desktop"
              imageFile={newImages.desktop}
              onFileSelect={(file) => handleFileUpdate("desktop", file)}
              onRemove={() => removeFile("desktop")}
              icon={<FaDesktop className="text-5xl text-gray-400 dark:text-slate-500 mb-2" />}
              label="Desktop Image"
              aspectClass="h-[30rem]"
            />
          </div>

          {/* Mobile Section - 1/3 Width */}
          <div className="w-full lg:w-1/3">
            <h3 className="mb-3 font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <FaMobileAlt /> Mobile View
            </h3>
            <UploadCard
              id="mobile"
              imageFile={newImages.mobile}
              onFileSelect={(file) => handleFileUpdate("mobile", file)}
              onRemove={() => removeFile("mobile")}
              icon={<FaMobileAlt className="text-5xl text-gray-400 dark:text-slate-500 mb-2" />}
              label="Mobile Image"
              aspectClass="h-[30rem]"
            />
          </div>
        </div>

        {/* Submit Section */}
        <div className="flex justify-end pt-6 border-t border-gray-300 dark:border-slate-800">
          <button
            onClick={handleSubmit}
            disabled={isLoading || (!newImages.desktop && !newImages.mobile)}
            className={`
              flex items-center gap-2 px-8 py-3 rounded-lg font-semibold text-white shadow-lg transition-all
              ${isLoading 
                ? "bg-blue-400 cursor-not-allowed" 
                : "bg-blue-600 hover:bg-blue-700 active:scale-95 dark:bg-blue-700 dark:hover:bg-blue-600"
              }
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            {isLoading ? (
              <>
                <FaSpinner className="animate-spin text-xl" /> Uploading...
              </>
            ) : (
              <>
                <FaCheckCircle   className="text-xl" /> Save & Publish
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Reusable Child Component (Now with Dark Mode) ---
const UploadCard = ({ id, imageFile, onFileSelect, onRemove, icon, label, aspectClass }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (!imageFile) {
      setPreviewUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(imageFile);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [imageFile]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) onFileSelect(file);
  };

  return (
    <div
      className={`
        relative w-full ${aspectClass} rounded-xl transition-all duration-300 ease-in-out border-2 overflow-hidden
        ${isDragging
          ? "border-blue-500 bg-blue-200 dark:bg-blue-900/20 scale-[1.01]" // Dragging state (Light/Dark)
          : "border-dashed border-gray-800 dark:border-slate-700 bg-blue-100 dark:bg-slate-800 " // Normal state (Light/Dark)
        }
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {previewUrl ? (
        <div className="relative w-full h-full group">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-full object-cover"
          />
          {/* Overlay gradient for better button visibility in dark mode */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 dark:group-hover:bg-black/40 transition-colors duration-200">
            <button
              onClick={onRemove}
              className="absolute top-4 right-4 bg-white dark:bg-slate-800 text-red-500 rounded-full p-2 shadow-xl hover:scale-110 transition-transform cursor-pointer border border-gray-600 dark:border-slate-600"
              title="Remove image"
            >
              <IoMdCloseCircle size={24} />
            </button>
          </div>
        </div>
      ) : (
        <label
          htmlFor={id}
          className="flex flex-col items-center justify-center h-full w-full cursor-pointer p-6"
        >
          <div className="flex flex-col items-center text-center animate-in fade-in zoom-in duration-300">
            {icon}
            <p className="text-lg font-medium text-gray-600 dark:text-gray-300">
              {label}
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
              {isDragging ? (
                <span className="text-blue-500 font-bold">Drop file now</span>
              ) : (
                <span className="flex items-center gap-2">
                  <FaCloudUploadAlt /> Click or Drag to Upload
                </span>
              )}
            </p>
          </div>
          <input
            type="file"
            id={id}
            accept="image/*"
            hidden
            onChange={(e) => {
              if (e.target.files?.[0]) onFileSelect(e.target.files[0]);
            }}
          />
        </label>
      )}
    </div>
  );
};

export default ImageUploader;