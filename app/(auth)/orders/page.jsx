"use client";

import { base_url, img_url } from "@/app/components/urls";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const filters = [
  { label: "All", value: "" },
  { label: "Today", value: "today" },
  { label: "Week", value: "week" },
  { label: "Month", value: "month" },
];

const Page = () => {
  const [filter, setFilter] = useState("today");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchOrder = async (filt) => {
    try {
      setLoading(true);
      setError("");

      const url = filt
        ? `${base_url}/order/getall?filterQuery=${filt}`
        : `${base_url}/order/getall`;

      const response = await axios.get(url, {
        withCredentials: true,
      });

      const data = response.data;

      if (data.success) {
        setOrders(Array.isArray(data.orders) ? data.orders : []);
      } else {
        setOrders([]);
        setError(data.message || "Failed to fetch orders");
      }
    } catch (error) {
      console.log(error);
      setOrders([]);
      setError(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder(filter);
  }, [filter]);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusClass = (status) => {
    const value = status?.toLowerCase();

    if (value === "paid" || value === "delivered") {
      return "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400";
    }

    if (value === "pending") {
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-400";
    }

    if (value === "cancelled" || value === "failed") {
      return "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400";
    }

    return "bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-300";
  };

  const getVariantName = (item) => {
    const product = item?.productId;
    const variant = product?.variants?.find(
      (v) => String(v._id) === String(item.variantId)
    );

    return variant?.attributes?.value || "N/A";
  };

  return (
    <div className="min-h-screen bg-[#f8f5ef] px-4 py-6 text-[#2b1710] transition-colors duration-300 dark:bg-[#0f0f0f] dark:text-white md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[#2b1710] dark:text-white">
              Orders
            </h1>

            <p className="mt-1 text-sm text-[#7a6a5d] dark:text-gray-400">
              Manage and view all customer orders
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {filters.map((item) => (
              <button
                key={item.value}
                onClick={() => setFilter(item.value)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                  filter === item.value
                    ? "border-[#5b1f12] bg-[#5b1f12] text-white dark:border-amber-600 dark:bg-amber-600 dark:text-black"
                    : "border-[#d7c7b8] bg-white text-[#5b1f12] hover:bg-[#fff8f0] dark:border-white/10 dark:bg-[#171717] dark:text-gray-300 dark:hover:bg-[#222]"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-[#e4d6c8] bg-white shadow-sm transition-colors duration-300 dark:border-white/10 dark:bg-[#151515] dark:shadow-black/20">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] border-collapse">
              <thead className="bg-[#2b1710] text-white dark:bg-[#050505]">
                <tr>
                  <th className="px-5 py-4 text-left text-sm font-medium">
                    Order ID
                  </th>
                  <th className="px-5 py-4 text-left text-sm font-medium">
                    Products
                  </th>
                  <th className="px-5 py-4 text-left text-sm font-medium">
                    Payment
                  </th>
                  <th className="px-5 py-4 text-left text-sm font-medium">
                    Order Status
                  </th>
                  <th className="px-5 py-4 text-left text-sm font-medium">
                    Amount
                  </th>
                  <th className="px-5 py-4 text-left text-sm font-medium">
                    Date
                  </th>
                  <th className="px-5 py-4 text-center text-sm font-medium">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-5 py-10 text-center text-sm text-gray-500 dark:text-gray-400"
                    >
                      Loading orders...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-5 py-10 text-center text-sm text-red-500 dark:text-red-400"
                    >
                      {error}
                    </td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-5 py-10 text-center text-sm text-gray-500 dark:text-gray-400"
                    >
                      No orders found
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr
                      key={order._id}
                      className="border-b border-[#eee3d7] transition hover:bg-[#fff9f2] dark:border-white/10 dark:hover:bg-white/[0.03]"
                    >
                      <td className="px-5 py-4 align-top">
                        <p className="font-medium text-[#2b1710] dark:text-white">
                          #{order._id?.slice(-8)}
                        </p>
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          {order.trackingId || "No tracking"}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <div className="space-y-3">
                          {order.items?.map((item) => (
                            <div
                              key={item._id}
                              className="flex items-center gap-3"
                            >
                              <img
                                src={`${img_url}${item.productId?.thumbnail}`}
                                alt={item.productId?.name || "Product"}
                                className="h-12 w-12 rounded-lg border border-[#eadfd4] object-cover dark:border-white/10"
                              />

                              <div>
                                <p className="line-clamp-1 max-w-[320px] font-medium text-[#2b1710] dark:text-white">
                                  {item.productId?.name}
                                </p>

                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  Variant: {getVariantName(item)} | Qty:{" "}
                                  {item.quantity}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>

                      <td className="px-5 py-4 align-top">
                        <p className="font-medium text-[#2b1710] dark:text-white">
                          {order.paymentMethod}
                        </p>

                        <span
                          className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                            order.paymentStatus
                          )}`}
                        >
                          {order.paymentStatus}
                        </span>
                      </td>

                      <td className="px-5 py-4 align-top">
                        <span
                          className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                            order.orderStatus
                          )}`}
                        >
                          {order.orderStatus}
                        </span>
                      </td>

                      <td className="px-5 py-4 align-top">
                        <p className="font-semibold text-[#2b1710] dark:text-white">
                          ₹{order.totalPrice}
                        </p>

                        {order.discount > 0 && (
                          <p className="text-xs text-green-600 dark:text-green-400">
                            Discount: ₹{order.discount}
                          </p>
                        )}
                      </td>

                      <td className="px-5 py-4 align-top text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(order.createdAt)}
                      </td>

                      <td className="px-5 py-4 text-center align-top">
                        <Link
                          href={`/orders/${order._id}`}
                          className="inline-flex rounded-full bg-[#5b1f12] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#42150c] dark:bg-amber-600 dark:text-black dark:hover:bg-amber-500"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;