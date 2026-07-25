"use client";

import { base_url } from "@/app/components/urls";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FiImage, FiPlus, FiTrash2, FiUpload } from "react-icons/fi";

const CreateBlogPage = () => {
  const [formData, setFormData] = useState({
    title: "",
    des: "",
    readingtime: "",
    status: true,
  });

  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");

  const [fullDes, setFullDes] = useState([
    {
      title: "",
      des: "",
    },
  ]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => {
      if (thumbnailPreview) {
        URL.revokeObjectURL(thumbnailPreview);
      }
    };
  }, [thumbnailPreview]);

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleThumbnailChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image.");
      event.target.value = "";
      return;
    }

    const maximumSize = 5 * 1024 * 1024;

    if (file.size > maximumSize) {
      toast.error("Thumbnail size must be less than 5 MB.");
      event.target.value = "";
      return;
    }

    if (thumbnailPreview) {
      URL.revokeObjectURL(thumbnailPreview);
    }

    setThumbnail(file);
    setThumbnailPreview(URL.createObjectURL(file));
  };

  const removeThumbnail = () => {
    if (thumbnailPreview) {
      URL.revokeObjectURL(thumbnailPreview);
    }

    setThumbnail(null);
    setThumbnailPreview("");

    const input = document.getElementById("blog-thumbnail");

    if (input) {
      input.value = "";
    }
  };

  const handleFullDesChange = (index, field, value) => {
    setFullDes((previous) =>
      previous.map((section, sectionIndex) =>
        sectionIndex === index
          ? {
              ...section,
              [field]: value,
            }
          : section
      )
    );
  };

  const addSection = () => {
    setFullDes((previous) => [
      ...previous,
      {
        title: "",
        des: "",
      },
    ]);
  };

  const removeSection = (index) => {
    if (fullDes.length === 1) {
      toast.error("At least one section is required.");
      return;
    }

    setFullDes((previous) =>
      previous.filter((_, sectionIndex) => sectionIndex !== index)
    );
  };

  const resetForm = () => {
    setFormData({
      title: "",
      des: "",
      readingtime: "",
      status: true,
    });

    setFullDes([
      {
        title: "",
        des: "",
      },
    ]);

    removeThumbnail();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Blog title is required.");
      return;
    }

    if (!formData.des.trim()) {
      toast.error("Blog description is required.");
      return;
    }

    if (!formData.readingtime || Number(formData.readingtime) < 1) {
      toast.error("Please enter a valid reading time.");
      return;
    }

    if (!thumbnail) {
      toast.error("Blog thumbnail is required.");
      return;
    }

    const cleanedSections = fullDes
      .map((section) => ({
        title: section.title.trim(),
        des: section.des.trim(),
      }))
      .filter((section) => section.title || section.des);

    if (cleanedSections.length === 0) {
      toast.error("Please add at least one blog section.");
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();

      data.append("title", formData.title.trim());
      data.append("des", formData.des.trim());
      data.append("readingtime", formData.readingtime);
      data.append("status", String(formData.status));
      data.append("thumbnail", thumbnail);
      data.append("fulldes", JSON.stringify(cleanedSections));

      const response = await axios.post(
        `${base_url}/blog/create`,
        data
      );

      if (response.data?.success) {
        toast.success(
          response.data?.message || "Blog created successfully."
        );

        resetForm();
      } else {
        toast.error(
          response.data?.message || "Failed to create blog."
        );
      }
    } catch (error) {
      console.error("Create blog error:", error);

      toast.error(
        error.response?.data?.message ||
          "Something went wrong while creating the blog."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-950 transition-colors duration-300 dark:bg-[#070b16] dark:text-white sm:px-6 lg:px-8">
  <div className="mx-auto max-w-5xl">
    <div className="mb-8">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600 dark:text-indigo-400">
        Blog management
      </p>

      <h1 className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">
        Create New Blog
      </h1>

      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        Add blog details, thumbnail and full content sections.
      </p>
    </div>

    <form
      onSubmit={handleSubmit}
      className="space-y-8"
      encType="multipart/form-data"
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        {/* Left side */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#0d1324] dark:shadow-black/30 sm:p-7">
            <h2 className="mb-6 text-lg font-semibold text-slate-950 dark:text-white">
              Basic Information
            </h2>

            <div className="space-y-5">
              <div>
                <label
                  htmlFor="title"
                  className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Blog title
                </label>

                <input
                  id="title"
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter blog title"
                  maxLength={200}
                  className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-400/10"
                />

                <p className="mt-1 text-right text-xs text-slate-400 dark:text-slate-500">
                  {formData.title.length}/200
                </p>
              </div>

              <div>
                <label
                  htmlFor="des"
                  className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Short description
                </label>

                <textarea
                  id="des"
                  name="des"
                  value={formData.des}
                  onChange={handleInputChange}
                  placeholder="Write a short description..."
                  rows={5}
                  className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-400/10"
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="readingtime"
                    className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    Reading time
                  </label>

                  <div className="relative">
                    <input
                      id="readingtime"
                      type="number"
                      name="readingtime"
                      value={formData.readingtime}
                      onChange={handleInputChange}
                      placeholder="5"
                      min="1"
                      className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 pr-20 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-400/10"
                    />

                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-500 dark:text-slate-400">
                      minutes
                    </span>
                  </div>
                </div>

                <div>
                  <p className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Blog status
                  </p>

                  <label className="flex h-12 cursor-pointer items-center justify-between rounded-xl border border-slate-300 bg-white px-4 transition dark:border-white/10 dark:bg-white/5">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {formData.status ? "Active" : "Inactive"}
                    </span>

                    <input
                      type="checkbox"
                      name="status"
                      checked={formData.status}
                      onChange={handleInputChange}
                      className="peer sr-only"
                    />

                    <span className="relative h-6 w-11 rounded-full bg-slate-300 transition peer-checked:bg-indigo-600 dark:bg-white/20 dark:peer-checked:bg-indigo-500">
                      <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition peer-checked:translate-x-5" />
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Full blog sections */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#0d1324] dark:shadow-black/30 sm:p-7">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-950 dark:text-white">
                  Full Blog Content
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Add multiple headings and descriptions.
                </p>
              </div>

              <button
                type="button"
                onClick={addSection}
                className="flex shrink-0 items-center gap-2 rounded-xl bg-indigo-50 px-4 py-2.5 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-400 dark:hover:bg-indigo-500/20"
              >
                <FiPlus />
                Add section
              </button>
            </div>

            <div className="space-y-5">
              {fullDes.map((section, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/[0.04] sm:p-5"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                      Section {index + 1}
                    </p>

                    <button
                      type="button"
                      onClick={() => removeSection(index)}
                      disabled={fullDes.length === 1}
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-30 dark:text-red-400 dark:hover:bg-red-500/10"
                      aria-label={`Remove section ${index + 1}`}
                    >
                      <FiTrash2 />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor={`section-title-${index}`}
                        className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                      >
                        Section title
                      </label>

                      <input
                        id={`section-title-${index}`}
                        type="text"
                        value={section.title}
                        onChange={(event) =>
                          handleFullDesChange(
                            index,
                            "title",
                            event.target.value
                          )
                        }
                        placeholder="Enter section title"
                        className="h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-400/10"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor={`section-des-${index}`}
                        className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                      >
                        Section description
                      </label>

                      <textarea
                        id={`section-des-${index}`}
                        value={section.des}
                        onChange={(event) =>
                          handleFullDesChange(
                            index,
                            "des",
                            event.target.value
                          )
                        }
                        placeholder="Write detailed section content..."
                        rows={7}
                        className="w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-400/10"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addSection}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 py-3 text-sm font-semibold text-slate-600 transition hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-600 dark:border-white/15 dark:text-slate-300 dark:hover:border-indigo-400/50 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-400"
            >
              <FiPlus />
              Add another section
            </button>
          </div>
        </div>

        {/* Right side */}
        <aside className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#0d1324] dark:shadow-black/30">
            <h2 className="mb-4 text-lg font-semibold text-slate-950 dark:text-white">
              Blog Thumbnail
            </h2>

            {thumbnailPreview ? (
              <div>
                <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-slate-100 dark:bg-white/5">
                  <img
                    src={thumbnailPreview}
                    alt="Blog thumbnail preview"
                    className="h-full w-full object-cover"
                  />

                  <button
                    type="button"
                    onClick={removeThumbnail}
                    className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur transition hover:bg-red-600"
                    aria-label="Remove thumbnail"
                  >
                    <FiTrash2 />
                  </button>
                </div>

                <div className="mt-3">
                  <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-200">
                    {thumbnail?.name}
                  </p>

                  {thumbnail && (
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {(thumbnail.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <label
                htmlFor="blog-thumbnail"
                className="flex aspect-[16/10] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-5 text-center transition hover:border-indigo-400 hover:bg-indigo-50/50 dark:border-white/15 dark:bg-white/[0.04] dark:hover:border-indigo-400/50 dark:hover:bg-indigo-500/10"
              >
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white text-indigo-600 shadow-sm dark:bg-white/10 dark:text-indigo-400">
                  <FiImage className="text-xl" />
                </div>

                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Upload thumbnail
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                  PNG, JPG or WebP
                  <br />
                  Maximum size 5 MB
                </p>
              </label>
            )}

            <input
              id="blog-thumbnail"
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              onChange={handleThumbnailChange}
              className="hidden"
            />

            {thumbnailPreview && (
              <label
                htmlFor="blog-thumbnail"
                className="mt-4 flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-300 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/10"
              >
                <FiUpload />
                Change thumbnail
              </label>
            )}
          </div>

          <div className="sticky top-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#0d1324] dark:shadow-black/30">
            <h2 className="text-lg font-semibold text-slate-950 dark:text-white">
              Publish Blog
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Review your blog information before publishing.
            </p>

            <button
              type="submit"
              disabled={loading}
              className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400 dark:bg-indigo-600 dark:hover:bg-indigo-500 dark:disabled:bg-white/20"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Creating blog...
                </>
              ) : (
                <>
                  <FiUpload />
                  Create Blog
                </>
              )}
            </button>

            <button
              type="button"
              onClick={resetForm}
              disabled={loading}
              className="mt-3 h-11 w-full rounded-xl border border-slate-300 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/10"
            >
              Reset form
            </button>
          </div>
        </aside>
      </div>
    </form>
  </div>
</main>
  );
};

export default CreateBlogPage;