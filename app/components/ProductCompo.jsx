"use client"

import axios from "axios"
import React, { useEffect, useState } from "react"
import { base_url, img_url } from "./urls"
import {
  FaEdit,
  FaTrash,
  FaChevronLeft,
  FaChevronRight,
  FaBoxOpen,
  FaEye,
  FaSearch,
  FaTimes,
} from "react-icons/fa"
import { MdImageNotSupported } from "react-icons/md"
import Link from "next/link"
import { toast } from "react-toastify"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

const ProductCompo = () => {
  const searchParam = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const pageParam = Number(searchParam.get("page")) || 1
  const searchParamValue = searchParam.get("search") || ""

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  // Search
  const [searchInput, setSearchInput] = useState(searchParamValue)

  // Pagination
  const [currentPage, setCurrentPage] = useState(pageParam)
  const [totalPages, setTotalPages] = useState(1)
  const [totalProducts, setTotalProducts] = useState(0)

  // Keep state synced with URL
  useEffect(() => {
    setCurrentPage(pageParam)
    setSearchInput(searchParamValue)
  }, [pageParam, searchParamValue])

  // Fetch Products
  const fetchProduct = async (page, searchValue = "") => {
    try {
      setLoading(true)

      const response = await axios.get(`${base_url}/products/all`, {
        params: {
          page,
          search: searchValue,
        },
      })

      const data = response.data

      if (data.success) {
        setProducts(data.products || [])
        setTotalPages(data.page?.totalPages || 1)
        setTotalProducts(data.page?.totalProducts || 0)
      } else {
        setProducts([])
        setTotalPages(1)
        setTotalProducts(0)
      }
    } catch (error) {
      console.error("Error fetching products:", error)

      toast.error(
        error?.response?.data?.message || "Failed to fetch products"
      )

      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  // Fetch when page/search URL changes
  useEffect(() => {
    fetchProduct(currentPage, searchParamValue)
  }, [currentPage, searchParamValue])

  // Debounced Search
  useEffect(() => {
    const timer = setTimeout(() => {
      const trimmedSearch = searchInput.trim()

      // Don't update URL if search hasn't changed
      if (trimmedSearch === searchParamValue) return

      const params = new URLSearchParams(searchParam.toString())

      if (trimmedSearch) {
        params.set("search", trimmedSearch)
      } else {
        params.delete("search")
      }

      // Search should always start from page 1
      params.set("page", "1")

      router.push(`${pathname}?${params.toString()}`)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchInput])

  // Clear Search
  const handleClearSearch = () => {
    setSearchInput("")

    const params = new URLSearchParams(searchParam.toString())

    params.delete("search")
    params.set("page", "1")

    router.push(`${pathname}?${params.toString()}`)
  }

  // Previous
  const handlePrev = () => {
    if (currentPage > 1) {
      const params = new URLSearchParams(searchParam.toString())
      params.set("page", String(currentPage - 1))

      router.push(`${pathname}?${params.toString()}`)
    }
  }

  // Next
  const handleNext = () => {
    if (currentPage < totalPages) {
      const params = new URLSearchParams(searchParam.toString())
      params.set("page", String(currentPage + 1))

      router.push(`${pathname}?${params.toString()}`)
    }
  }

  // Delete Product
  const handelDeleteProduct = async (id) => {
    try {
      const response = await axios.delete(
        `${base_url}/products/delete/${id}`
      )

      const data = response.data

      if (data.success) {
        toast.success(data.message)

        fetchProduct(currentPage, searchParamValue)
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to delete product"
      )
    }
  }

  return (
    <div className="p-4 md:px-8 xl:px-24 bg-gray-50 dark:bg-black min-h-screen transition-colors duration-300">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6 mx-auto">

        {/* Title */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <FaBoxOpen className="text-blue-600" />
            Product Inventory
          </h2>

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Total Products: {totalProducts}
          </p>
        </div>

        <Link
          href="/products/create"
          className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold px-4 py-2 text-lg rounded-xl transition-colors w-fit"
        >
          Create
        </Link>
      </div>

      {/* Search */}
      <div className="mb-5">
        <div className="relative max-w-xl">

          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />

          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search products by name..."
            className="
              w-full
              pl-11
              pr-11
              py-3
              rounded-xl
              border
              border-gray-300
              dark:border-gray-700
              bg-white
              dark:bg-gray-800
              text-gray-900
              dark:text-white
              placeholder-gray-400
              outline-none
              focus:ring-2
              focus:ring-blue-500
              focus:border-blue-500
              transition-all
            "
          />

          {searchInput && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="
                absolute
                right-3
                top-1/2
                -translate-y-1/2
                p-2
                text-gray-400
                hover:text-gray-700
                dark:hover:text-white
                transition-colors
              "
              title="Clear search"
            >
              <FaTimes />
            </button>
          )}
        </div>

        {searchParamValue && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Search results for{" "}
            <span className="font-semibold text-gray-800 dark:text-white">
              "{searchParamValue}"
            </span>
          </p>
        )}
      </div>

      {/* Table Container */}
      <div className="mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full text-left border-collapse">

            {/* Table Head */}
            <thead className="bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-200 uppercase text-xs font-semibold tracking-wider">

              <tr>
                <th className="p-4 border-b dark:border-gray-700">
                  Image
                </th>

                <th className="p-4 border-b dark:border-gray-700">
                  Product Name
                </th>

                <th className="p-4 border-b dark:border-gray-700">
                  IsFeatured
                </th>

                <th className="p-4 border-b dark:border-gray-700">
                  Variants
                </th>

                <th className="p-4 border-b dark:border-gray-700">
                  Category
                </th>

                <th className="p-4 border-b dark:border-gray-700 text-center">
                  Actions
                </th>
              </tr>

            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">

              {loading ? (

                <tr>
                  <td
                    colSpan={6}
                    className="p-12 text-center text-gray-500 dark:text-gray-400"
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-7 h-7 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
                      <span>Loading products...</span>
                    </div>
                  </td>
                </tr>

              ) : products.length === 0 ? (

                <tr>
                  <td
                    colSpan={6}
                    className="p-12 text-center text-gray-500 dark:text-gray-400"
                  >
                    <div className="flex flex-col items-center gap-3">

                      <FaBoxOpen className="text-4xl text-gray-300 dark:text-gray-600" />

                      <p className="italic">
                        {searchParamValue
                          ? `No products found for "${searchParamValue}".`
                          : "No products found."}
                      </p>

                    </div>
                  </td>
                </tr>

              ) : (

                products.map((item) => {

                  const displayImage = item.thumbnail

                  return (
                    <tr
                      key={item._id}
                      className="
                        hover:bg-gray-50
                        dark:hover:bg-gray-700/50
                        transition-colors
                        group
                      "
                    >

                      {/* Image */}
                      <td className="p-4 align-middle">

                        <div className="
                          h-12
                          w-12
                          rounded-lg
                          bg-gray-200
                          dark:bg-gray-600
                          overflow-hidden
                          border
                          border-gray-200
                          dark:border-gray-600
                          flex
                          items-center
                          justify-center
                        ">

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

                      {/* Name */}
                      <td className="p-4 align-middle">

                        <div className="font-medium text-gray-900 dark:text-white">
                          {item.name}
                        </div>

                        <div className="text-xs text-gray-500 dark:text-gray-400 max-w-xs truncate">
                          {item.shortDescription || item.slug}
                        </div>

                      </td>

                      {/* Featured */}
                      <td className="p-4 align-middle">

                        <span
                          className={`
                            inline-flex
                            px-2.5
                            py-1
                            rounded-full
                            text-xs
                            font-medium
                            border
                            ${
                              item?.isFeatured
                                ? "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800"
                                : "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
                            }
                          `}
                        >
                          {item?.isFeatured ? "Show" : "Hidden"}
                        </span>

                      </td>

                      {/* Variants */}
                      <td className="p-4 align-middle">

                        <span className="font-semibold text-gray-900 dark:text-gray-100">
                          {item?.variants?.length || 0}
                        </span>

                      </td>

                      {/* Category */}
                      <td className="p-4 align-middle">

                        <span className="
                          px-2.5
                          py-1
                          rounded-full
                          text-xs
                          font-medium
                          border
                          bg-yellow-100
                          text-yellow-800
                          border-yellow-200
                          dark:bg-yellow-900/30
                          dark:text-yellow-300
                          dark:border-yellow-800
                        ">
                          {item?.category?.name || "Uncategorized"}
                        </span>

                      </td>

                      {/* Actions */}
                      <td className="p-4 align-middle text-center">

                        <div className="
                          flex
                          items-center
                          justify-center
                          gap-2
                          opacity-100
                          sm:opacity-0
                          group-hover:opacity-100
                          transition-opacity
                        ">

                          {/* View */}
                          <Link
                            href={`/products/${item.slug}/view`}
                            className="
                              p-2
                              text-blue-600
                              hover:bg-blue-50
                              dark:hover:bg-blue-900/30
                              rounded-full
                              transition-colors
                            "
                            title="View"
                          >
                            <FaEye />
                          </Link>

                          {/* Edit */}
                          <Link
                            href={`/products/${item.slug}/edit`}
                            className="
                              p-2
                              text-blue-600
                              hover:bg-blue-50
                              dark:hover:bg-blue-900/30
                              rounded-full
                              transition-colors
                            "
                            title="Edit"
                          >
                            <FaEdit />
                          </Link>

                          {/* Delete */}
                          <button
                            onClick={() =>
                              handelDeleteProduct(item._id)
                            }
                            className="
                              p-2
                              text-red-600
                              hover:bg-red-50
                              dark:hover:bg-red-900/30
                              rounded-full
                              transition-colors
                            "
                            title="Delete"
                          >
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

        {/* Pagination */}
        <div className="
          bg-gray-50
          dark:bg-gray-800
          p-4
          border-t
          border-gray-200
          dark:border-gray-700
          flex
          flex-col
          sm:flex-row
          items-center
          justify-between
          gap-4
        ">

          <span className="text-sm text-gray-500 dark:text-gray-400">

            Page{" "}

            <span className="font-medium text-gray-900 dark:text-white">
              {currentPage}
            </span>

            {" "}of{" "}

            <span className="font-medium text-gray-900 dark:text-white">
              {totalPages}
            </span>

          </span>

          <div className="flex gap-2">

            {/* Previous */}
            <button
              onClick={handlePrev}
              disabled={currentPage === 1 || loading}
              className="
                flex
                items-center
                px-4
                py-2
                text-sm
                font-medium
                text-gray-700
                bg-white
                dark:bg-gray-700
                dark:text-gray-200
                border
                border-gray-300
                dark:border-gray-600
                rounded-lg
                hover:bg-gray-50
                dark:hover:bg-gray-600
                disabled:opacity-50
                disabled:cursor-not-allowed
                transition-colors
              "
            >
              <FaChevronLeft className="mr-1" />
              Previous
            </button>

            {/* Next */}
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages || loading}
              className="
                flex
                items-center
                px-4
                py-2
                text-sm
                font-medium
                text-gray-700
                bg-white
                dark:bg-gray-700
                dark:text-gray-200
                border
                border-gray-300
                dark:border-gray-600
                rounded-lg
                hover:bg-gray-50
                dark:hover:bg-gray-600
                disabled:opacity-50
                disabled:cursor-not-allowed
                transition-colors
              "
            >
              Next
              <FaChevronRight className="ml-1" />
            </button>

          </div>

        </div>

      </div>

    </div>
  )
}

export default ProductCompo