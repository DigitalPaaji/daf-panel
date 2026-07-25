"use client";

import { base_url, img_url } from "@/app/components/urls";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Page = () => {
  const { id } = useParams();
  const router = useRouter();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
 const [toggleOrderTrackingid,setToggleOrderTrackingid]=useState(false)
const [trackingId,setTrackingId]=useState("")


  const fetchOrder = async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError("");

      const response = await axios.get(`${base_url}/order/get/${id}`, {
        withCredentials: true,
      });

      const data = response.data;

      if (data.success) {
        setOrder(data.order);
      } else {
        setOrder(null);
        setError(data.message || "Failed to fetch order");
      }
    } catch (error) {
      console.log(error);
      setOrder(null);
      setError(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

const handleChangeStatus = async (type, value) => {
  try {
    // setStatusLoading(true);

    const response = await axios.patch(
      `${base_url}/order/update/${order._id}`,
      {
        type,
        data: value,
      },
      
    );

    const data = response.data;

    if (data.success) {
        toast.success(data.message)
      setOrder(data.order);
    }
  } catch (error) {
    console.log(error);
  } finally {
    // setStatusLoading(false);
  }
};

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
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

  const getImageUrl = (thumbnail) => {
   
    return `${img_url}${thumbnail}`;
  };

  const getVariant = (item) => {
    const product = item?.productId;

    return product?.variants?.find(
      (variant) => String(variant._id) === String(item.variantId)
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f5ef] px-4 py-8 dark:bg-[#0f0f0f] md:px-8">
        <div className="mx-auto max-w-7xl rounded-2xl border border-[#e4d6c8] bg-white p-10 text-center text-gray-500 dark:border-white/10 dark:bg-[#151515] dark:text-gray-400">
          Loading order details...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f8f5ef] px-4 py-8 dark:bg-[#0f0f0f] md:px-8">
        <div className="mx-auto max-w-7xl rounded-2xl border border-red-200 bg-white p-10 text-center text-red-500 dark:border-red-500/20 dark:bg-[#151515] dark:text-red-400">
          {error}
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#f8f5ef] px-4 py-8 dark:bg-[#0f0f0f] md:px-8">
        <div className="mx-auto max-w-7xl rounded-2xl border border-[#e4d6c8] bg-white p-10 text-center text-gray-500 dark:border-white/10 dark:bg-[#151515] dark:text-gray-400">
          No order found
        </div>
      </div>
    );
  }

  const address = order.address;

  return (
    <div className="min-h-screen bg-[#f8f5ef] px-4 py-6 text-[#2b1710] dark:bg-[#0f0f0f] dark:text-white md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <button
              onClick={() => router.back()}
              className="mb-3 text-sm font-medium text-[#5b1f12] hover:underline dark:text-amber-500"
            >
              ← Back to Orders
            </button>

            <h1 className="text-2xl font-semibold text-[#2b1710] dark:text-white">
              Order Details
            </h1>

            <p className="mt-1 text-sm text-[#7a6a5d] dark:text-gray-400">
              Order ID: #{order._id}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <span
              className={`rounded-full px-4 py-2 text-sm font-medium ${getStatusClass(
                order.orderStatus
              )}`}
            >
              {order.orderStatus}
            </span>

            <span
              className={`rounded-full px-4 py-2 text-sm font-medium ${getStatusClass(
                order.paymentStatus
              )}`}
            >
              {order.paymentStatus}
            </span>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="overflow-hidden rounded-2xl border border-[#e4d6c8] bg-white shadow-sm dark:border-white/10 dark:bg-[#151515]">
              <div className="border-b border-[#eee3d7] px-5 py-4 dark:border-white/10">
                <h2 className="text-lg font-semibold text-[#2b1710] dark:text-white">
                  Products
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[750px] border-collapse">
                  <thead className="bg-[#fff8f0] dark:bg-[#050505]">
                    <tr>
                      <th className="px-5 py-4 text-left text-sm font-medium text-[#5b1f12] dark:text-gray-300">
                        Product
                      </th>
                      <th className="px-5 py-4 text-left text-sm font-medium text-[#5b1f12] dark:text-gray-300">
                        Variant
                      </th>
                      <th className="px-5 py-4 text-left text-sm font-medium text-[#5b1f12] dark:text-gray-300">
                        Price
                      </th>
                      <th className="px-5 py-4 text-left text-sm font-medium text-[#5b1f12] dark:text-gray-300">
                        Qty
                      </th>
                      <th className="px-5 py-4 text-right text-sm font-medium text-[#5b1f12] dark:text-gray-300">
                        Total
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {order.items?.map((item) => {
                      const variant = getVariant(item);
                      const price = variant?.mrp || 0;
                      const total = price * item.quantity;

                      return (
                        <tr
                          key={item._id}
                          className="border-b border-[#eee3d7] last:border-b-0 dark:border-white/10"
                        >
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={getImageUrl(item.productId?.thumbnail)}
                                alt={item.productId?.name || "Product"}
                                className="h-16 w-16 rounded-xl border border-[#eadfd4] object-cover dark:border-white/10"
                              />

                              <div>
                                <p className="font-medium text-[#2b1710] dark:text-white">
                                  {item.productId?.name}
                                </p>

                                <p className="mt-1 line-clamp-1 max-w-[300px] text-xs text-gray-500 dark:text-gray-400">
                                  {item.productId?.shortDescription}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400">
                            <p>{variant?.attributes?.value || "N/A"}</p>
                            <p className="mt-1 text-xs">SKU: {variant?.sku || "N/A"}</p>
                          </td>

                          <td className="px-5 py-4 text-sm font-medium text-[#2b1710] dark:text-white">
                            ₹{price}
                          </td>

                          <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400">
                            {item.quantity}
                          </td>

                          <td className="px-5 py-4 text-right text-sm font-semibold text-[#2b1710] dark:text-white">
                            ₹{total}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-2xl border border-[#e4d6c8] bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#151515]">
              <h2 className="mb-4 text-lg font-semibold text-[#2b1710] dark:text-white">
                Shipping Address
              </h2>

              {address ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  <Info label="Name" value={`${address.firstName} ${address.lastName}`} />
                  <Info label="Phone" value={address.phone} />
                  <Info label="House No." value={address.houseNo} />
                  <Info label="Area" value={address.area} />
                  <Info label="City" value={address.city} />
                  <Info label="State" value={address.state} />
                  <Info label="Pincode" value={address.pincode} />
                  <Info label="Address Type" value={address.addressType} />

                  {address.landmark && (
                    <Info label="Landmark" value={address.landmark} />
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Address not available
                </p>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-[#e4d6c8] bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#151515]">
              <h2 className="mb-4 text-lg font-semibold text-[#2b1710] dark:text-white">
                Order Summary
              </h2>

              <div className="space-y-3">
                <SummaryRow label="Order Date" value={formatDate(order.createdAt)} />
                <SummaryRow label="Payment Method" value={order.paymentMethod} />


<div className="flex items-center justify-between gap-4">
  <p className="text-sm text-gray-500 dark:text-gray-400">Tracking ID</p>

  <div className="flex items-center gap-2">
    {toggleOrderTrackingid ? (
      <>
        <input
          type="text"
          placeholder="Tracking ID..."
          value={trackingId}
          onChange={(e) => setTrackingId(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleChangeStatus("trackingId", trackingId);
              setToggleOrderTrackingid(false);
            }

            if (e.key === "Escape") {
              setTrackingId(order.trackingId || "");
              setToggleOrderTrackingid(false);
            }
          }}
          className="w-44 rounded-lg border border-[#e4d6c8] bg-white px-3 py-2 text-sm text-[#2b1710] outline-none focus:border-[#5b1f12] dark:border-white/10 dark:bg-[#0f0f0f] dark:text-white dark:focus:border-amber-500"
        />

        <button
          onClick={() => {
            handleChangeStatus("trackingId", trackingId);
            setToggleOrderTrackingid(false);
          }}
          className="rounded-lg bg-[#5b1f12] px-3 py-2 text-sm font-medium text-white hover:bg-[#42150c] dark:bg-amber-600 dark:text-black dark:hover:bg-amber-500"
        >
          Save
        </button>

        <button
          onClick={() => {
            setTrackingId(order.trackingId || "");
            setToggleOrderTrackingid(false);
          }}
          className="rounded-lg border border-[#e4d6c8] px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/5"
        >
          Cancel
        </button>
      </>
    ) : order.trackingId ? (
      <>
        <p className="text-sm font-medium text-[#2b1710] dark:text-white">
          {order.trackingId}
        </p>

        <button
          onClick={() => {
            setTrackingId(order.trackingId || "");
            setToggleOrderTrackingid(true);
          }}
          className="text-sm font-medium text-[#5b1f12] hover:underline dark:text-amber-500"
        >
          Edit
        </button>
      </>
    ) : (
      <button
        onClick={() => {
          setTrackingId("");
          setToggleOrderTrackingid(true);
        }}
        className="text-sm font-medium text-[#5b1f12] hover:underline dark:text-amber-500"
      >
        Add
      </button>
    )}
  </div>
</div>

                {/* <SummaryRow label="Tracking ID" value={order.trackingId || "Not added"} /> */}



              </div>
            </div>

            <div className="rounded-2xl border border-[#e4d6c8] bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#151515]">
              <h2 className="mb-4 text-lg font-semibold text-[#2b1710] dark:text-white">
                Payment Summary
              </h2>

              <div className="space-y-3">
                <SummaryRow label="Price" value={`₹${order.price}`} />
                <SummaryRow label="Discount" value={`₹${order.discount}`} />
                <div className="border-t border-[#eee3d7] pt-3 dark:border-white/10">
                  <SummaryRow
                    label="Total"
                    value={`₹${order.totalPrice}`}
                    strong
                  />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[#e4d6c8] bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#151515]">
              <h2 className="mb-4 text-lg font-semibold text-[#2b1710] dark:text-white">
                Status
              </h2>

              <div className="space-y-3">
                <div>
                  <p className="mb-1 text-xs text-gray-500 dark:text-gray-400">
                    Order Status
                  </p>


<select
  value={order.orderStatus}
//   disabled={statusLoading}
  onChange={(e) => handleChangeStatus("orderStatus", e.target.value)}
  className="w-full rounded-xl border border-[#e4d6c8] bg-white px-4 py-3 text-sm font-medium text-[#2b1710] outline-none transition focus:border-[#5b1f12] dark:border-white/10 dark:bg-[#0f0f0f] dark:text-white dark:focus:border-amber-500"
>
  {[
    "Pending",
    "Confirmed",
    "Shipped",
    "Out for Delivery",
    "Delivered",
    "Cancelled",
  ].map((item) => (
    <option value={item} key={item}>
      {item}
    </option>
  ))}
</select>

                  {/* <span
                    className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                      order.orderStatus
                    )}`}
                  >
                    {order.orderStatus}
                  </span> */}
                </div>

                <div>
                  <p className="mb-1 text-xs text-gray-500 dark:text-gray-400">
                    Payment Status
                  </p>


<select
  value={order.paymentStatus}
//   disabled={statusLoading}
  onChange={(e) => handleChangeStatus("paymentStatus", e.target.value)}
  className="w-full rounded-xl border border-[#e4d6c8] bg-white px-4 py-3 text-sm font-medium text-[#2b1710] outline-none transition focus:border-[#5b1f12] dark:border-white/10 dark:bg-[#0f0f0f] dark:text-white dark:focus:border-amber-500"
>
  { ["Pending", "Paid", "Failed", "Refunded"].map((item) => (
    <option value={item} key={item}>
      {item}
    </option>
  ))}
</select>


                  {/* <span
                    className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                      order.paymentStatus
                    )}`}
                  >
                    {order.paymentStatus}
                  </span> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Info = ({ label, value }) => {
  return (
    <div>
      <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
      <p className="mt-1 font-medium text-[#2b1710] dark:text-white">
        {value || "N/A"}
      </p>
    </div>
  );
};

const SummaryRow = ({ label, value, strong }) => {
  return (
    <div className="flex items-center justify-between gap-4">
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      <p
        className={`text-sm ${
          strong
            ? "text-lg font-bold text-[#2b1710] dark:text-white"
            : "font-medium text-[#2b1710] dark:text-white"
        }`}
      >
        {value || "N/A"}
      </p>
    </div>
  );
};

export default Page;