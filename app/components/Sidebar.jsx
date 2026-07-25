"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  FiLayout, 
  FiShoppingBag, 
  FiUsers, 
  FiBarChart2, 
  FiSettings, 
  FiChevronLeft, 
  FiChevronRight,
  FiPackage,
  FiTruck,
  
} from 'react-icons/fi';
import { MdCreateNewFolder, MdOutlineCategory, MdOutlineSlowMotionVideo } from "react-icons/md";
import { TfiLayoutSlider } from "react-icons/tfi";
import { BsCollectionFill } from "react-icons/bs";

import ModeToggle from './ModeToggle';
import LocaleSwitcher from './LocaleSwitcher';
import { useTranslations } from 'next-intl';
import axios from 'axios';
import { base_url } from './urls';
import { LiaBlogSolid } from 'react-icons/lia';
import { RiCoupon3Line } from 'react-icons/ri';
axios.defaults.withCredentials=true



const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [loading,setLoading]= useState(true)
  const pathname = usePathname();
  const t = useTranslations('Slider') ;
     
 
 
  const navItems = [
    { name: t("dashboard"), href: '/', icon: FiLayout },
    // { name: t("banners") || "banners", href: '/banners', icon: TfiLayoutSlider },

    { name: t("category"), href: '/category', icon: MdOutlineCategory },
    { name: t("create-products"), href: '/products/create', icon: MdCreateNewFolder  },
    { name: t("products"), href: '/products', icon: FiPackage },
    { name: t("orders"), href: '/orders', icon: FiShoppingBag },
    { name: t("customers"), href: '/customers', icon: FiUsers },
    { name: t("Videos"), href: '/videos', icon: MdOutlineSlowMotionVideo  },
    { name: t("Blogs"), href: '/blogs', icon: LiaBlogSolid },
  
    { name: t("collection"), href: '/collections', icon: BsCollectionFill },
    { name: t("coupons"), href: '/coupons', icon: RiCoupon3Line  },
    { name: t("analytics"), href: '/analytics', icon: FiBarChart2 },
    { name: t("settings"), href: '/settings', icon: FiSettings },
  ]; 

  // { name: t("inventory"), href: '/inventory', icon: FiTruck },
const fetchAdmin= async()=>{
  try {setLoading(true)
    const response = await axios.get(`${base_url}/admin/get`)
    const data = await response.data;
    if(!data.success){
      location.href="/login"
    }
  } catch (error) {
          location.href="/login"

  }finally{
    setLoading(false)
  }
}
useEffect(()=>{
  fetchAdmin()
},[ ])

if (loading) {
  return (
    <div className='fixed z-50 top-0 left-0 h-screen w-screen bg-slate-900/50 backdrop-blur-sm'>
      <div className="flex items-center justify-center h-screen">
        <div className="relative">
          
          <div className="relative w-32 h-32">
        
            <div
              className="absolute w-full h-full rounded-full border-[3px] border-gray-100/10 border-r-[#0ff] border-b-[#0ff] animate-spin"
              style={{ animationDuration: '3s' }}
            ></div>

       
            <div
              className="absolute w-full h-full rounded-full border-[3px] border-gray-100/10 border-t-[#0ff] animate-spin"
              style={{ animationDuration: '2s', animationDirection: 'reverse' }}
            ></div>
          </div>

        
          <div
            className="absolute inset-0 bg-gradient-to-tr from-[#0ff]/10 via-transparent to-[#0ff]/5 animate-pulse rounded-full blur-sm"
          ></div>

        </div>
      </div>
    </div>
  );
}

const handelLogout = async()=>{
  try {
    const response = await axios.get(`${base_url}/admin/logout`)
    const data = await response.data;
    if(data.success){
        location.href="/login"
    }
  } catch (error) {
    
  }
}


  return (
    <div className={`relative flex flex-col h-screen  p-4 duration-300 border-r 
      bg-white border-slate-200 text-slate-500
      dark:bg-black dark:border-slate-800 dark:text-slate-400
      ${isCollapsed ? 'w-20' : 'w-64'}`}>
      

      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-9 bg-white border border-slate-200 rounded-full p-1 shadow-sm hover:bg-slate-50 
          dark:bg-slate-900 dark:border-slate-700 dark:hover:bg-slate-800 transition-colors z-10"
      >
        {isCollapsed ? <FiChevronRight size={16} /> : <FiChevronLeft size={16} />}
      </button>


      <div className="flex  items-center gap-3 px-2 mb-10">
        <div className=" ">
        
          <img src="/icon.png" alt="" className={`  ${isCollapsed ? "h-10":"h-12"} `} />
        </div>
        {!isCollapsed && (
          <span className="font-bold text-xl tracking-tight text-slate-800 dark:text-white">
            DashBoard
          </span>
        )}
      </div>

      
      <nav className={` overflow-auto space-y-2  ${isCollapsed ? "custom-scrollsm":"custom-scroll"} `}>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? 'bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-500' 
                  : 'hover:bg-slate-50 hover:text-slate-900 dark:hover:bg-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <item.icon size={22} className={isActive ? 'text-orange-600' : 'group-hover:text-slate-900 dark:group-hover:text-slate-100'} />
              {!isCollapsed && (
                <span className="font-medium whitespace-nowrap">{item.name}</span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-100 dark:border-slate-800 pt-4 mt-auto space-y-4">
        <div 
        //   onClick={toggleDarkMode}
          className="flex items-center gap-3 w-full p-3 rounded-xl transition-colors"
        >
       
{!isCollapsed && (
     <LocaleSwitcher />
)

}

          {!isCollapsed && (
            
            <ModeToggle />
          )}
        </div>
        <div className={`flex items-center gap-3 px-2 ${isCollapsed ? 'justify-center' : ''}`}>
           <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700" />
           {!isCollapsed && (
             <div className="flex flex-col overflow-hidden">
               <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate"> Admin</span>
               <span onClick={handelLogout} className="text-xs text-slate-500 dark:text-slate-400 cursor-pointer hover:underline">Logout</span>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;