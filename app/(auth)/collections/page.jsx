"use client"
import { base_url, img_url } from '@/app/components/urls';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { FaCloudUploadAlt, FaTrash } from "react-icons/fa";
import { MdAddCircleOutline, MdCancel } from "react-icons/md";
import { FiPackage, FiPlus } from 'react-icons/fi';
import { toast } from 'react-toastify';

const CollectionPage = () => {
  const [inputData, setInputdata] = useState({
    name: "", description: "", image: null
  })
  const [allcollection, setAllCollection] = useState([]);
  const [allProduct, setAllProduct] = useState([]);

  const handelSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", inputData.name);
      formData.append("description", inputData.description);
      formData.append("image", inputData.image);

      const response = await axios.post(`${base_url}/collection/create`, formData);
      const data = await response.data;

      if (data.success || response.status === 200) {
        setInputdata({ name: "", description: "", image: null });
        fetchCollection();
      }
    } catch (error) {
      console.error("Error creating collection:", error);
    }
  }

  const fetchCollection = async () => {
    try {
      const response = await axios.get(`${base_url}/collection/get`);
      const data = await response.data;
      if (data.success) {
        setAllCollection(data.data)
      }
    } catch (error) {
      console.error("Error fetching collections:", error);
      setAllCollection([])
    }
  }

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`${base_url}/collection/getproduct`);
      const data = await response.data;
      if (data.success) {
        setAllProduct(data.products)
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setAllProduct([])
    }
  }

  const handelRemoveProduct = async (cid, pid) => {
    try {
      const response = await axios.put(`${base_url}/collection/removeproduct/${cid}`, { pid })
      if (response.status === 200) {
        fetchCollection();
      }
    } catch (error) {
      console.error("Error removing product:", error);
    }
  }
  const handelDeleteCollection = async (id) => {
    try {
      const response = await axios.delete(`${base_url}/collection/delete/${id}`)
      if (response.status === 200) {
        fetchCollection();
        toast.success(response.data.message)
      }
    } catch (error) {
      console.error("Error removing product:", error);
    }
  }

  const handelAddProduct = async (cid, pid) => {
    try {
      const response = await axios.put(`${base_url}/collection/addproduct/${cid}`, { pid })
      if (response.status === 200) {
        fetchCollection();
      }
    } catch (error) {
      console.error("Error adding product:", error);
    }
  }

  useEffect(() => {
    fetchCollection()
    fetchProduct()
  }, [])

  return (
    <div className="min-h-screen mx-auto p-4 md:p-8 space-y-12 dark:bg-black">

     
      <div className='flex justify-center w-full'>
        <section className="bg-white flex-1 dark:bg-gray-950 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 max-w-2xl">
          <h2 className="text-xl font-bold mb-6 text-slate-800 dark:text-white">Create New Collection</h2>
          <form onSubmit={handelSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <input
                type="text"
                required
                placeholder="Collection Name"
                value={inputData.name}
                onChange={(e) => setInputdata(prev => ({ ...prev, name: e.target.value }))}
                className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-transparent text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <textarea
                required
                placeholder="Description"
                value={inputData.description}
                onChange={(e) => setInputdata(prev => ({ ...prev, description: e.target.value }))}
                className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-transparent text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none min-h-[100px]"
              />
            </div>

            <div>
              {inputData.image ? (
                <div className='w-full h-40 relative rounded-lg overflow-hidden border border-slate-300'>
                  <div className='absolute inset-0 bg-black/40 flex justify-center items-center opacity-0 hover:opacity-100 transition-opacity'>
                    <MdCancel
                      className='text-white text-4xl cursor-pointer hover:text-red-500 transition-colors'
                      onClick={() => setInputdata(prev => ({ ...prev, image: null }))}
                    />
                  </div>
                  <img src={URL.createObjectURL(inputData.image)} className='h-full w-full object-cover' alt="Preview" />
                </div>
              ) : (
                <>
                  <label htmlFor="image" className='w-full h-40 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg flex flex-col justify-center items-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors text-slate-500'>
                    <FaCloudUploadAlt className="text-3xl mb-2" />
                    <span>Upload Collection Image</span>
                  </label>
                  <input
                    type="file"
                    id="image"
                    accept='image/*'
                    hidden
                    onChange={(e) => setInputdata(prev => ({ ...prev, image: e.target.files[0] }))}
                  />
                </>
              )}
            </div>

            <button
              type='submit'
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors shadow-sm"
            >
              Submit Collection
            </button>
          </form>
        </section>
      </div>

      {/* ALL COLLECTIONS SECTION */}
      <section>
        <h2 className="text-xl font-bold mb-6 text-slate-800 dark:text-white flex items-center gap-2">
          <FiPackage /> All Collections
        </h2>

        <div className="grid grid-cols-1 gap-8">
          {allcollection.length > 0 && allcollection.map((item, index) => {
            
            // Smart Filter: Only show products that aren't already in this collection
            const availableProducts = allProduct.filter(
              (pitem) => !item.products?.some((itm) => itm._id.toString() === pitem._id.toString())
            );

            return (
              <div
                key={item._id || index}
                className="group bg-white dark:bg-gray-950 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col md:flex-row"
              >
                {/* Left Side: Collection Info */}
                <div className='w-full md:w-1/3 flex flex-col border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-gray-950'>
                  <img
                    src={`${img_url}${item.image}`}
                    alt={item.name}
                    className="w-full h-48 md:h-60 object-cover"
                  />

                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className="font-bold text-xl text-slate-800 dark:text-white capitalize truncate">
                      {item.name}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-3 mt-2 mb-4 flex-grow">
                      {item.description}
                    </p>

                    <button onClick={()=>handelDeleteCollection(item._id)} className="flex items-center justify-center gap-2 w-full py-2 px-4 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-600 rounded-lg transition-colors text-sm font-medium">
                      <FaTrash /> Delete Collection
                    </button>
                  </div>
                </div>

                {/* Right Side: Products Area */}
                <div className='w-full md:w-2/3 flex flex-col bg-slate-50 dark:bg-gray-950/40'>
                  
                  {/* Current Products Grid */}
                  <div className="p-5 flex-grow">
                    <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
                      Products in Collection ({item.products?.length || 0})
                    </h4>

                    <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4'>
                      {item.products?.length > 0 ? item.products.map((p) => (
                        <div key={p._id} className='bg-white dark:bg-slate-700 p-3 rounded-xl shadow-sm flex flex-col items-center gap-2 relative group/product border border-slate-100 dark:border-slate-600'>
                          
                          <button
                            onClick={() => handelRemoveProduct(item._id, p._id)}
                            className='absolute -top-2 -right-2 bg-white dark:bg-gray-950 rounded-full shadow-md p-1 opacity-0 group-hover/product:opacity-100 transition-opacity z-10'
                            title="Remove from collection"
                          >
                            <MdCancel className='text-red-500 text-xl hover:text-red-700' />
                          </button>

                          <img
                            src={`${img_url}${p.images[0]}`}
                            alt={p.name}
                            className='h-16 w-16 sm:h-20 sm:w-20 rounded-lg object-cover border border-slate-100 dark:border-slate-600'
                          />
                          <p className='text-xs sm:text-sm text-center font-medium text-slate-700 dark:text-slate-200 line-clamp-2'>
                            {p.name}
                          </p>
                        </div>
                      )) : (
                        <p className="text-slate-400 text-sm italic col-span-full">No products in this collection yet.</p>
                      )}
                    </div>
                  </div>

                  {/* Add Available Products Row */}
                  <div className="p-5 bg-slate-100/50 dark:bg-slate-900/30 border-t border-slate-200 dark:border-slate-700">
                    <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                      Add to Collection
                    </h4>
                    
                    {availableProducts.length > 0 ? (
                      <div className="flex gap-4 overflow-x-auto pb-2 snap-x">
                        {availableProducts.map((pitem) => (
                          <div key={pitem._id} className='snap-start shrink-0 w-32 bg-white dark:bg-slate-700 p-3 rounded-xl shadow-sm border border-slate-200 dark:border-slate-600 flex flex-col items-center gap-2'>
                            <img 
                              src={`${img_url}${pitem.images[0]}`} 
                              alt={pitem.name} 
                              className='h-12 w-12 rounded-full object-cover shadow-sm' 
                            />
                            <p className='text-xs text-center font-medium text-slate-700 dark:text-slate-200 truncate w-full'>
                              {pitem.name}
                            </p>
                            <button 
                              onClick={() => handelAddProduct(item._id, pitem._id)}
                              className='mt-auto flex items-center justify-center gap-1 w-full py-1.5 px-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-md transition-colors text-xs font-semibold'
                            >
                              <FiPlus /> Add
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-400 text-sm italic">All available products are already in this collection.</p>
                    )}
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  )
}

export default CollectionPage