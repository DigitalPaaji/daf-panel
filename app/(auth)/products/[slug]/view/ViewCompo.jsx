"use client"
import { base_url, img_url } from '@/app/components/urls'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { 
  FaTag, 
  FaDollarSign, 
  FaPercent, 
  FaBox, 
  FaCalendarAlt,
  FaEye,
  FaCheckCircle,
  FaTimesCircle,
  FaStar,
  FaImage,
  FaTags,
  FaInfoCircle,
  FaList,
  FaArrowLeft,
  FaEdit,
  FaTrash,
  FaCopy,
  FaShare
} from 'react-icons/fa'
import { MdCategory, MdDescription, MdDetails, MdShortText } from 'react-icons/md'
import { IoMdPricetag } from 'react-icons/io'
import { BiCategory } from 'react-icons/bi'
import { BsFillTagsFill } from 'react-icons/bs'
import { HiOutlinePhotograph } from 'react-icons/hi'
import { RiStockLine } from 'react-icons/ri'
import { TbCurrencyRupee } from 'react-icons/tb'
import Link from 'next/link'
import Image from 'next/image'

const ViewCompo = ({ slug }) => {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedImage, setSelectedImage] = useState(0)

  const fetchProduct = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${base_url}/products/single/${slug}`)
      setProduct(response.data.product)
      setError(null)
    } catch (error) {
      setError('Failed to fetch product details')
      console.error('Error fetching product:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (slug) {
      fetchProduct()
    }
  }, [slug])

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Calculate discount percentage
  const calculateDiscount = (mrp, basePrice) => {
    if (!mrp || !basePrice) return 0
    const discount = ((mrp - basePrice) / mrp) * 100
    return Math.round(discount)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading product details...</p>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <FaTimesCircle className="text-red-500 text-5xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error || 'Product not found'}</p>
          <Link 
            href="/admin/products" 
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            Back to Products
          </Link>
        </div>
      </div>
    )
  }

  const allImages = [product.thumbnail,...product.images]


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black dark:text-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center space-x-4">
            <Link 
              href="/products" 
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition-colors"
            >
              <FaArrowLeft className="text-gray-600 dark:text-gray-300" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Product Details</h1>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
              product.isActive 
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
            }`}>
              {product.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
          
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <Link 
              href={`/products/${product.slug}/edit`}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
            >
              <FaEdit className="mr-2" />
              Edit Product
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column - Images */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden p-4">
              {/* Main Image */}
              <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden mb-4 relative">
                {allImages && allImages.length > 0 ? (
                  <img
                    src={`${img_url}${allImages[selectedImage]}`}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <FaImage className="text-4xl" />
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {allImages && allImages.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {allImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === index 
                          ? 'border-indigo-600 ring-2 ring-indigo-200 dark:ring-indigo-900' 
                          : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <img
                        src={`${img_url}${image}`}
                        alt={`${product.name} - ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Info */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Basic Info Card */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{product.name}</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Slug: {product.slug}</p>
              
              {/* Product Descriptions */}
              <div className="space-y-4">
                {product.shortDescription && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 flex items-center">
                      <MdShortText className="mr-1" /> Short Description
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                      {product.shortDescription}
                    </p>
                  </div>
                )}

                {product.description && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 flex items-center">
                      <MdDescription className="mr-1" /> Full Description
                    </h3>
                    <p 
                      className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg whitespace-pre-line" 
                      dangerouslySetInnerHTML={{__html: product.description}}
                    ></p>
                  </div>
                )}
              </div>
            </div>

            {/* VARIANTS SECTION (Added to match JSON object) */}
            {product.variants && product.variants.length > 0 && (
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center border-b border-gray-100 dark:border-gray-800 pb-3">
                  <FaList className="mr-2 text-indigo-500" /> Product Variants
                </h3>
                
                <div className="space-y-4">
                  {product.variants.map((variant, index) => (
                    <div key={variant._id || index} className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-5 border border-gray-200 dark:border-gray-700">
                      
                      {/* Variant Header */}
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500 dark:text-gray-400">SKU:</span>
                          <span className="text-base font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                            {variant.sku}
                          </span>
                        </div>
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          variant.isActive 
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                            : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-400'
                        }`}>
                          {variant.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>

                      {/* Variant Stats Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4 bg-white dark:bg-gray-900 p-4 rounded-md border border-gray-100 dark:border-gray-700/50">
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 capitalize mb-1">
                            {variant.attributes?.itemtype || 'Attribute'}
                          </p>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            {variant.attributes?.value}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Stock</p>
                          <p className={`text-sm font-semibold ${
                            variant.stock > 10 ? 'text-green-600 dark:text-green-400' : 
                            variant.stock > 0 ? 'text-orange-600 dark:text-orange-400' : 
                            'text-red-600 dark:text-red-400'
                          }`}>
                            {variant.stock} units
                          </p>
                        </div>
                           <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">MRP</p>
                          <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                            ₹{variant.mrp}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Base Price</p>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 line-through">
                            ₹{variant.basePrice}
                          </p>
                        </div>
                     
                      </div>

                      {/* Variant Images */}
                      {variant.images && variant.images.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                            Assigned Images
                          </p>
                          <div className="flex gap-3">
                            {variant.images.map((imgIdxStr, i) => {
                              const imgIndex = parseInt(imgIdxStr);
                              const imageSrc = product.images[imgIndex];
                              if (!imageSrc) return null;
                              return (
                                <div key={i} className="w-14 h-14 rounded-md overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
                                  <img 
                                    src={`${img_url}${imageSrc}`} 
                                    alt={`Variant ${variant.sku} image`} 
                                    className="w-full h-full object-cover" 
                                  />
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Meta & Status Info */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Category & Tags */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center">
                    <BiCategory className="mr-1" /> Category & Tags
                  </h3>
                  <div className="bg-indigo-50 dark:bg-indigo-900/10 rounded-lg p-4 mb-4 border border-indigo-100 dark:border-indigo-900/30">
                    <p className="font-medium text-indigo-700 dark:text-indigo-300">
                      {product.category?.name || product.category || 'Uncategorized'}
                    </p>
                  </div>
                  
                  {product.tags && product.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {product.tags.map((tag, index) => (
                        <span key={index} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-xs font-medium border border-gray-200 dark:border-gray-700">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Status Indicators */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center">
                    <FaInfoCircle className="mr-1" /> Status Indicators
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border border-gray-100 dark:border-gray-700/50">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Featured Product</span>
                      {product.isFeatured ? (
                        <span className="flex items-center text-sm font-medium text-yellow-600 dark:text-yellow-500">
                          <FaStar className="mr-1" /> Featured
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400 dark:text-gray-500">No</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border border-gray-100 dark:border-gray-700/50">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Multiple Variants</span>
                      <span className={`text-sm font-medium ${product.variants?.length > 1 ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-500'}`}>
                        {product.variants?.length > 1 ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Custom Details */}
            {product.details && Object.keys(product.details).length > 0 && (
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6">
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 flex items-center">
                  <MdDetails className="mr-1" /> Specifications
                </h3>
                <div className="space-y-2">
                  {Object.entries(product.details).map(([key, val]) => (
                    <div key={key} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                      <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 capitalize min-w-[120px]">
                        {key}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400 text-right">
                        {val}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SEO Information */}
            {product.seo && (
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6">
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 flex items-center">
                  <FaEye className="mr-1" /> SEO Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Meta Title</p>
                    <p className="text-sm text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
                      {product.seo.metaTitle || 'Not set'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Meta Description</p>
                    <p className="text-sm text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
                      {product.seo.metaDescription || 'Not set'}
                    </p>
                  </div>
                  {product.seo.keywords && product.seo.keywords.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">SEO Keywords</p>
                      <div className="flex flex-wrap gap-2">
                        {product.seo.keywords.map((keyword, index) => (
                          <span key={index} className="px-2 py-1 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800 rounded text-xs">
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Timestamps */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <FaCalendarAlt className="mr-3 text-indigo-500 text-xl" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Created At</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-200">{formatDate(product.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <FaCalendarAlt className="mr-3 text-indigo-500 text-xl" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Last Updated</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-200">{formatDate(product.updatedAt)}</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewCompo