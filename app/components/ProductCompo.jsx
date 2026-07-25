"use client"
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { base_url, img_url } from './urls' // Ensure this path is correct
import { FaEdit, FaTrash, FaChevronLeft, FaChevronRight, FaBoxOpen, FaRupeeSign, FaEye } from 'react-icons/fa'
import { MdImageNotSupported } from 'react-icons/md'
import Link from 'next/link'
import { toast } from 'react-toastify'
import { useSearchParams } from 'next/navigation'

const ProductCompo = () => {
   const searchParam = useSearchParams()
   const page = searchParam.get("page") || 1
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(page)
  const [totalPages, setTotalPages] = useState(1)
  const [totalProducts, setTotalProducts] = useState(0)

  // Fetch Logic
  const fetchProduct = async (page) => {
    try {
      setLoading(true)
      // Assuming your API accepts ?page=Number
      const response = await axios.get(`${base_url}/products/all?page=${page}`)
      const data = response.data

      if (data.success) {
        setProducts(data.products || [])
        setTotalPages(data.page.totalPages)
        setTotalProducts(data.page.totalProducts)
      }
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }

  // Trigger fetch when page changes
  useEffect(() => {
    fetchProduct(currentPage)
  }, [currentPage])

  // Handlers
  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1)
  }

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1)
  }

const handelDeleteProduct = async (id)=>{
  try {
    const response = await axios.delete(`${base_url}/products/delete/${id}`)
    const data = await response.data;
   if(data.success){
    toast.success(data.message)
        fetchProduct(currentPage)
   }
  } catch (error) {
    toast.error(error.response.data.message)
  }
}

 

  return (
    <div className="p-4 bg-gray-50 dark:bg-black min-h-screen transition-colors duration-300 px-24">
      
      {/* --- Header --- */}
      <div className="flex justify-between items-center mb-6  mx-auto">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <FaBoxOpen className="text-blue-600" /> Product Inventory
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Total Products: {totalProducts}
          </p>
        </div>
        <div>
         <Link href={"/products/create"} className='bg-yellow-600 text-white font-semibold px-2.5 py-1 text-xl rounded-xl'>Create</Link>
        </div>
      </div>

      {/* --- Table Container --- */}
      <div className=" mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            
            {/* Table Head */}
            <thead className="bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-200 uppercase text-xs font-semibold tracking-wider">
              <tr>
                <th className="p-4 border-b dark:border-gray-700">Image</th>
                <th className="p-4 border-b dark:border-gray-700">Product Name</th>
                <th className="p-4 border-b dark:border-gray-700">IsFeatured</th>
                <th className="p-4 border-b dark:border-gray-700"> Variants</th>
                <th className="p-4 border-b dark:border-gray-700">Category</th>
                <th className="p-4 border-b dark:border-gray-700 text-center">Actions</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                // Loading Skeleton Row
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500 dark:text-gray-400">
                    Loading data...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                // Empty State
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500 dark:text-gray-400 italic">
                    No products found.
                  </td>
                </tr>
              ) : (
                // Product Rows
                products.map((item) => {
                  // Logic to get the first image safely
                  const displayImage = item.thumbnail
                  return (
                    <tr key={item._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group">
                      
                      {/* Image Column */}
                      <td className="p-4 align-middle">
                        <div className="h-12 w-12 rounded-lg bg-gray-200 dark:bg-gray-600 overflow-hidden border border-gray-200 dark:border-gray-600 flex items-center justify-center">
                          {displayImage ? (
                            <img 
                              src={`${img_url}${displayImage}`} 
                              alt={item.name} 
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <MdImageNotSupported className="text-gray-400 text-xl" />
                          )}
                        </div>
                      </td>

                      {/* Name Column */}
                      <td className="p-4 align-middle">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {item.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 max-w-xs truncate">
                          {item.shortDescription || item.slug}
                        </div>
                      </td>

                      {/* Price Column */}
                      <td className="p-4 align-middle">
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                          {item?.isFeatured ?"Show":"Hidden"}
                          </span>
                         
                        </div>
                      </td>

                         <td className="p-4 align-middle">
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                          {item.variants.length}
                          </span>
                         
                        </div>
                      </td>

                      {/* Stock Column */}
                      <td className="p-4 align-middle">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800`}>
                        {item.category.name}
                        </span>
                      </td>

                      {/* Actions Column */}
                      <td className="p-4 align-middle text-center">
                        
                        <div className="flex items-center justify-center gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                         <Link href={`/products/${item.slug}/view`} className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-full transition-colors" title="Edit">
                            <FaEye  />
                          </Link>
                          <Link  href={`/products/${item.slug}/edit`} className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-full transition-colors" title="Edit">
                            <FaEdit />
                          </Link>
                          <button  onClick={()=>handelDeleteProduct(item._id)} className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-full transition-colors" title="Delete">
                            <FaTrash />
                          </button>
                        </div>
                      </td>

                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* --- Pagination Footer --- */}
        <div className="bg-gray-50 dark:bg-gray-800 p-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400">
                Page <span className="font-medium text-gray-900 dark:text-white">{currentPage}</span> of {totalPages}
            </span>

            <div className="flex gap-2">
                <button
                    onClick={handlePrev}
                    disabled={currentPage === 1 || loading}
                    className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <FaChevronLeft className="mr-1" /> Previous
                </button>
                <button
                    onClick={handleNext}
                    disabled={currentPage === totalPages || loading}
                    className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    Next <FaChevronRight className="ml-1" />
                </button>
            </div>
        </div>

      </div>
    </div>
  )
}

export default ProductCompo