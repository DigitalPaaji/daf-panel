"use client"

import React, { useState, useEffect, useRef } from 'react'
import { MdCancel, MdCloudUpload, MdDelete, MdSave, MdLightMode, MdDarkMode, MdDeleteSweep } from 'react-icons/md'
import { FaTag, FaBoxOpen, FaDollarSign, FaImage, FaSearch, FaCheckCircle, FaLayerGroup, FaYandexInternational } from "react-icons/fa";
import axios from 'axios';
import { base_url } from '@/app/components/urls';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { TbListDetails } from 'react-icons/tb';
import { FiTrash2 } from 'react-icons/fi';
import { VscAdd, VscSymbolVariable, VscTrash } from "react-icons/vsc";
import RichEditor from './RichEditor';
import { FcDeleteColumn } from 'react-icons/fc';
const AddProductPage = () => {

  const [tagInput, setTagInput] = useState("")
  const [keywordInput, setKeywordInput] = useState("")
 const route = useRouter()
const [variant, setVariant] = useState({
    sku: '',
    stock: 0,
    mrp: 0,
    basePrice: 0,
    isActive: true,
    images: [ ], 
    attributes:{
      itemtype:"",
      value:""
    }
  });
  const fileInputRef = useRef(null);
  const [attributes, setAttributes] = useState([{ key: '', value: '' }]);
  const [productData, setProductData] = useState({
    name: "",
    slug: "",
    description: "",
    shortDescription: "",
    basePrice: "",
    mrp: "",
    stock: "",
    tags: [],
    images: [],
    thumbnail:null,
    category:"",
    isFeatured: false,
    isNewArrived: false,
    isBestSaller: false,
    isActive: true,
    hasVariants: false,
    seo: {
      metaTitle: "",
      metaDescription: "",
      keywords: []
    }, 
    details:{},
    variants:[ ]
  })
 const [allCategory,setAllCategory]=useState([ ])
 const [newDetails,setNewDetails]=useState({
  key:"",
  val:"",
 })


  const commonInputClass = "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400";
  const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";


  const handleInputChange = (e) => {
    const { name, value, type } = e.target
    const finalValue = type === 'number' ? parseFloat(value) || "" : value;
    setProductData(prev => ({ ...prev, [name]: finalValue }))
  }

  const handleSeoChange = (e) => {
    const { name, value } = e.target
    setProductData(prev => ({
      ...prev,
      seo: { ...prev.seo, [name]: value }
    }))
  }

  const handleAddTag = (e) => {
    e.preventDefault();
    if (!tagInput.trim()) return
    setProductData(prev => ({ ...prev, tags: [...prev.tags, tagInput] }))
    setTagInput("")
  }

  const handelDetalsAdd = (e) => {
    e.preventDefault();
    if (!newDetails.key.trim() || !newDetails.val.trim()) return


    setProductData(prev => ({ ...prev, details: {...prev.details, [newDetails.key]:newDetails.val} }))
 setNewDetails({
    key:"",
  val:""
 })
  }

  const handleRemoveTag = (index) => {
    setProductData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }))
  }

  const handleAddKeyword = (e) => {
    e.preventDefault();
    if (!keywordInput.trim()) return
    setProductData(prev => ({
      ...prev,
      seo: { ...prev.seo, keywords: [...prev.seo.keywords, keywordInput] }
    }))
    setKeywordInput("")
  }

  const handleRemoveKeyword = (index) => {
    setProductData(prev => ({
      ...prev,
      seo: { ...prev.seo, keywords: prev.seo.keywords.filter((_, i) => i !== index) }
    }))
  }

  const handleImageUpload = (e) => {
    e.preventDefault()
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setProductData(prev => ({ ...prev, images: [...prev.images, ...files] }))
  }

  const handleRemoveImage = (index) => {
    setProductData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }
  const handelDetetdetals = (key)=>{
    const newDetal = {...productData.details};
    delete newDetal[key];
    setProductData(prev=>({...prev,details:newDetal}))
  }

 const handleSubmit = async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append("name", productData.name);
  formData.append("slug", productData.slug);
  formData.append("description", productData.description);
  formData.append("shortDescription", productData.shortDescription);
  formData.append("isFeatured", productData.isFeatured);
  formData.append("isNewArrived", productData.isNewArrived);
  formData.append("isBestSaller", productData.isBestSaller);
  formData.append("isActive", productData.isActive);
  formData.append("category", productData.category);
  formData.append("details",JSON.stringify(productData.details));
  formData.append(`tags`,JSON.stringify(productData.tags));
  productData.images.forEach((file,index) => {
    formData.append(`images`, file);
  });
  if(productData.thumbnail){
     formData.append(`thumbnail`, productData.thumbnail);
  }else{
    toast.warn("Thumbnail is required")
    return 
  }


  formData.append("seo", JSON.stringify(productData.seo));
  if(productData.variants.length ==0){
    toast.error("Add at least one variant ")
    return
  }
