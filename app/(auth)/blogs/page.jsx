"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FiEye,
  FiTrash2,
  FiPlus,
  FiRefreshCw,
  FiX,
  FiClock,
} from "react-icons/fi";
import { toast } from "react-toastify";

import CreateBlogs from "./CreateBlogs";
import { base_url, img_url } from "@/app/components/urls";

const Page = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);

  const getImageUrl = (path) => {
    if (!path) return "/placeholder.webp";

    if (path.startsWith("http://") || path.startsWith("https://")) {
      return path;
    }

    return `${img_url}${path}`;
  };

  const fetchBlogs = async () => {
    try {
      setLoading(true);

      const response = await axios.get(`${base_url}/blog/get`);

      if (response.data?.success) {
        setBlogs(response.data.blogs || []);
      } else {
        setBlogs([]);
      }
    } catch (error) {
      console.error("Fetch blogs error:", error);

      toast.error(
        error.response?.data?.message || "Failed to fetch blogs."
      );

      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = async (blogId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this blog?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(blogId);

      const response = await axios.delete(`${base_url}/blog/delete/${blogId}`);

      if (response.data?.success) {
        toast.success(
          response.data?.message || "Blog deleted successfully."
        );

        setBlogs((previousBlogs) =>
          previousBlogs.filter((blog) => blog._id !== blogId)
        );

        if (selectedBlog?._id === blogId) {
          setSelectedBlog(null);
        }
      } else {
        toast.error(
          response.data?.message || "Failed to delete blog."
        );
      }
    } catch (error) {
      console.error("Delete blog error:", error);

      toast.error(
        error.response?.data?.message ||
          "Something went wrong while deleting the blog."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(date));
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-950 transition-colors duration-300 dark:bg-[#070b16] dark:text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600 dark:text-indigo-400">
              Blog management
            </p>

            <h1 className="mt-1 text-2xl font-bold text-slate-950 dark:text-white sm:text-3xl">
              All Blogs
            </h1>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Create, view and delete your website blogs.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={fetchBlogs}
              disabled={loading}
              className="flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
            >
              <FiRefreshCw className={loading ? "animate-spin" : ""} />
              Refresh
            </button>

            <button
              type="button"
              onClick={() => setShowCreateForm((previous) => !previous)}
              className="flex h-11 items-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500"
            >
              {showCreateForm ? <FiX /> : <FiPlus />}
              {showCreateForm ? "Close Form" : "Create Blog"}
            </button>
          </div>
        </div>

        {/* Create blog form */}
        {showCreateForm && (
          <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
            <CreateBlogs
              onSuccess={() => {
                fetchBlogs();
                setShowCreateForm(false);
              }}
            />
          </div>
        )}

        {/* Blogs table */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#0d1324] dark:shadow-black/30">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-white/10">
            <div>
              <h2 className="font-semibold text-slate-950 dark:text-white">
                Blog List
              </h2>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {blogs.length} blog{blogs.length === 1 ? "" : "s"} found
              </p>
            </div>
          </div>

          {loading ? (
            <div className="flex min-h-72 items-center justify-center">
              <div className="text-center">
                <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-slate-300 border-t-slate-950 dark:border-white/20 dark:border-t-indigo-400" />

                <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                  Loading blogs...
                </p>
              </div>
            </div>
          ) : blogs.length === 0 ? (
            <div className="px-5 py-20 text-center">
              <p className="font-medium text-slate-800 dark:text-white">
                No blogs found
              </p>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Create your first blog to display it here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-left dark:border-white/10 dark:bg-white/[0.03]">
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Blog
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Reading time
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Sections
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Status
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Created
                    </th>

                    <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {blogs.map((blog) => (
                    <tr
                      key={blog._id}
                      className="border-b border-slate-100 transition last:border-b-0 hover:bg-slate-50 dark:border-white/10 dark:hover:bg-white/[0.04]"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={getImageUrl(blog.thumbnail)}
                            alt={blog.title || "Blog"}
                            className="h-16 w-20 shrink-0 rounded-xl border border-slate-200 object-cover dark:border-white/10"
                          />

                          <div className="min-w-0 max-w-sm">
                            <p className="truncate text-sm font-semibold text-slate-950 dark:text-white">
                              {blog.title}
                            </p>

                            <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
                              {blog.des}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                          <FiClock className="text-slate-400 dark:text-slate-500" />
                          {blog.readingtime} min
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 dark:bg-white/10 dark:text-slate-200">
                          {blog.fulldes?.length || 0} sections
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                            blog.status
                              ? "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400"
                              : "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
                          }`}
                        >
                          {blog.status ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-400">
                        {formatDate(blog.createdAt)}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedBlog(blog)}
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:border-indigo-400/30 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-400"
                            aria-label="View blog"
                            title="View blog"
                          >
                            <FiEye />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(blog._id)}
                            disabled={deletingId === blog._id}
                            className="flex h-9 items-center justify-center gap-2 rounded-lg border border-red-100 bg-red-50 px-3 text-sm font-medium text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
                          >
                            {deletingId === blog._id ? (
                              <>
                                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-red-300 border-t-red-600 dark:border-red-400/30 dark:border-t-red-400" />
                                Deleting
                              </>
                            ) : (
                              <>
                                <FiTrash2 />
                                Delete
                              </>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* View blog modal */}
      {selectedBlog && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={() => setSelectedBlog(null)}
        >
          <div
            onClick={(event) => event.stopPropagation()}
            className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-[#0d1324] dark:shadow-black/50"
          >
            <div className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 dark:border-white/10 dark:bg-[#0d1324]">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Blog preview
                </p>

                <h2 className="mt-1 font-semibold text-slate-950 dark:text-white">
                  {selectedBlog.title}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedBlog(null)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-slate-200 dark:bg-white/10 dark:text-slate-300 dark:hover:bg-white/15"
              >
                <FiX />
              </button>
            </div>

            <div className="p-5 sm:p-7">
              <img
                src={getImageUrl(selectedBlog.thumbnail)}
                alt={selectedBlog.title}
                className="aspect-[16/8] w-full rounded-2xl border border-slate-200 object-cover dark:border-white/10"
              />

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    selectedBlog.status
                      ? "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400"
                      : "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
                  }`}
                >
                  {selectedBlog.status ? "Active" : "Inactive"}
                </span>

                <span className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 dark:bg-white/10 dark:text-slate-200">
                  <FiClock />
                  {selectedBlog.readingtime} min read
                </span>

                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {formatDate(selectedBlog.createdAt)}
                </span>
              </div>

              <h1 className="mt-6 text-2xl font-bold leading-tight text-slate-950 dark:text-white sm:text-3xl">
                {selectedBlog.title}
              </h1>

              <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">
                {selectedBlog.des}
              </p>

              {selectedBlog.fulldes?.length > 0 && (
                <div className="mt-8 space-y-7 border-t border-slate-200 pt-7 dark:border-white/10">
                  {selectedBlog.fulldes.map((section, index) => (
                    <section key={index}>
                      {section.title && (
                        <h2 className="text-xl font-semibold text-slate-950 dark:text-white">
                          {section.title}
                        </h2>
                      )}

                      {section.des && (
                        <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">
                          {section.des}
                        </p>
                      )}
                    </section>
                  ))}
                </div>
              )}

              <div className="mt-8 flex justify-end border-t border-slate-200 pt-5 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => handleDelete(selectedBlog._id)}
                  disabled={deletingId === selectedBlog._id}
                  className="flex h-11 items-center gap-2 rounded-xl bg-red-600 px-5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-red-500 dark:hover:bg-red-600"
                >
                  <FiTrash2 />

                  {deletingId === selectedBlog._id
                    ? "Deleting..."
                    : "Delete Blog"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Page;