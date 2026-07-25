"use client";

import { base_url, img_url } from "@/app/components/urls";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Page = () => {
  const [search, setSearch] = useState("");
  const [allSearch, setAllSearch] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [video, setVideo] = useState(null);

  const [videos, setVideos] = useState([]);

  const [searchLoading, setSearchLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [videosLoading, setVideosLoading] = useState(true);
  const [deletingVideoId, setDeletingVideoId] = useState(null);

  // Get all uploaded videos
  const fetchVideos = async () => {
    try {
      setVideosLoading(true);

      const response = await axios.get(`${base_url}/video/getall`);

      if (response.data?.success) {
        setVideos(response.data.videos || []);
      } else {
        setVideos([]);
      }
    } catch (error) {
      console.error("Fetch videos error:", error);

      toast.error(
        error.response?.data?.message || "Failed to fetch videos."
      );

      setVideos([]);
    } finally {
      setVideosLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  // Product search with debounce
  useEffect(() => {
    const searchValue = search.trim();

    if (searchValue.length < 3) {
      setAllSearch([]);
      setSearchLoading(false);
      return;
    }

    const controller = new AbortController();

    const timer = setTimeout(async () => {
      try {
        setSearchLoading(true);

        const response = await axios.get(
          `${base_url}/products/search/${encodeURIComponent(searchValue)}`,
          {
            signal: controller.signal,
          }
        );

        if (response.data?.success) {
          setAllSearch(response.data.products || []);
        } else {
          setAllSearch([]);
        }
      } catch (error) {
        if (error?.code !== "ERR_CANCELED") {
          console.error("Product search error:", error);
          setAllSearch([]);
        }
      } finally {
        setSearchLoading(false);
      }
    }, 500);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [search]);

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setSearch("");
    setAllSearch([]);
  };

  const handleRemoveProduct = () => {
    setSelectedProduct(null);
  };

  const handleVideoChange = (event) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      setVideo(null);
      return;
    }

    if (!selectedFile.type.startsWith("video/")) {
      toast.error("Please select a valid video file.");
      event.target.value = "";
      setVideo(null);
      return;
    }

    const maximumSize = 100 * 1024 * 1024;

    if (selectedFile.size > maximumSize) {
      toast.error("Video size must be less than 100 MB.");
      event.target.value = "";
      setVideo(null);
      return;
    }

    setVideo(selectedFile);
  };

  const clearFileInput = () => {
    setVideo(null);

    const input = document.getElementById("product-video");

    if (input) {
      input.value = "";
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedProduct?._id) {
      toast.error("Please select a product.");
      return;
    }

    if (!video) {
      toast.error("Please select a video.");
      return;
    }

    try {
      setSubmitLoading(true);

      const formData = new FormData();

      formData.append("video", video);
      formData.append("productid", selectedProduct._id);

      const response = await axios.post(
        `${base_url}/video/create`,
        formData
      );

      if (response.data?.success) {
        toast.success(
          response.data?.message || "Video uploaded successfully."
        );

        setSearch("");
        setAllSearch([]);
        setSelectedProduct(null);
        clearFileInput();

        // Refresh video list after upload
        await fetchVideos();
      } else {
        toast.error(
          response.data?.message || "Failed to upload video."
        );
      }
    } catch (error) {
      console.error("Video upload error:", error);

      toast.error(
        error.response?.data?.message ||
          "Something went wrong while uploading the video."
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeleteVideo = async (videoId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this video?"
    );

    if (!confirmed) return;

    try {
      setDeletingVideoId(videoId);

      const response = await axios.delete(
        `${base_url}/video/delete/${videoId}`
      );

      if (response.data?.success) {
        toast.success(
          response.data?.message || "Video deleted successfully."
        );

        // Remove deleted video immediately from the UI
        setVideos((previousVideos) =>
          previousVideos.filter((item) => item._id !== videoId)
        );
      } else {
        toast.error(
          response.data?.message || "Failed to delete video."
        );
      }
    } catch (error) {
      console.error("Delete video error:", error);

      toast.error(
        error.response?.data?.message ||
          "Something went wrong while deleting the video."
      );
    } finally {
      setDeletingVideoId(null);
    }
  };

  const getMediaUrl = (mediaPath) => {
    if (!mediaPath) return "/placeholder.webp";

    if (
      mediaPath.startsWith("http://") ||
      mediaPath.startsWith("https://")
    ) {
      return mediaPath;
    }

    return `${img_url}${mediaPath}`;
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
      {/* Upload form */}
      <div className="mx-auto max-w-2xl overflow-visible rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">
        <div className="mb-8">
          <p className="text-sm font-medium text-indigo-600">
            Product video
          </p>

          <h1 className="mt-1 text-2xl font-semibold text-gray-900">
            Upload Product Video
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Search for a product and upload a video connected to it.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product search */}
          <div>
            <label
              htmlFor="product-search"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Select product
            </label>

            <div className="relative">
              <input
                id="product-search"
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search product by name..."
                autoComplete="off"
                className="h-12 w-full rounded-xl border border-gray-300 bg-white px-4 pr-12 text-sm text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
              />

              {searchLoading && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-indigo-600" />
                </div>
              )}

              {search.trim().length >= 3 && (
                <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 max-h-80 overflow-y-auto rounded-xl border border-gray-200 bg-white p-2 shadow-xl">
                  {!searchLoading && allSearch.length === 0 ? (
                    <div className="px-4 py-8 text-center">
                      <p className="text-sm text-gray-500">
                        No products found.
                      </p>
                    </div>
                  ) : (
                    allSearch.map((item) => (
                      <button
                        key={item._id}
                        type="button"
                        onClick={() => handleSelectProduct(item)}
                        className="flex w-full items-center gap-3 rounded-lg p-2 text-left transition hover:bg-gray-50"
                      >
                        <img
                          src={getMediaUrl(item.thumbnail)}
                          alt={item.name || "Product"}
                          className="h-14 w-14 shrink-0 rounded-lg border border-gray-200 object-cover"
                        />

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-gray-900">
                            {item.name}
                          </p>

                          {item.slug && (
                            <p className="mt-1 truncate text-xs text-gray-500">
                              {item.slug}
                            </p>
                          )}
                        </div>

                        <span className="rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-600">
                          Select
                        </span>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            {search.length > 0 && search.trim().length < 3 && (
              <p className="mt-2 text-xs text-gray-500">
                Enter at least 3 characters to search.
              </p>
            )}
          </div>

          {/* Selected product */}
          {selectedProduct && (
            <div className="flex items-center gap-4 rounded-xl border border-indigo-200 bg-indigo-50/50 p-3">
              <img
                src={getMediaUrl(selectedProduct.thumbnail)}
                alt={selectedProduct.name || "Selected product"}
                className="h-16 w-16 shrink-0 rounded-lg border border-indigo-100 bg-white object-cover"
              />

              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium uppercase tracking-wide text-indigo-600">
                  Selected product
                </p>

                <p className="mt-1 truncate text-sm font-semibold text-gray-900">
                  {selectedProduct.name}
                </p>
              </div>

              <button
                type="button"
                onClick={handleRemoveProduct}
                className="rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
              >
                Remove
              </button>
            </div>
          )}

          {/* Video input */}
          <div>
            <label
              htmlFor="product-video"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Product video
            </label>

            <label
              htmlFor="product-video"
              className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-10 text-center transition hover:border-indigo-400 hover:bg-indigo-50/30"
            >
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
                <svg
                  className="h-6 w-6 text-indigo-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 16V4m0 0L8 8m4-4 4 4M5 14v4a2 2 0 002 2h10a2 2 0 002-2v-4"
                  />
                </svg>
              </div>

              <p className="text-sm font-medium text-gray-800">
                {video ? video.name : "Click to select a video"}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                MP4, WebM or another video format up to 100 MB
              </p>

              <input
                id="product-video"
                type="file"
                accept="video/*"
                onChange={handleVideoChange}
                className="hidden"
              />
            </label>

            {video && (
              <div className="mt-3 flex items-center justify-between rounded-lg bg-gray-100 px-4 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-gray-800">
                    {video.name}
                  </p>

                  <p className="mt-0.5 text-xs text-gray-500">
                    {(video.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>

                <button
                  type="button"
                  onClick={clearFileInput}
                  className="ml-4 text-sm font-medium text-red-600"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={submitLoading || !selectedProduct || !video}
            className="flex h-12 w-full items-center justify-center rounded-xl bg-gray-900 px-5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            {submitLoading ? (
              <>
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Uploading video...
              </>
            ) : (
              "Upload Video"
            )}
          </button>
        </form>
      </div>

      {/* Uploaded videos */}
      <section className="mx-auto mt-10 max-w-7xl">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Uploaded Videos
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {videos.length} video{videos.length === 1 ? "" : "s"} uploaded
            </p>
          </div>

          <button
            type="button"
            onClick={fetchVideos}
            disabled={videosLoading}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {videosLoading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {videosLoading ? (
          <div className="flex min-h-52 items-center justify-center rounded-2xl border border-gray-200 bg-white">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
          </div>
        ) : videos.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
            <p className="font-medium text-gray-800">
              No videos uploaded
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Upload your first product video using the form above.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {videos.map((item) => (
              <article
                key={item._id}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
              >
                <div className="aspect-video bg-black">
                  <video
                    src={getMediaUrl(item.video)}
                    controls
                    preload="metadata"
                    className="h-full w-full object-contain"
                  >
                    Your browser does not support video playback.
                  </video>
                </div>

                <div className="p-4">
                  {item.product ? (
                    <div className="flex items-center gap-3">
                      <img
                        src={getMediaUrl(item.product.thumbnail)}
                        alt={item.product.name || "Product"}
                        className="h-12 w-12 shrink-0 rounded-lg border border-gray-200 object-cover"
                      />

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-gray-900">
                          {item.product.name}
                        </p>

                        <p className="mt-1 truncate text-xs text-gray-500">
                          {item.product.slug}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-red-500">
                      Connected product was removed.
                    </p>
                  )}

                  <div className="mt-4 flex items-center justify-between gap-3 border-t border-gray-100 pt-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        item.status
                          ? "bg-green-50 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {item.status ? "Active" : "Inactive"}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleDeleteVideo(item._id)}
                      disabled={deletingVideoId === item._id}
                      className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {deletingVideoId === item._id
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default Page;