formData.append("variants", JSON.stringify(productData.variants))
 
try {
    const response = await axios.post(`${base_url}/products/create`,formData)
    const data = await  response.data;
   if(data.success){
    toast.success(data.message)
    route.push("/products")
   }else{
       
       toast.error(data.message)
}
} catch (error) {
 toast.error(error.response.data.message)
}



  
};





  const fetchCategorys = async()=>{
    try {
        const response = await axios.get(`${base_url}/category/get-all`)
        const data = await response.data;
        if(data.success){
            setAllCategory(data.data)
        }
    } catch (error) {
        setAllCategory([ ])
    }
  }
const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setVariant(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  const handleAttributeChange = (index, field, value) => {
    const newAttributes = [...attributes];
    newAttributes[index][field] = value;
    setAttributes(newAttributes);
  };

  const addAttribute = () => setAttributes([...attributes, { key: '', value: '' }]);
  const removeAttribute = (index) => setAttributes(attributes.filter((_, i) => i !== index));

const toggleImage = (index)=>{
if(variant.images.includes(index)){
const newData = variant.images.filter((item)=>item !=index)
  setVariant(prev=>({...prev,images: newData}))


}else{
  setVariant(prev=>({...prev,images: prev.images.length >0 ?  [...prev.images, index]:[index]}))
}

}

useEffect(()=>{
   fetchCategorys() 
},[ ])

const handeladdVariant=()=>{
setProductData((prev)=>({...prev,variants:prev.variants.length > 0 ? [...prev.variants,variant]: [variant]}))
setVariant({
 sku: '',
    stock: 0,
    mrp: 0,
    basePrice: 0,
    isActive: true,
    images: [ ], 
    attributes:{
      itemtype:"",
      value:""
    } 
  })
}

const handelRemoveVarient = (index)=>{
const filterVarinats = productData.variants.filter((_,ind)=>ind !==index)


setProductData((prev)=>({...prev,variants:filterVarinats}))

}

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black transition-colors duration-300 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FaBoxOpen className="text-blue-600 dark:text-blue-400" /> Add New Product
          </h1>
          
          <div className="flex gap-4">
           

            <button 
              onClick={handleSubmit}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-6 py-2.5 rounded-lg shadow-md transition-all font-medium"
            >
              <MdSave className="text-xl" /> Save Product
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

     
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-2">
                Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="md:col-span-2">
                <label className={labelClass}>Product Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={productData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Premium Cotton T-Shirt"
                  className={commonInputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Slug (URL)</label>
                <input
                  type="text"
                  name="slug"
                  value={productData.slug}
                  onChange={handleInputChange}
                  placeholder="e.g. premium-cotton-t-shirt"
                  className={commonInputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Category (ID)</label>
               
                <select name="category" id="" value={productData?.category}    onChange={handleInputChange}  className={`${commonInputClass} bg-gray-100 dark:bg-gray-900  text-gray-500`}>
<option  > --select category-- </option>

 { allCategory.length >0 && allCategory.map((item,index)=><option value={item._id} key={index}>
{item.name}
 </option>)

}


                </select>
              </div>

              <div className="md:col-span-2">
                <label className={labelClass}>Short Description</label>
                <input
                  type="text"
                  name="shortDescription"
                  value={productData.shortDescription}
                  onChange={handleInputChange}
                  placeholder="Brief summary for cards (max 200 chars)"
                  className={commonInputClass}
                />
              </div>

              <div className="md:col-span-2">
                <label className={labelClass}>Full Description</label>
               


                <RichEditor  content={productData.description} setContent={(val)=>setProductData(prev=>({...prev,description:val}))}  />
              </div>
            </div>
          </div>

          
          {/* <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-2 flex items-center gap-2">
              <FaDollarSign className="text-green-600 dark:text-green-400"/> Pricing & Inventory
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className={labelClass}>Base Price</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500 dark:text-gray-400">$</span>
                  <input
                    type="number"
                    name="basePrice"
                    required
                    value={productData.basePrice}
                    onChange={handleInputChange}
                    className={`${commonInputClass} pl-8`}
                  />
                </div>
              </div>
              
              <div>
                <label className={labelClass}>MRP (List Price)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500 dark:text-gray-400">$</span>
                  <input
                    type="number"
                    name="mrp"
                    required
                    value={productData.mrp}
                    onChange={handleInputChange}
                    className={`${commonInputClass} pl-8`}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Stock Quantity</label>
                <input
                  type="number"
                  name="stock"
                  required
                  value={productData.stock}
                  onChange={handleInputChange}
                  className={commonInputClass}
                />
              </div>
            </div>
          </div> */}

          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-2 flex items-center gap-2">
              <FaTag className="text-purple-600 dark:text-purple-400"/> Tags
            </h2>
            
            <div className="flex gap-2 mb-3">
              <input 
                type="text" 
                value={tagInput} 
                onChange={(e) => setTagInput(e.target.value)} 
                onKeyDown={(e) => e.key === 'Enter' && handleAddTag(e)}
                placeholder="Enter a tag..."
                className={`${commonInputClass} focus:ring-purple-500`}
              />
              <button 
                onClick={handleAddTag} 
                type="button"
                className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white px-6 rounded-lg transition-colors"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2 min-h-[40px]">
              {productData.tags.map((item, index) => (
                <span key={index} className="flex items-center gap-1 bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200 px-3 py-1 rounded-full text-sm font-medium border border-transparent dark:border-purple-800">
                  {item}
                  <MdCancel 
                    onClick={() => handleRemoveTag(index)} 
                    className="cursor-pointer hover:text-purple-900 dark:hover:text-purple-100 text-lg" 
                  />
                </span>
              ))}
              {productData.tags.length === 0 && <span className="text-gray-400 dark:text-gray-500 text-sm italic">No tags added yet.</span>}
            </div>
          </div>



<div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-2 flex items-center gap-2">
              <TbListDetails className="text-yellow-600 dark:text-yellow-400"/> Details
            </h2>
             
            <div className="flex gap-2 mb-3">
              <input 
                type="text" 
                value={newDetails.key} 
                onChange={(e) => setNewDetails(prev=>({...prev,key:e.target.value}))} 
             
                placeholder="Enter Key..."
                className={`${commonInputClass} focus:ring-yellow-500`}
              />
              <input 
                type="text" 
                value={newDetails.val} 
           onChange={(e) => setNewDetails(prev=>({...prev,val:e.target.value}))} 
                
                placeholder="Enter Value..."
                className={`${commonInputClass} focus:ring-yellow-500`}
              />
              <button 
                onClick={handelDetalsAdd} 
                type="button"
                className="bg-yellow-600 hover:bg-yellow-700 dark:bg-yellow-500 dark:hover:bg-yellow-600 text-white px-6 rounded-lg transition-colors"
              >
                Add
              </button>
            </div>

           <div className="flex flex-wrap gap-2 min-h-[40px]">
  {productData?.details && Object.entries(productData.details).map(([key, val]) => (
    <div 
      key={key} 
      className="group w-full my-1.5 flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
    >
      
      {/* Left Side: Key & Value Grouped Together */}
      <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3 text-sm overflow-hidden pr-4">
        <span className="font-semibold text-slate-800 dark:text-slate-200 capitalize min-w-[120px]">
          {key}
        </span>
        <span className="hidden sm:inline text-slate-400 dark:text-slate-500">
          —
        </span>
        <span className="text-slate-600 dark:text-slate-400 truncate">
          {val}
        </span>
      </div>

      
      <div className="flex items-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200 shrink-0">
        
      

       
        <button 
          type="button"
          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-md transition-colors"
          title="Delete detail"
          onClick={() => {
  handelDetetdetals(key)
          }}
        >
          <FiTrash2 size={18} />
        </button>

      </div>
    </div>
  ))}
</div>
          </div>






<div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
  <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-2 flex items-center gap-2">
    <FaImage className="text-blue-500 dark:text-blue-400"/> Thumbnail
  </h2>

  <label htmlFor="thumbnail" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors mb-4 group">
    <div className="flex flex-col items-center justify-center pt-5 pb-6">
      <MdCloudUpload className="text-4xl text-gray-400 dark:text-gray-500 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors" />
      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
      <p className="text-xs text-gray-500 dark:text-gray-500">SVG, PNG, JPG or GIF</p>
    </div>
    <input 
      type="file" 
      hidden 
      id="thumbnail" 
      accept="image/*" 
      ref={fileInputRef} /* <-- 1. Attach the ref here */
      onChange={(e) => setProductData(prev => ({...prev, thumbnail: e.target.files[0]}))} 
    />
  </label>

  <div className="">
    {productData.thumbnail && 
      <div className=" w-36 h-36 relative group aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="absolute inset-0 bg-black/50 hidden group-hover:flex justify-center items-center transition-opacity z-10">
          <MdDelete 
            className="text-white text-2xl cursor-pointer hover:text-red-400" 
            onClick={() => {
              // 2. Clear the state
              setProductData(prev => ({...prev, thumbnail: null}));
              // 3. Reset the physical input value so the same file can trigger onChange again
              if (fileInputRef.current) {
                fileInputRef.current.value = ""; 
              }
            }} 
          />
        </div>
        <img 
          src={URL.createObjectURL(productData.thumbnail)} 
          alt="Preview" 
          className="w-36 h-36"
        />
      </div>
    }
  </div>
</div>

























         
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-2 flex items-center gap-2">
              <FaImage className="text-blue-500 dark:text-blue-400"/> Media Gallery
            </h2>

            <label htmlFor="images" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors mb-4 group">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <MdCloudUpload className="text-4xl text-gray-400 dark:text-gray-500 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors" />
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                <p className="text-xs text-gray-500 dark:text-gray-500">SVG, PNG, JPG or GIF</p>
              </div>
              <input 
                type="file" 
                hidden 
                multiple 
                id="images" 
                accept="image/*" 
                onChange={handleImageUpload} 
              />
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
              {productData.images.map((item, index) => (
                <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
                  <div className="absolute inset-0 bg-black/50 hidden group-hover:flex justify-center items-center transition-opacity z-10">
                    <MdDelete 
                      className="text-white text-2xl cursor-pointer hover:text-red-400" 
                      onClick={() => handleRemoveImage(index)} 
                    />
                  </div>
                  <img 
                    src={URL.createObjectURL(item)} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
              <h3 className="font-semibold text-gray-800 dark:text-white mb-4">Product Settings</h3>
              
              <div className="space-y-4">
             
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FaCheckCircle className={productData.isFeatured ? "text-green-500 dark:text-green-400" : "text-gray-400 dark:text-gray-500"} />
                    <span className="text-gray-700 dark:text-gray-300">Featured Product</span>
                  </div>
                  <div 
                    onClick={() => setProductData(prev => ({ ...prev, isFeatured: !prev.isFeatured }))} 
                    className={`w-14 h-7 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${productData.isFeatured ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                  >
                    <div className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${productData.isFeatured ? 'translate-x-7' : 'translate-x-0'}`} />
                  </div>
                </div>


                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FaCheckCircle className={productData.isNewArrived ? "text-yellow-500 dark:text-yellow-400" : "text-gray-400 dark:text-gray-500"} />
                    <span className="text-gray-700 dark:text-gray-300"> New Arrived Product</span>
                  </div>
                  <div 
                    onClick={() => setProductData(prev => ({ ...prev, isNewArrived: !prev.isNewArrived }))} 
                    className={`w-14 h-7 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${productData.isNewArrived ? 'bg-yellow-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                  >
                    <div className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${productData.isNewArrived ? 'translate-x-7' : 'translate-x-0'}`} />
                  </div>
                </div>


                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FaCheckCircle className={productData.isBestSaller ? "text-red-500 dark:text-red-400" : "text-gray-400 dark:text-gray-500"} />
                    <span className="text-gray-700 dark:text-gray-300">Best  Product</span>
                  </div>
                  <div 
                    onClick={() => setProductData(prev => ({ ...prev, isBestSaller: !prev.isBestSaller }))} 
                    className={`w-14 h-7 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${productData.isBestSaller ? 'bg-red-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                  >
                    <div className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${productData.isBestSaller ? 'translate-x-7' : 'translate-x-0'}`} />
                  </div>
                </div>

              
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FaLayerGroup className={productData.hasVariants ? "text-blue-500 dark:text-blue-400" : "text-gray-400 dark:text-gray-500"} />
                    <span className="text-gray-700 dark:text-gray-300">Has Variants</span>
                  </div>
                  <div 
                    onClick={() => setProductData(prev => ({ ...prev, hasVariants: !prev.hasVariants }))} 
                    className={`w-14 h-7 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${productData.hasVariants ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}`}
                  >
                    <div className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${productData.hasVariants ? 'translate-x-7' : 'translate-x-0'}`} />
                  </div>
                </div>
              </div>
            </div>

           
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-2 flex items-center gap-2">
                <FaSearch className="text-orange-500 dark:text-orange-400"/> SEO Configuration
              </h2>
              
              <div className="space-y-3">
                <input
                  type="text"
                  name="metaTitle"
                  value={productData.seo.metaTitle}
                  onChange={handleSeoChange}
                  placeholder="Meta Title"
                  className={`${commonInputClass} focus:ring-orange-500`}
                />
                
                <textarea
                  name="metaDescription"
                  rows={2}
                  value={productData.seo.metaDescription}
                  onChange={handleSeoChange}
                  placeholder="Meta Description"
                  className={`${commonInputClass} focus:ring-orange-500 resize-none`}
                />

                {/* SEO Keywords */}
                <div className="relative">
                    <input 
                        type="text"
                        value={keywordInput}
                        onChange={(e)=>setKeywordInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddKeyword(e)}
                        placeholder="Add SEO Keyword (Press Enter)"
                        className={`${commonInputClass} focus:ring-orange-500`}
                    />
                     <div className="flex flex-wrap gap-2 mt-2">
                        {productData.seo.keywords.map((k, i)=>(
                            <span key={i} className="bg-orange-100 dark:bg-orange-900/50 text-orange-800 dark:text-orange-200 text-xs px-2 py-1 rounded border border-orange-200 dark:border-orange-800 flex items-center gap-1">
                                {k} <MdCancel onClick={()=>handleRemoveKeyword(i)} className="cursor-pointer hover:text-orange-900 dark:hover:text-orange-100"/>
                            </span>
                        ))}
                     </div>
                </div>
              </div>
            </div>
            
          </div>
<div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
      <div className="flex justify-between items-center mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center gap-2">
          <VscSymbolVariable className="text-blue-500 dark:text-blue-400" /> 
          Product Details
        </h2>
        {/* IsActive Toggle */}
        <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 dark:text-gray-300">
          <input 
            type="checkbox" 
            name="isActive" 
            checked={variant.isActive} 
            onChange={handleChange}
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          />
          Variant is Active
        </label>
      </div>

      {/* Basic Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block text-xs text-gray-500 mb-1">SKU</label>
          <input type="text" name="sku" value={variant.sku} onChange={handleChange} placeholder="e.g. TSHIRT-RED-XL" className={`${commonInputClass} focus:ring-2 focus:ring-blue-500 outline-none`} />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Stock</label>
          <input type="number" name="stock" value={variant.stock} onChange={handleChange} min="0" placeholder="0" className={`${commonInputClass} focus:ring-2 focus:ring-blue-500 outline-none`} />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">MRP</label>
          <input type="number" name="mrp" value={variant.mrp} onChange={handleChange} min="0" placeholder="MRP" className={`${commonInputClass} focus:ring-2 focus:ring-blue-500 outline-none`} />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Compair Price</label>
          {/* Note: Changed to type="number" to match your schema */}
          <input type="number" name="basePrice" value={variant.basePrice} onChange={handleChange} placeholder="+/- Amount" className={`${commonInputClass} focus:ring-2 focus:ring-blue-500 outline-none`} />
        </div>
      </div>

      {/* Dynamic Attributes (The Mongoose Map) */}
      <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700">
        <div className="flex justify-between items-center mb-3">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Dynamic Attributes</label>
          {/* <p onClick={addAttribute} className="text-xs flex items-center gap-1 text-blue-600 hover:text-blue-700 dark:text-blue-400">
            <VscAdd /> Add Attribute
          </p> */}
        </div>

 <div  className="flex gap-2 mb-2">
<select name="" value={variant.attributes.itemtype}  id="" className={`${commonInputClass} w-1/3 text-sm`}  onChange={(e)=>setVariant(prev=>({...prev,attributes:{...prev.attributes,itemtype:e.target.value}}))} >

  <option value="size">Size</option>
  <option value="weight">Weight</option>
  <option value="color">Color</option>

</select>

  <input 
              type={`${variant.attributes.itemtype=="color" ? "color":"text"}`} 
              placeholder="Value (e.g. XL, Red)" 
           value={variant.attributes.value} 
onChange={(e)=>setVariant(prev=>({...prev,attributes:{...prev.attributes,value:e.target.value}}))}
              className={`${commonInputClass} w-2/3 text-sm h-10`} 
            />
</div>
        

      </div>

      {/* Images Array */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          

  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
              {productData.images.map((item, index) => (
                <div onClick={()=>toggleImage(index)}  key={index} className="relative cursor-pointer group aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
             {   variant.images.includes(index) &&   <FaCheckCircle  className='absolute top-2 right-3 text-green-600 text-2xl' /> }
                  <img 
                    src={URL.createObjectURL(item)} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>

        </div>
      
      </div>

      <div onClick={handeladdVariant}  className="w-full py-2 text-center px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
        Save Variant
      </div>

    </div>

{productData.variants.length > 0 && (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors space-y-6">
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-4">
      Product Variants
    </h3>

    <div className="space-y-6">
      {productData.variants.map((item, index) => (
        <div 
          key={index} 
          className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-5 border border-gray-200 dark:border-gray-700 flex flex-col gap-5"
        >
          {/* Header: SKU & Status Badge */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">SKU:</span>
              <span className="text-base font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
                {item?.sku || "N/A"}
              </span>
            </div>
            

            <div className='flex gap-4 items-center'>
<span className={`px-3 py-1 text-xs font-medium rounded-full ${
              item?.isActive 
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
                : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
            }`}>
              {item?.isActive ? "Active" : "Hidden"}
            </span>

              <MdDeleteSweep className='text-2xl cursor-pointer text-red-400'  onClick={()=>handelRemoveVarient(index)} />
            </div>
          </div>

          {/* Details Grid: Stock, Pricing, Attributes */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white dark:bg-gray-900 p-4 rounded-md border border-gray-100 dark:border-gray-700/50">
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">Stock</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{item?.stock} units</span>
            </div>
            
             <div className="flex flex-col">
              <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">MRP</span>
              <span className="text-sm font-bold text-gray-900 dark:text-white">
                {item?.mrp}
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">Base Price</span>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400 line-through">
                {item?.basePrice}
              </span>
            </div>
            
           
            
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 dark:text-gray-400 mb-1 capitalize">
                {item?.attributes?.itemtype || "Attribute"}
              </span>
              <div className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white">
                {item?.attributes?.itemtype === "color" ? (
                  <>
                    <input 
                      type="color" 
                      value={item?.attributes?.value} 
                      readOnly
                      className="w-5 h-5 rounded cursor-default border-0 p-0 bg-transparent" 
                    />
                    <span className="uppercase text-xs">{item?.attributes?.value}</span>
                  </>
                ) : (
                  <span>{item?.attributes?.value}</span>
                )}
              </div>
            </div>
          </div>

          {/* Image Gallery */}
          {productData.images.filter((_, idx) => item.images.includes(idx)).length > 0 && (
            <div className="pt-2">
              <span className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-3">
                Assigned Images
              </span>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {productData.images
                  .filter((_, idx) => item.images.includes(idx))
                  .map((imgItem, imgIndex) => (
                    <div 
                      key={imgIndex} 
                      className="relative cursor-pointer group aspect-square rounded-md overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm hover:ring-2 hover:ring-blue-500 transition-all"
                    >
                      <img 
                        src={URL.createObjectURL(imgItem)} 
                        alt={`Variant ${item?.sku}`} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
)}

        </form>
      </div>
    </div>
  )
}

export default AddProductPage