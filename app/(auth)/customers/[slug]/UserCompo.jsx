"use client"
import { base_url, img_url } from '@/app/components/urls'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { HiOutlineUser, HiOutlineMail, HiOutlineCalendar, HiOutlineShoppingBag, HiExternalLink } from 'react-icons/hi'

const UserCompo = ({ slug }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${base_url}/user/getsingle/${slug}`);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (slug) fetchUser();
  }, [slug]);

  if (loading) return <div className="p-10 text-center animate-pulse dark:text-gray-400">Loading User Details...</div>;
  if (!data) return <div className="p-10 text-red-500">User data not found.</div>;

  const { user, cart , addresses} = data;
  console.log(addresses)

  return (
    <div className="p-4 md:p-6 bg-gray-50 dark:bg-black min-h-screen text-sm">

      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">User Management / <span className="text-indigo-600 dark:text-indigo-400">Details</span></h2>
        <span className={`px-3 py-1 rounded text-xs font-bold ${user.status ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700'}`}>
          {user.status ? 'ACTIVE' : 'DISABLED'}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
     
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-lg p-5 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <HiOutlineUser size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white capitalize">{user.name}</h3>
                <p className="text-xs text-gray-500">ID: {user._id}</p>
              </div>
            </div>
            
            <div className="space-y-3 border-t dark:border-slate-800 pt-4">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <HiOutlineMail className="shrink-0" /> {user.email}
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <HiOutlineCalendar className="shrink-0" /> Joined: {new Date(user.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>

       
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 border-b dark:border-slate-800 flex items-center gap-2 font-bold text-gray-700 dark:text-gray-200">
              <HiOutlineShoppingBag /> User Cart Content
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">

                 <thead className="bg-gray-50 dark:bg-slate-800/50 text-gray-500 dark:text-gray-400 uppercase text-[10px] font-bold">
                  <tr>
                    <th className="px-4 py-3">Product</th>
                    <th className="px-4 py-3 text-center">Qty</th>
                    <th className="px-4 py-3">Price</th>
                    <th className="px-4 py-3">Total</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                 </thead>
                 <tbody className="divide-y dark:divide-slate-800">
                  {cart.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img src={`${img_url}${item.product.images[0]}`} className="h-10 w-10 object-cover rounded border dark:border-slate-700" alt="" />
                          <div>
                            <div className="font-medium dark:text-gray-200 line-clamp-1">{item.product.name}</div>
                            <div className="text-[10px] text-gray-400">{item.product.category}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center dark:text-gray-300">{item.quantity}</td>
                      <td className="px-4 py-3 dark:text-gray-300">₹{item.price}</td>
                      <td className="px-4 py-3 font-bold text-indigo-600 dark:text-indigo-400">₹{item.total}</td>
                      <td className="px-4 py-3 text-right">
                        <a href={`/admin/products/${item.product.slug}`} className="text-gray-400 hover:text-indigo-500">
                          <HiExternalLink size={18} />
                        </a>
                      </td>
                    </tr>
                  ))}
                  {cart.length === 0 && (
                    <tr>
                      <td colSpan="5" className="px-4 py-10 text-center text-gray-400">No items in cart</td>
                    </tr>
                  )}
                 </tbody>

              </table>
            </div>

           
            <div className="p-4 bg-gray-50 dark:bg-slate-800/50 border-t dark:border-slate-800 flex justify-end">
              <div className="text-right">
                <span className="text-gray-500 dark:text-gray-400 mr-2">Grand Total:</span>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  ₹{cart.reduce((acc, curr) => acc + curr.total, 0).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>



 <div className="lg:col-span-3">
          <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 border-b dark:border-slate-800 flex items-center gap-2 font-bold text-gray-700 dark:text-gray-200">
              <HiOutlineShoppingBag /> User Address
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">

                 <thead className="bg-gray-50 dark:bg-slate-800/50 text-gray-500 dark:text-gray-400 uppercase text-[10px] font-bold">
                  <tr>
                    <th className="px-4 py-3">Address Type</th>
                    <th className="px-4 py-3 text-center">Area</th>
                    <th className="px-4 py-3 text-center">State</th>
                    <th className="px-4 py-3">City</th>
                    <th className="px-4 py-3">First Name</th>
                    <th className="px-4 py-3">last Name</th>
                   
                    <th className="px-4 py-3">House No.</th>
                    <th className="px-4 py-3">Landmark</th>
                    <th className="px-4 py-3">Phone</th>
                    <th className="px-4 py-3">Pincode</th>
                 
                  </tr>
                 </thead>
                 <tbody className="divide-y dark:divide-slate-800">
                  {addresses.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-4 py-3">
                        {item.addressType}
                      </td>
                      <td className="px-4 py-3 text-center dark:text-gray-300">{item.area}</td>
                      <td className="px-4 py-3 text-center dark:text-gray-300">{item.state}</td>
                      <td className="px-4 py-3 dark:text-gray-300">{item.city}</td>
                      <td className="px-4 py-3 font-bold text-indigo-600 dark:text-indigo-400">{item.firstName}</td>
                      <td className="px-4 py-3 font-bold text-indigo-600 dark:text-indigo-400">{item.lastName}</td>
                      <td className="px-4 py-3 font-bold text-indigo-600 dark:text-indigo-400">{item.houseNo}</td>
                      <td className="px-4 py-3 font-bold text-indigo-600 dark:text-indigo-400">{item.landmark}</td>
                      <td className="px-4 py-3 font-bold text-indigo-600 dark:text-indigo-400">{item.phone}</td>
                      <td className="px-4 py-3 font-bold text-indigo-600 dark:text-indigo-400">{item.pincode}</td>

                      
                    </tr>
                  ))}
                  {cart.length === 0 && (
                    <tr>
                      <td colSpan="5" className="px-4 py-10 text-center text-gray-400">No items in cart</td>
                    </tr>
                  )}
                 </tbody>

              </table>
            </div>

           
            <div className="p-4 bg-gray-50 dark:bg-slate-800/50 border-t dark:border-slate-800 flex justify-end">
              <div className="text-right">
                <span className="text-gray-500 dark:text-gray-400 mr-2">Grand Total:</span>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  ₹{cart.reduce((acc, curr) => acc + curr.total, 0).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default UserCompo