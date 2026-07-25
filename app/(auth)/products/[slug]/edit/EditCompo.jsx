"use client";
import { base_url, img_url } from "@/app/components/urls";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  FaCheckCircle,
  FaCloudUploadAlt,
  FaLayerGroup,
  FaSave,
  FaPlus,
  FaImage
} from "react-icons/fa";
import { MdOutlineCancel, MdDelete } from "react-icons/md";
import { toast } from "react-toastify";
import RichEditor from "../../create/RichEditor";
import ReviewSection from "@/app/components/ReviewSection";

const EditCompo = ({ slug }) => {
  const [product, setProduct] = useState({
    basePrice: 0,
    description: "",
    isActive: false,
    isFeatured: false,
     isNewArrived: false,
    isBestSaller: false,
    mrp: 0,
    name: "",
    shortDescription: "",
    stock: 0,
    deleteImg: [],
    tags: [],
    images: [],
    seo: { keywords: [], metaDescription: "", metaTitle: "" },
    newimages: [],
    category: "",
    details: {},
    variants: [] // Added variants array
  });
  const route = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [newMetaTag, setNewMetaTag] = useState("");
  const [allCategory, setAllCategory] = useState([]);
  const [newDetails, setNewDetails] = useState({
    key: "",
    value: "",
  });

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${base_url}/products/single/${slug}?cat=true`);
      setProduct({ 
        ...response.data.product, 
        newimages: [],
        variants: response.data.product.variants || [] 
      });
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  const getcategory = async () => {
    try {
      const response = await axios.get(`${base_url}/category/get-all`);
      if (response.data.success) {
        setAllCategory(response.data.data);
      }
    } catch (error) {
      setAllCategory([]);
    }
  };

  useEffect(() => {
    if (slug) {
      fetchProduct();
      getcategory();
    }
  }, [slug]);


  const handleInput = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handelRemoveImg = (index) => {
    setProduct((prev) => {
      const deleteImg = prev.images[index];
      const images = prev.images.filter((_, ind) => ind !== index);

     
      const updatedVariants = prev.variants.map(variant => ({
        ...variant,
        images: variant.images
          .map(imgStr => parseInt(imgStr))
          .filter(imgIdx => imgIdx !== index)
          .map(imgIdx => imgIdx > index ? (imgIdx - 1).toString() : imgIdx.toString())
      }));

      return {
        ...prev,
        images,
        variants: updatedVariants,
        deleteImg: prev.deleteImg ? [...prev.deleteImg, deleteImg] : [deleteImg],
      };
    });
  };

  const handelRemovenewImg = (index) => {
     const updatedVariants = product.variants.map(variant => ({
        ...variant,
        images: variant.images
          .map(imgStr => parseInt(imgStr))
          .filter(imgIdx => imgIdx !== product.images.length+index)
          .map(imgIdx => imgIdx > product.images.length+index ? (imgIdx - 1).toString() : imgIdx.toString())
      }));


    setProduct((prev) => ({
      ...prev,
      newimages: prev.newimages.filter((_, ind) => ind !== index),
      variants:updatedVariants
    }));
  };

  const handleSeoInput = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, seo: { ...prev.seo, [name]: value } }));
  };

  const handleTagKeyDown = (e, type) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (type === "general" && newTag.trim()) {
        setProduct((prev) => ({
          ...prev,
          tags: [...prev.tags, newTag.trim()],
        }));
        setNewTag("");
      } else if (type === "seo" && newMetaTag.trim()) {
        setProduct((prev) => ({
          ...prev,
          seo: {
            ...prev.seo,
            keywords: [...prev.seo.keywords, newMetaTag.trim()],
          },
        }));
        setNewMetaTag("");
      }
    }
  };


  const handelAddDetails = () => {
    const { key, value } = newDetails;
    if (!key || !value) {
      toast.error("key and value both need");
      return;
    }
    setProduct(prev => ({ ...prev, details: { ...prev.details, [key]: value } }));
    setNewDetails({ key: "", value: "" });
  };

  const handelRemoveDetails = (keyToRemove) => {
    const updatedDetails = { ...product.details };
    delete updatedDetails[keyToRemove];
    setProduct(prev => ({ ...prev, details: updatedDetails }));
  };

 
  const handleAddVariant = () => {
    setProduct(prev => ({
      ...prev,
      variants: [
        ...prev.variants,
        {
          sku: "",
          stock: 0,
          mrp: 0,
          basePrice: 0,
          isActive: true,
          images: [],
          attributes: { itemtype: "weight", value: "" }
        }
      ]
    }));
  };

  const handleRemoveVariant = (index) => {
    setProduct(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }));
  };

  const handleVariantChange = (index, field, value) => {
    setProduct(prev => {
      const newVariants = [...prev.variants];
      newVariants[index] = { ...newVariants[index], [field]: value };
      return { ...prev, variants: newVariants };
    });
  };

  const handleVariantAttributeChange = (index, field, value) => {
    setProduct(prev => {
      const newVariants = [...prev.variants];
      newVariants[index] = {
        ...newVariants[index],
        attributes: { ...newVariants[index].attributes, [field]: value }
      };
      return { ...prev, variants: newVariants };
    });
  };

const toggleVariantImage = (variantIndex, imageIndex) => {


  setProduct((prevProduct) => {
    const updatedVariants = [...prevProduct.variants];

    const selectedVariant = { ...updatedVariants[variantIndex] };
    const images = [...selectedVariant.images];

    const imageValue = imageIndex.toString(); // Keep as string if required

    if (images.includes(imageValue)) {
      // Remove image
      selectedVariant.images = images.filter(
        (img) => img !== imageValue
      );
    } else {
      // Add image
      selectedVariant.images = [...images, imageValue];
    }

    updatedVariants[variantIndex] = selectedVariant;

    return {
      ...prevProduct,
      variants: updatedVariants,
    };
  });
};


 
  const handleSave = async () => {
    setSaving(true);
    const formData = new FormData();

    formData.append("name", product.name);
    formData.append("description", product.description);
    formData.append("shortDescription", product.shortDescription);
    formData.append("category", product.category);

 
    formData.append("isActive", product.isActive);
    formData.append("isFeatured", product.isFeatured);
    formData.append("isNewArrived", product.isNewArrived);
    formData.append("isBestSaller", product.isBestSaller);
    formData.append("details", JSON.stringify(product.details));
    
   
    formData.append("tags", JSON.stringify(product.tags));
    formData.append("seo", JSON.stringify(product.seo));
    formData.append("variants", JSON.stringify(product.variants)); // Append variants

    if (product?.deleteImg?.length > 0) {
      formData.append("deleteImg", JSON.stringify(product.deleteImg));
    }

    product?.newimages?.forEach((file) => {
      formData.append("newimage", file);
    });

   
if(product?.newthumbnail){
formData.append("newthumbnail",product?.newthumbnail)
}





    try {
      const response = await axios.put(`${base_url}/products/update/${slug}`, formData);
      toast.success(response.data.message);
      route.push(`/products/${slug}/view`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save product");
    } finally {
      setSaving(false);
    }
  };


  if (loading) return <div className="p-10 text-center dark:text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 p-4 md:p-8 transition-colors duration-300">
      {/* Header */}
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Edit Product</h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            Slug: <span className="font-mono text-blue-600">{slug}</span>
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-all disabled:opacity-50 shadow-lg shadow-blue-500/20"
        >
          {saving ? "Saving..." : <><FaSave /> Save Product</>}
        </button>
      </div>

      <div className="mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        






    
        <div className="lg:col-span-2 space-y-6">
          
          {/* Basic Info Card */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm">
            <h2 className="text-lg font-bold mb-6 text-zinc-800 dark:text-zinc-200">
              Product Information
            </h2>
            <div className="grid gap-6">
              <div>
                <label className="block text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-2">
                  Display Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={product.name}
                  onChange={handleInput}
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                />
              </div>

            

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-2">Category</label>
                  <select
                    value={product.category}
                    onChange={(e) => setProduct(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                  >
                    <option value="">Select Category</option>
                    {allCategory.map((item, index) => (
                      <option key={index} value={item._id}>{item.name}</option>
                    ))}
                  </select>
                </div>
              
              </div>

            
              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <h3 className="text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-3">Custom Specifications</h3>
                <div className="flex items-end gap-4 mb-4">
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-zinc-500 mb-1">Key</label>
                    <input
                      type="text"
                      value={newDetails.key}
                      onChange={(e) => setNewDetails(prev => ({ ...prev, key: e.target.value }))}
                      placeholder="e.g. Material"
                      className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg p-2 outline-none dark:text-white"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-zinc-500 mb-1">Value</label>
                    <input
                      type="text"
                      value={newDetails.value}
                      onChange={(e) => setNewDetails(prev => ({ ...prev, value: e.target.value }))}
                      placeholder="e.g. Cotton"
                      className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg p-2 outline-none dark:text-white"
                    />
                  </div>
                  <button onClick={handelAddDetails} className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                    Add
                  </button>
                </div>
                
                <div className="space-y-2">
                  {Object.entries(product.details).map(([key, val]) => (
                    <div key={key} className="flex justify-between items-center bg-zinc-50 dark:bg-zinc-800/50 p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700">
                      <div>
                        <span className="font-semibold text-zinc-700 dark:text-zinc-300 capitalize">{key}: </span>
                        <span className="text-zinc-600 dark:text-zinc-400">{val}</span>
                      </div>
                      <button onClick={() => handelRemoveDetails(key)} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-1 rounded">
                        <MdOutlineCancel />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Descriptions */}
              <div>
                <label className="block text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-2">Short Description</label>
                <textarea
                  name="shortDescription"
                  rows="3"
                  value={product.shortDescription}
                  onChange={handleInput}
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-2">Full Description</label>
                <div className="prose-container dark:text-white">
                  <RichEditor content={product.description} setContent={(val) => setProduct(prev => ({ ...prev, description: val }))} />
                </div>
              </div>
            </div>
          </div>

        







<div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm">
            <h2 className="text-lg font-bold mb-6 text-zinc-800 dark:text-zinc-200">Product Thumbnail</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4 mb-6">
              
              {/* {product.images.map((item, index) => (
                <div key={index} className="relative group aspect-square rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700">
                  <img src={`${img_url}${item}`} alt="" className="w-full h-full object-cover" />
                  <div className="absolute top-1 left-1 bg-black/60 text-white text-[10px] px-1.5 rounded">Idx: {index}</div>
                  <button onClick={() => handelRemoveImg(index)} className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <MdDelete className="text-white text-2xl" />
                  </button>
                </div>
              ))}
              
              {product.newimages.map((file, index) => (
                <div key={index} className="relative group aspect-square rounded-xl overflow-hidden border-2 border-dashed border-blue-400">
                  <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover opacity-70" />
                  <div className="absolute top-2 left-2 bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full">New</div>
                  <button onClick={() => handelRemovenewImg(index)} className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-red-500/20 transition-opacity">
                    <MdOutlineCancel className="text-red-600 text-3xl" />
                  </button>
                </div>
              ))} */}


              { product.thumbnail && !product.newthumbnail && 
                <div  className="relative group aspect-square rounded-xl overflow-hidden border-2 border-dashed border-blue-400">
                  <img src={`${img_url}${product.thumbnail}`} alt="" className="w-full h-full object-cover opacity-70" />
                  {/* <div className="absolute top-2 left-2 bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full">New</div>
                  <button onClick={() => setProduct(p => ({ ...p, newthumbnail: null }))} className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-red-500/20 transition-opacity">
                    <MdOutlineCancel className="text-red-600 text-3xl" />
                  </button> */}
                </div>
             }


{product.newthumbnail && 
                <div  className="relative group aspect-square rounded-xl overflow-hidden border-2 border-dashed border-blue-400">
                  <img src={URL.createObjectURL(product.newthumbnail)} alt="" className="w-full h-full object-cover opacity-70" />
                  <div className="absolute top-2 left-2 bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full">New</div>
                  <button onClick={() => setProduct(p => ({ ...p, newthumbnail: null }))} className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-red-500/20 transition-opacity">
                    <MdOutlineCancel className="text-red-600 text-3xl" />
                  </button>
                </div>
             }


            </div>
            
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-2xl cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition">
              <FaCloudUploadAlt className="text-3xl text-blue-500 mb-2" />
              <span className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">Drop new files or click to browse</span>
              <input
                type="file"  hidden accept="image/*"
                onChange={(e) => setProduct(p => ({ ...p, newthumbnail: e.target.files[0] }))}
              />
            </label>
          </div>






          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm">
            <h2 className="text-lg font-bold mb-6 text-zinc-800 dark:text-zinc-200">Product Media</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4 mb-6">
              {/* Existing Images */}
              {product.images.map((item, index) => (
                <div key={index} className="relative group aspect-square rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700">
                  <img src={`${img_url}${item}`} alt="" className="w-full h-full object-cover" />
                  <div className="absolute top-1 left-1 bg-black/60 text-white text-[10px] px-1.5 rounded">Idx: {index}</div>
                  <button onClick={() => handelRemoveImg(index)} className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <MdDelete className="text-white text-2xl" />
                  </button>
                </div>
              ))}
              {/* New Previews */}
              {product.newimages.map((file, index) => (
                <div key={index} className="relative group aspect-square rounded-xl overflow-hidden border-2 border-dashed border-blue-400">
                  <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover opacity-70" />
                  <div className="absolute top-2 left-2 bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full">New</div>
                  <button onClick={() => handelRemovenewImg(index)} className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-red-500/20 transition-opacity">
                    <MdOutlineCancel className="text-red-600 text-3xl" />
                  </button>
                </div>
              ))}
            </div>
            
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-2xl cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition">
              <FaCloudUploadAlt className="text-3xl text-blue-500 mb-2" />
              <span className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">Drop new files or click to browse</span>
              <input
                type="file" multiple hidden accept="image/*"
                onChange={(e) => setProduct(p => ({ ...p, newimages: [...p.newimages, ...Array.from(e.target.files)] }))}
              />
            </label>
          </div>
          
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-zinc-800 dark:text-zinc-200">Product Variants</h2>
              <button 
                onClick={handleAddVariant}
                className="flex items-center gap-1 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
              >
                <FaPlus className="text-xs" /> Add Variant
              </button>
            </div>

            <div className="space-y-6">
              {product.variants.length === 0 ? (
                <div className="text-center py-8 text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700">
                  No variants defined for this product.
                </div>
              ) : (
                product.variants.map((variant, vIndex) => (
                  <div key={vIndex} className="bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700 rounded-xl p-5 relative">
                    
                    <button 
                      onClick={() => handleRemoveVariant(vIndex)}
                      className="absolute top-4 right-4 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-1.5 rounded-lg transition-colors"
                      title="Remove Variant"
                    >
                      <MdDelete className="text-xl" />
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 pr-10">
                      <div>
                        <label className="block text-xs font-semibold text-zinc-500 mb-1">SKU</label>
                        <input 
                          type="text" value={variant.sku} onChange={(e) => handleVariantChange(vIndex, 'sku', e.target.value)}
                          className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg p-2 outline-none dark:text-white"
                        />
                      </div>
                      <div className="flex items-center gap-2 mt-5">
                        <input 
                          type="checkbox" checked={variant.isActive} onChange={(e) => handleVariantChange(vIndex, 'isActive', e.target.checked)}
                          className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                        />
                        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Variant Active</label>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <label className="block text-xs font-semibold text-zinc-500 mb-1">Attr Type</label>
                        <select 
                          value={variant.attributes?.itemtype || 'weight'} 
                          onChange={(e) => handleVariantAttributeChange(vIndex, 'itemtype', e.target.value)}
                          className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg p-2 outline-none dark:text-white text-sm"
                        >
                          <option value="weight">Weight</option>
                          <option value="color">Color</option>
                          <option value="size">Size</option>
                          <option value="material">Material</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-zinc-500 mb-1">Attr Value</label>
                        <input 
                          type={`${variant.attributes?.itemtype=="color"? "color":"text" }`} value={variant.attributes?.value || ''} placeholder="e.g. 150g or #FF0000"
                          onChange={(e) => handleVariantAttributeChange(vIndex, 'value', e.target.value)}
                          className="w-full bg-white dark:bg-zinc-900 h-10 border border-zinc-200 dark:border-zinc-700 rounded-lg p-2 outline-none dark:text-white text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-zinc-500 mb-1">Base Price</label>
                        <input 
                          type="number" value={variant.basePrice} onChange={(e) => handleVariantChange(vIndex, 'basePrice', e.target.value)}
                          className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg p-2 outline-none dark:text-white text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-zinc-500 mb-1">MRP</label>
                        <input 
                          type="number" value={variant.mrp} onChange={(e) => handleVariantChange(vIndex, 'mrp', e.target.value)}
                          className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg p-2 outline-none dark:text-white text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-zinc-500 mb-1">Stock</label>
                        <input 
                          type="number" value={variant.stock} onChange={(e) => handleVariantChange(vIndex, 'stock', e.target.value)}
                          className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg p-2 outline-none dark:text-white text-sm"
                        />
                      </div>
                    </div>

                    {/* */}
                    <div>
                      <label className="block text-xs font-semibold text-zinc-500 mb-2 flex items-center gap-1">
                        <FaImage /> Select Images for this Variant
                      </label>
                      
                        <div className="flex flex-wrap gap-2">
                          {product.images.map((img, imgIdx) => {
                            const isSelected = variant.images?.includes(imgIdx.toString());
                            return (
                              <div 
                                key={imgIdx} 
                                onClick={() => toggleVariantImage(vIndex, imgIdx)}
                                className={`w-12 h-12 rounded cursor-pointer overflow-hidden border-2 transition-all ${
                                  isSelected ? 'border-blue-500 scale-105 shadow-md' : 'border-transparent opacity-50 hover:opacity-100'
                                }`}
                              >
                                <img src={`${img_url}${img}`} alt="" className="w-full h-full object-cover" />
                              </div>
                            )
                          })}

                           {product.newimages.map((img, imgIdx) => {
                const isSelected = variant.images?.includes((product.images.length+imgIdx).toString());
                            return (
                              <div 
                                key={imgIdx} 
                                onClick={() => toggleVariantImage(vIndex, product.images.length+imgIdx)}
                                className={`w-12 h-12 rounded cursor-pointer overflow-hidden border-2 transition-all ${
                                  isSelected ? 'border-blue-500 scale-105 shadow-md' : 'border-transparent opacity-50 hover:opacity-100'
                                }`}
                              >
                                <img src={URL.createObjectURL(img)} alt="" className="w-full h-full object-cover" />
                              </div>
                            )
})}
                        </div>
                  

                    </div>

                  </div>
                ))
              )}
            </div>
          </div>
        </div>
    








        <div className="space-y-6">
        
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm">
            <h2 className="text-lg font-bold mb-4 text-zinc-800 dark:text-zinc-200">Visibility</h2>
            <div className="space-y-3">
              {[
                { label: "Active", key: "isActive", icon: FaLayerGroup, color: "text-blue-500" },
                { label: "Featured", key: "isFeatured", icon: FaCheckCircle, color: "text-emerald-500" },
                { label: "New Arrived", key: "isNewArrived", icon: FaCheckCircle, color: "text-yellow-500" },
                { label: "Best Products", key: "isBestSaller", icon: FaCheckCircle, color: "text-red-500" },
              ].map((toggle) => (
                <div key={toggle.key} className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800">
                  <div className="flex items-center gap-3">
                    <toggle.icon className={product[toggle.key] ? toggle.color : "text-zinc-400"} />
                    <span className="text-sm font-semibold dark:text-zinc-300">{toggle.label}</span>
                  </div>
                  <button
                    onClick={() => setProduct((p) => ({ ...p, [toggle.key]: !p[toggle.key] }))}
                    className={`w-12 h-6 rounded-full relative transition-colors ${product[toggle.key] ? "bg-blue-600" : "bg-zinc-300 dark:bg-zinc-700"}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${product[toggle.key] ? "left-7" : "left-1"}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm">
            <h2 className="text-lg font-bold mb-4 text-zinc-800 dark:text-zinc-200">Tags</h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {product.tags.map((tag, i) => (
                <span key={i} className="flex items-center gap-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-lg text-sm">
                  {tag} 
                  <MdOutlineCancel className="cursor-pointer" onClick={() => setProduct((p) => ({ ...p, tags: p.tags.filter((_, ind) => ind !== i) }))} />
                </span>
              ))}
            </div>
            <input
              type="text" placeholder="Type and hit Enter" value={newTag}
              onChange={(e) => setNewTag(e.target.value)} onKeyDown={(e) => handleTagKeyDown(e, "general")}
              className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl p-3 text-sm outline-none dark:text-white"
            />
          </div>
                
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm">
            <h2 className="text-lg font-bold mb-4 text-zinc-800 dark:text-zinc-200">Search Engine (SEO)</h2>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold uppercase text-zinc-400">Meta Title</label>
                <input
                  type="text" name="metaTitle" value={product.seo.metaTitle} onChange={handleSeoInput}
                  className="w-full bg-transparent border-b border-zinc-200 dark:border-zinc-700 py-1 outline-none focus:border-blue-500 dark:text-white text-sm"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase text-zinc-400">Meta Description</label>
                <textarea
                  name="metaDescription" rows="3" value={product.seo.metaDescription} onChange={handleSeoInput}
                  className="w-full bg-transparent border-b border-zinc-200 dark:border-zinc-700 py-1 outline-none focus:border-blue-500 dark:text-white text-sm resize-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase text-zinc-400">Keywords</label>
                <div className="flex flex-wrap gap-1 mb-2 mt-1">
                  {product.seo.keywords.map((kw, i) => (
                    <span key={i} className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 px-2 py-0.5 rounded text-xs flex items-center gap-1">
                      {kw} <MdOutlineCancel className="cursor-pointer" onClick={() => setProduct((p) => ({ ...p, seo: { ...p.seo, keywords: p.seo.keywords.filter((_, ind) => ind !== i) } }))} />
                    </span>
                  ))}
                </div>
                <input
                  type="text" placeholder="Add SEO tag..." value={newMetaTag}
                  onChange={(e) => setNewMetaTag(e.target.value)} onKeyDown={(e) => handleTagKeyDown(e, "seo")}
                  className="w-full bg-transparent border-b border-zinc-200 dark:border-zinc-700 py-1 outline-none focus:border-blue-500 dark:text-white text-sm"
                />
              </div>
            </div>
          </div>
          
<ReviewSection  productid={product._id} />



          
        </div>
      </div>
    </div>
  );
};

export default EditCompo;