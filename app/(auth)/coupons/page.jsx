"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FaCalendarAlt,
  FaHashtag,
  FaPercent,
  FaRupeeSign,
  FaSave,
  FaTicketAlt,
  FaTrashAlt,
  FaUsers,
} from "react-icons/fa";
import {
  FiFileText,
  FiLoader,
  FiRefreshCw,
} from "react-icons/fi";
import { base_url } from "@/app/components/urls";

const initialForm = {
  code: "",
  description: "",
  discountType: "percentage",
  discountValue: "",
  minPurchase: "",
  maxDiscount: "",
  validFrom: "",
  validTill: "",
  usageLimit: "",
  perUserLimit: "1",
  isActive: true,
};

const Page = () => {
  const [formData, setFormData] = useState(initialForm);

  const [coupons, setCoupons] = useState([]);

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState("");

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const fetchCoupon = async () => {
    try {
      setFetchLoading(true);

      const response = await axios.get(
        `${base_url}/coupon/getall`,
        {
          withCredentials: true,
        }
      );

      const couponList = Array.isArray(response.data?.coupons)
        ? response.data.coupons
        : [];

      setCoupons(couponList);
    } catch (error) {
      setCoupons([]);

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch coupons"
      );
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupon();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.code.trim()) {
      return toast.error("Coupon code is required");
    }

    if (!formData.discountValue) {
      return toast.error("Discount value is required");
    }

    if (!formData.validFrom || !formData.validTill) {
      return toast.error("Coupon validity dates are required");
    }

    if (
      new Date(formData.validTill) <=
      new Date(formData.validFrom)
    ) {
      return toast.error(
        "Valid till date must be after valid from date"
      );
    }

    if (
      formData.discountType === "percentage" &&
      Number(formData.discountValue) > 100
    ) {
      return toast.error(
        "Percentage discount cannot be greater than 100%"
      );
    }

    try {
      setLoading(true);

      const payload = {
        code: formData.code.trim().toUpperCase(),
        description: formData.description.trim(),
        discountType: formData.discountType,
        discountValue: Number(formData.discountValue),
        minPurchase: Number(formData.minPurchase || 0),

        maxDiscount: formData.maxDiscount
          ? Number(formData.maxDiscount)
          : null,

        validFrom: formData.validFrom,
        validTill: formData.validTill,

        usageLimit: formData.usageLimit
          ? Number(formData.usageLimit)
          : null,

        perUserLimit: Number(
          formData.perUserLimit || 1
        ),

        isActive: formData.isActive,
      };

      const response = await axios.post(
        `${base_url}/coupon/create`,
        payload,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast.success(
        response.data?.message ||
          "Coupon created successfully"
      );

      setFormData(initialForm);

      await fetchCoupon();
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to create coupon"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (couponId, couponCode) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete coupon "${couponCode}"?`
    );

    if (!confirmed) return;

    try {
      setDeleteLoading(couponId);

      const response = await axios.delete(
        `${base_url}/coupon/delete/${couponId}`,
        {
          withCredentials: true,
        }
      );

      toast.success(
        response.data?.message ||
          "Coupon deleted successfully"
      );

      setCoupons((prev) =>
        prev.filter(
          (coupon) => coupon._id !== couponId
        )
      );
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to delete coupon"
      );
    } finally {
      setDeleteLoading("");
    }
  };

  const formatPrice = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(value || 0));
  };

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getCouponStatus = (coupon) => {
    const currentDate = new Date();
    const validFrom = new Date(coupon.validFrom);
    const validTill = new Date(coupon.validTill);

    if (!coupon.isActive) {
      return {
        text: "Inactive",
        className:
          "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200",
      };
    }

    if (currentDate < validFrom) {
      return {
        text: "Scheduled",
        className:
          "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
      };
    }

    if (currentDate > validTill) {
      return {
        text: "Expired",
        className:
          "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400",
      };
    }

    if (
      coupon.usageLimit &&
      coupon.usedCount >= coupon.usageLimit
    ) {
      return {
        text: "Limit reached",
        className:
          "bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400",
      };
    }

    return {
      text: "Active",
      className:
        "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400",
    };
  };

  const inputClass =
    "w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-indigo-400";

  const labelClass =
    "mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200";

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-8 dark:bg-gray-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-7">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/20">
            <FaTicketAlt size={22} />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
            Coupon Management
          </h1>

          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Create, view and delete discount coupons.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
        >
          <div className="border-b border-gray-200 px-5 py-5 dark:border-gray-800 sm:px-7">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                <FaPercent size={18} />
              </div>

              <div>
                <h2 className="font-semibold text-gray-900 dark:text-white">
                  Create Coupon
                </h2>

                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Enter coupon details and usage limits.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-2">
            <div>
              <label
                htmlFor="code"
                className={labelClass}
              >
                Coupon code
              </label>

              <div className="relative">
                <FaHashtag className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                <input
                  id="code"
                  name="code"
                  type="text"
                  value={formData.code}
                  onChange={handleChange}
                  placeholder="WELCOME20"
                  className={`${inputClass} pl-11 uppercase`}
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="discountType"
                className={labelClass}
              >
                Discount type
              </label>

              <select
                id="discountType"
                name="discountType"
                value={formData.discountType}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="percentage">
                  Percentage
                </option>

                <option value="fixed">
                  Fixed amount
                </option>
              </select>
            </div>

            <div>
              <label
                htmlFor="discountValue"
                className={labelClass}
              >
                Discount value
              </label>

              <div className="relative">
                {formData.discountType ===
                "percentage" ? (
                  <FaPercent className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                ) : (
                  <FaRupeeSign className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                )}

                <input
                  id="discountValue"
                  name="discountValue"
                  type="number"
                  min="1"
                  max={
                    formData.discountType ===
                    "percentage"
                      ? "100"
                      : undefined
                  }
                  value={formData.discountValue}
                  onChange={handleChange}
                  placeholder={
                    formData.discountType ===
                    "percentage"
                      ? "20"
                      : "500"
                  }
                  className={`${inputClass} pl-11`}
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="minPurchase"
                className={labelClass}
              >
                Minimum purchase
              </label>

              <div className="relative">
                <FaRupeeSign className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                <input
                  id="minPurchase"
                  name="minPurchase"
                  type="number"
                  min="0"
                  value={formData.minPurchase}
                  onChange={handleChange}
                  placeholder="1000"
                  className={`${inputClass} pl-11`}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="maxDiscount"
                className={labelClass}
              >
                Maximum discount
              </label>

              <div className="relative">
                <FaRupeeSign className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                <input
                  id="maxDiscount"
                  name="maxDiscount"
                  type="number"
                  min="0"
                  value={formData.maxDiscount}
                  onChange={handleChange}
                  placeholder="500"
                  className={`${inputClass} pl-11`}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="usageLimit"
                className={labelClass}
              >
                Total usage limit
              </label>

              <div className="relative">
                <FaUsers className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                <input
                  id="usageLimit"
                  name="usageLimit"
                  type="number"
                  min="1"
                  value={formData.usageLimit}
                  onChange={handleChange}
                  placeholder="100"
                  className={`${inputClass} pl-11`}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="perUserLimit"
                className={labelClass}
              >
                Per-user usage limit
              </label>

              <div className="relative">
                <FaUsers className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                <input
                  id="perUserLimit"
                  name="perUserLimit"
                  type="number"
                  min="1"
                  value={formData.perUserLimit}
                  onChange={handleChange}
                  placeholder="1"
                  className={`${inputClass} pl-11`}
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="validFrom"
                className={labelClass}
              >
                Valid from
              </label>

              <div className="relative">
                <FaCalendarAlt className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                <input
                  id="validFrom"
                  name="validFrom"
                  type="date"
                  value={formData.validFrom}
                  onChange={handleChange}
                  className={`${inputClass} pl-11`}
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="validTill"
                className={labelClass}
              >
                Valid till
              </label>

              <div className="relative">
                <FaCalendarAlt className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                <input
                  id="validTill"
                  name="validTill"
                  type="date"
                  min={
                    formData.validFrom || undefined
                  }
                  value={formData.validTill}
                  onChange={handleChange}
                  className={`${inputClass} pl-11`}
                  required
                />
              </div>
            </div>

            <div className="lg:col-span-2">
              <label
                htmlFor="description"
                className={labelClass}
              >
                Description
              </label>

              <div className="relative">
                <FiFileText className="pointer-events-none absolute left-4 top-4 text-gray-400" />

                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Get 20% off on orders above ₹1,000"
                  className={`${inputClass} resize-none pl-11`}
                />
              </div>
            </div>

            <div className="lg:col-span-2">
              <label className="flex cursor-pointer items-center justify-between rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-950">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    Coupon active
                  </p>

                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Customers can use this coupon
                    after creation.
                  </p>
                </div>

                <div className="relative">
                  <input
                    name="isActive"
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="peer sr-only"
                  />

                  <div className="h-7 w-12 rounded-full bg-gray-300 transition peer-checked:bg-indigo-600 dark:bg-gray-700" />

                  <div className="absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
                </div>
              </label>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-gray-200 bg-gray-50 px-5 py-5 dark:border-gray-800 dark:bg-gray-900 sm:flex-row sm:justify-end sm:px-7">
            <button
              type="button"
              disabled={loading}
              onClick={() =>
                setFormData(initialForm)
              }
              className="rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              Reset
            </button>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-indigo-500 dark:hover:bg-indigo-600"
            >
              {loading ? (
                <>
                  <FiLoader
                    className="animate-spin"
                    size={18}
                  />
                  Creating...
                </>
              ) : (
                <>
                  <FaSave size={16} />
                  Create Coupon
                </>
              )}
            </button>
          </div>
        </form>

        <section className="mt-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="flex flex-col gap-4 border-b border-gray-200 px-5 py-5 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between sm:px-7">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                All Coupons
              </h2>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {coupons.length} coupon
                {coupons.length === 1 ? "" : "s"} found
              </p>
            </div>

            <button
              type="button"
              onClick={fetchCoupon}
              disabled={fetchLoading}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              <FiRefreshCw
                className={
                  fetchLoading ? "animate-spin" : ""
                }
              />

              Refresh
            </button>
          </div>

          {fetchLoading ? (
            <div className="flex min-h-64 flex-col items-center justify-center gap-3">
              <FiLoader
                size={28}
                className="animate-spin text-indigo-600 dark:text-indigo-400"
              />

              <p className="text-sm text-gray-500 dark:text-gray-400">
                Loading coupons...
              </p>
            </div>
          ) : coupons.length === 0 ? (
            <div className="flex min-h-64 flex-col items-center justify-center px-5 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-400 dark:bg-gray-800">
                <FaTicketAlt size={22} />
              </div>

              <h3 className="font-semibold text-gray-900 dark:text-white">
                No coupons found
              </h3>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Create your first coupon using the form
                above.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px] border-collapse text-left">
                <thead className="bg-gray-50 dark:bg-gray-950">
                  <tr>
                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Coupon
                    </th>

                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Discount
                    </th>

                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Purchase rule
                    </th>

                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Validity
                    </th>

                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Usage
                    </th>

                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Status
                    </th>

                    <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {coupons.map((coupon) => {
                    const status =
                      getCouponStatus(coupon);

                    return (
                      <tr
                        key={coupon._id}
                        className="transition hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                              <FaTicketAlt />
                            </div>

                            <div>
                              <p className="font-bold text-gray-900 dark:text-white">
                                {coupon.code}
                              </p>

                              <p className="mt-1 max-w-56 text-xs leading-5 text-gray-500 dark:text-gray-400">
                                {coupon.description ||
                                  "No description"}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {coupon.discountType ===
                            "percentage"
                              ? `${coupon.discountValue}%`
                              : formatPrice(
                                  coupon.discountValue
                                )}
                          </p>

                          <p className="mt-1 text-xs capitalize text-gray-500 dark:text-gray-400">
                            {coupon.discountType}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <p className="text-sm text-gray-700 dark:text-gray-200">
                            Min:{" "}
                            <span className="font-semibold">
                              {formatPrice(
                                coupon.minPurchase
                              )}
                            </span>
                          </p>

                          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            Max discount:{" "}
                            {coupon.maxDiscount
                              ? formatPrice(
                                  coupon.maxDiscount
                                )
                              : "No limit"}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <p className="text-sm text-gray-700 dark:text-gray-200">
                            {formatDate(
                              coupon.validFrom
                            )}
                          </p>

                          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            to{" "}
                            {formatDate(
                              coupon.validTill
                            )}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            {coupon.usedCount || 0}
                            {" / "}
                            {coupon.usageLimit ||
                              "Unlimited"}
                          </p>

                          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            Per user:{" "}
                            {coupon.perUserLimit || 1}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${status.className}`}
                          >
                            {status.text}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-right">
                          <button
                            type="button"
                            title="Delete coupon"
                            disabled={
                              deleteLoading ===
                              coupon._id
                            }
                            onClick={() =>
                              handleDelete(
                                coupon._id,
                                coupon.code
                              )
                            }
                            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-600 transition hover:bg-red-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-60 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-600 dark:hover:text-white"
                          >
                            {deleteLoading ===
                            coupon._id ? (
                              <FiLoader className="animate-spin" />
                            ) : (
                              <FaTrashAlt size={15} />
                            )}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default Page;

