"use client";

import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import {
  FiBriefcase,
  FiCheckCircle,
  FiLoader,
  FiMessageSquare,
  FiRefreshCw,
  FiSend,
  FiUser,
} from "react-icons/fi";
import { base_url } from "./urls";
import { MdDelete } from "react-icons/md";
import { toast } from "react-toastify";

const initialForm = {
  name: "",
  des: "",
  work: "",
};

const ReviewSection = ({ productid }) => {
  const [reviews, setReviews] = useState([]);
  const [reviewData, setReviewData] = useState(initialForm);

  const [fetchLoading, setFetchLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleInput = (event) => {
    const { name, value } = event.target;

    setReviewData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (error) setError("");
    if (successMessage) setSuccessMessage("");
  };

  const fetchReviews = useCallback(async () => {
    if (!productid) {
      setFetchLoading(false);
      return;
    }

    try {
      setFetchLoading(true);
      setError("");

      const response = await axios.get(
        `${base_url}/review/get/${productid}`
      );

      setReviews(response.data?.reviews || []);
    } catch (error) {
      console.error("Fetch reviews error:", error);

      setError(
        error?.response?.data?.message ||
          "Unable to load reviews."
      );
    } finally {
      setFetchLoading(false);
    }
  }, [productid]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleAddReview = async (event) => {
    event.preventDefault();

    if (!productid) {
      setError("Product ID is missing.");
      return;
    }

    const cleanData = {
      productid,
      name: reviewData.name.trim(),
      des: reviewData.des.trim(),
      work: reviewData.work.trim(),
    };

    if (
      !cleanData.name ||
      !cleanData.des ||
      !cleanData.work
    ) {
      setError("Please complete all fields.");
      return;
    }

    try {
      setSubmitLoading(true);
      setError("");
      setSuccessMessage("");

      const response = await axios.post(
        `${base_url}/review/create`,
        cleanData
      );

      const createdReview = response.data?.review;

      if (createdReview) {
        setReviews((previous) => [
          createdReview,
          ...previous,
        ]);
      } else {
        await fetchReviews();
      }

      setReviewData(initialForm);
      setSuccessMessage(
        response.data?.message ||
          "Your review has been submitted."
      );
    } catch (error) {
      console.error("Create review error:", error);

      setError(
        error?.response?.data?.message ||
          "Unable to submit your review."
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "";

    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(date));
  };

  const getInitial = (name = "") => {
    return name.trim().charAt(0).toUpperCase() || "U";
  };

  const handelDeleteReview=async(productid)=>{
    try {
        const response = await axios.delete(`${base_url}/review/delete/${productid}`);
        const data = await response.data;
        if(data.success){
           const revi= reviews.filter((item)=>item._id !=productid )
           setReviews(revi)
           toast.success(data.message)
        }else{
            toast.error(data.message)
        }
    } catch (error) {
        toast.error(error.response.data.message)
        
    }
  }

  return (
    <section className="bg-[#fff9e6]  transition-colors duration-300 dark:bg-neutral-950 ">
      <div className="mx-auto ">
      

        <div className="">
          {/* Review form */}
          <div className="rounded-[26px] border border-neutral-200 bg-white p-5 shadow-[0_20px_70px_rgba(70,25,18,0.07)] dark:border-neutral-800 dark:bg-neutral-900 sm:p-7 lg:sticky lg:top-24">
          

            {error && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
                {error}
              </div>
            )}

            {successMessage && (
              <div className="mb-5 flex items-start gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-900/60 dark:bg-green-950/40 dark:text-green-300">
                <FiCheckCircle className="mt-0.5 shrink-0" />
                {successMessage}
              </div>
            )}

            <form
              onSubmit={handleAddReview}
              className="space-y-5"
            >
              <div>
                <label
                  htmlFor="review-name"
                  className="mb-2 block text-sm font-semibold text-neutral-800 dark:text-neutral-200"
                >
                  Your name
                </label>

                <div className="relative">
                  <FiUser className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />

                  <input
                    required
                    type="text"
                    id="review-name"
                    name="name"
                    value={reviewData.name}
                    onChange={handleInput}
                    maxLength={100}
                    placeholder="Enter your name"
                    className="h-12 w-full rounded-xl border border-neutral-200 bg-[#fffdf8] pl-11 pr-4 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-[#62080d] focus:ring-2 focus:ring-[#62080d]/10 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white dark:focus:border-[#e7a4a8] dark:focus:ring-[#e7a4a8]/10"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="review-work"
                  className="mb-2 block text-sm font-semibold text-neutral-800 dark:text-neutral-200"
                >
                  Profession or role
                </label>

                <div className="relative">
                  <FiBriefcase className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />

                  <input
                    required
                    type="text"
                    id="review-work"
                    name="work"
                    value={reviewData.work}
                    onChange={handleInput}
                    maxLength={150}
                    placeholder="Example: Chef, Designer"
                    className="h-12 w-full rounded-xl border border-neutral-200 bg-[#fffdf8] pl-11 pr-4 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-[#62080d] focus:ring-2 focus:ring-[#62080d]/10 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white dark:focus:border-[#e7a4a8] dark:focus:ring-[#e7a4a8]/10"
                  />
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label
                    htmlFor="review-description"
                    className="text-sm font-semibold text-neutral-800 dark:text-neutral-200"
                  >
                    Your review
                  </label>

                  <span className="text-[11px] text-neutral-400">
                    {reviewData.des.length}/1000
                  </span>
                </div>

                <textarea
                  required
                  id="review-description"
                  name="des"
                  rows={5}
                  maxLength={1000}
                  value={reviewData.des}
                  onChange={handleInput}
                  placeholder="Tell us what you liked about this product..."
                  className="w-full resize-none rounded-xl border border-neutral-200 bg-[#fffdf8] px-4 py-3 text-sm leading-6 text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-[#62080d] focus:ring-2 focus:ring-[#62080d]/10 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white dark:focus:border-[#e7a4a8] dark:focus:ring-[#e7a4a8]/10"
                />
              </div>

              <button
                type="submit"
                disabled={submitLoading || !productid}
                className="flex h-13 w-full items-center justify-center gap-2 rounded-full bg-[#52070a] px-6 py-3.5 text-sm font-semibold uppercase tracking-[0.1em] text-white transition hover:-translate-y-0.5 hover:bg-[#350305] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {submitLoading ? (
                  <>
                    <FiLoader className="animate-spin text-lg" />
                    Submitting
                  </>
                ) : (
                  <>
                    <FiSend className="text-lg" />
                    Submit review
                  </>
                )}
              </button>
            </form>
          </div>

     
          
        </div>
      </div>
      <div>
            {fetchLoading ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="animate-pulse rounded-3xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-neutral-200 dark:bg-neutral-800" />

                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-28 rounded bg-neutral-200 dark:bg-neutral-800" />
                        <div className="h-3 w-20 rounded bg-neutral-200 dark:bg-neutral-800" />
                      </div>
                    </div>

                    <div className="mt-6 space-y-2">
                      <div className="h-3 w-full rounded bg-neutral-200 dark:bg-neutral-800" />
                      <div className="h-3 w-5/6 rounded bg-neutral-200 dark:bg-neutral-800" />
                      <div className="h-3 w-3/5 rounded bg-neutral-200 dark:bg-neutral-800" />
                    </div>
                  </div>
                ))}
              </div>
            ) : reviews.length === 0 ? (
              <div className="flex min-h-[360px] flex-col items-center justify-center rounded-[28px] border border-dashed border-neutral-300 bg-white/60 px-6 text-center dark:border-neutral-700 dark:bg-neutral-900/60">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#52070a]/10 text-2xl text-[#52070a] dark:bg-[#e7a4a8]/10 dark:text-[#e7a4a8]">
                  <FiMessageSquare />
                </span>

                <h3 className="mt-5 font-serif text-2xl text-neutral-900 dark:text-white">
                  No reviews yet
                </h3>

                <p className="mt-2 max-w-sm text-sm leading-6 text-neutral-500 dark:text-neutral-400">
                  Be the first customer to share an
                  experience with this product.
                </p>
              </div>
            ) : (
              <div className=" grid  mt-3 gap-3">
                {reviews.map((review) => (
                  <article
                    key={review._id}
                    className="group relative flex h-full flex-col rounded-[24px] border border-neutral-200 bg-white p-5 shadow-[0_12px_45px_rgba(70,25,18,0.04)] transition duration-300 hover:-translate-y-1 hover:border-[#62080d]/30 hover:shadow-[0_22px_65px_rgba(70,25,18,0.09)] dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-[#e7a4a8]/40 sm:p-6"
                  >
                        <MdDelete  onClick={()=>handelDeleteReview(review._id)} className="absolute  right-3 bottom-4 text-[#b3070f] cursor-pointer text-xl " />                 
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#62080d] to-[#260102] font-serif text-lg font-semibold text-white">
                          {getInitial(review.name)}
                        </div>

                        <div className="min-w-0">
                          <h3 className="truncate font-semibold capitalize text-neutral-900 dark:text-white">
                            {review.name}
                          </h3>

                          <p className="mt-0.5 flex items-center gap-1.5 truncate text-xs text-neutral-500 dark:text-neutral-400">
                            <FiBriefcase className="shrink-0" />
                            {review.work}
                          </p>
                        </div>
                      </div>

                      <FiMessageSquare className="shrink-0 text-xl text-[#62080d]/25 transition group-hover:text-[#62080d] dark:text-[#e7a4a8]/30 dark:group-hover:text-[#e7a4a8]" />
                    </div>

                    <p className="mt-5 flex-1 break-words text-sm leading-7 text-neutral-600 dark:text-neutral-300">
                      “{review.des}”
                    </p>

                    <div className="mt-5 border-t border-neutral-100 pt-4 text-[11px] text-neutral-400 dark:border-neutral-800">
                      {formatDate(review.createdAt)}
                    </div>
                  </article>
                ))}
              </div>
            )}

            {!fetchLoading && reviews.length > 0 && (
              <button
                type="button"
                onClick={fetchReviews}
                className="mx-auto mt-7 flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-5 py-2.5 text-xs font-semibold text-neutral-700 transition hover:border-[#62080d] hover:text-[#62080d] dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-[#e7a4a8] dark:hover:text-[#e7a4a8]"
              >
                <FiRefreshCw />
                Refresh reviews
              </button>
            )}
          </div>
    </section>
  );
};

export default ReviewSection;