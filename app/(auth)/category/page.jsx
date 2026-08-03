"use client";

import { base_url, img_url } from "@/app/components/urls";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  FaCloudUploadAlt,
  FaEdit,
  FaPlus,
  FaSave,
  FaTrash,
} from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { toast } from "react-toastify";

const CategoryPage = () => {
  const [newCategoryData, setNewCategoryData] = useState({
    image: null,
    name: "",
  });

  const [editCategoryData, setEditCategoryData] = useState({
    id: "",
    name: "",
    oldImage: "",
    image: null,
  });

  const [allCategory, setAllCategory] = useState([]);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newCategoryData.name.trim() || !newCategoryData.image) {
      toast.error("Please provide both name and image");
      return;
    }

    try {
      setCreating(true);

      const formData = new FormData();
      formData.append("image", newCategoryData.image);
      formData.append("name", newCategoryData.name.trim());

      const response = await axios.post(
        `${base_url}/category/create`,
        formData
      );

      if (response.data.success) {
        const createdCategory =
          response.data.data || response.data.category;

        toast.success(response.data.message || "Category created");

        if (createdCategory) {
          setAllCategory((prev) => [...prev, createdCategory]);
        } else {
          await getCategory();
        }

        setNewCategoryData({
          image: null,
          name: "",
        });

        // Reset file input
        const input = document.getElementById("create-category-image");
        if (input) input.value = "";
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to create category"
      );
    } finally {
      setCreating(false);
    }
  };

  const getCategory = async () => {
    try {
      const response = await axios.get(`${base_url}/category/get-all`);

      if (response.data.success) {
        setAllCategory(response.data.data || []);
      }
    } catch (error) {
      setAllCategory([]);
      toast.error(
        error.response?.data?.message || "Failed to fetch categories"
      );
    }
  };

  const openEditCategory = (category) => {
    setEditCategoryData({
      id: category._id,
      name: category.name,
      oldImage: category.image,
      image: null,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const cancelEdit = () => {
    setEditCategoryData({
      id: "",
      name: "",
      oldImage: "",
      image: null,
    });

    const input = document.getElementById("edit-category-image");
    if (input) input.value = "";
  };

  const updateCategory = async (e) => {
    e.preventDefault();

    if (!editCategoryData.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    try {
      setUpdating(true);

      const formData = new FormData();
      formData.append("name", editCategoryData.name.trim());

      // Image is optional while editing
      if (editCategoryData.image) {
        formData.append("image", editCategoryData.image);
      }

      const response = await axios.put(
        `${base_url}/category/edit/${editCategoryData.id}`,
        formData
      );

      if (response.data.success) {
        const updatedCategory =
          response.data.category || response.data.data;

        if (updatedCategory) {
          setAllCategory((prev) =>
            prev.map((item) =>
              item._id === editCategoryData.id
                ? {
                    ...item,
                    ...updatedCategory,
                  }
                : item
            )
          );
        } else {
          await getCategory();
        }

        toast.success(
          response.data.message || "Category updated successfully"
        );

        cancelEdit();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update category"
      );
    } finally {
      setUpdating(false);
    }
  };

  const deleteCategory = async (id) => {
    const confirmed = window.confirm(
      "Delete this category? Products inside might be affected."
    );

    if (!confirmed) return;

    try {
      const response = await axios.delete(
        `${base_url}/category/delete/${id}`
      );

      if (response.data.success) {
        setAllCategory((prev) =>
          prev.filter((item) => item._id !== id)
        );

        if (editCategoryData.id === id) {
          cancelEdit();
        }

        toast.success(response.data.message || "Category deleted");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete category"
      );
    }
  };

  useEffect(() => {
    getCategory();
  }, []);

  const editImagePreview = editCategoryData.image
    ? URL.createObjectURL(editCategoryData.image)
    : editCategoryData.oldImage
      ? `${img_url}${editCategoryData.oldImage}`
      : "";

  return (
    <div className="min-h-screen bg-white p-6 transition-colors duration-300 dark:bg-black">
      <div className="mx-auto">
        {/* Create/Edit form */}
        <form
          onSubmit={
            editCategoryData.id ? updateCategory : handleSubmit
          }
          className="mb-10 grid grid-cols-1 gap-6 rounded-2xl border border-slate-200 bg-gray-100 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800 md:grid-cols-3"
        >
          {/* Image */}
          <div className="col-span-1">
            {editCategoryData.id ? (
              editImagePreview ? (
                <div className="group relative h-44 w-full overflow-hidden rounded-xl border-2 border-slate-100 dark:border-slate-700">
                  <img
                    src={editImagePreview}
                    alt="Edit category preview"
                    className="h-full w-full object-cover"
                  />

                  <label
                    htmlFor="edit-category-image"
                    className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <FaCloudUploadAlt className="mb-2 text-3xl text-white" />
                    <span className="text-sm font-semibold text-white">
                      Change image
                    </span>
                  </label>

                  <input
                    id="edit-category-image"
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) =>
                      setEditCategoryData((prev) => ({
                        ...prev,
                        image: e.target.files?.[0] || null,
                      }))
                    }
                  />
                </div>
              ) : (
                <label
                  htmlFor="edit-category-image"
                  className="flex h-44 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-700/50"
                >
                  <FaCloudUploadAlt className="mb-2 text-4xl text-slate-400" />
                  <p className="text-sm font-medium text-slate-500">
                    Upload Image
                  </p>

                  <input
                    id="edit-category-image"
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) =>
                      setEditCategoryData((prev) => ({
                        ...prev,
                        image: e.target.files?.[0] || null,
                      }))
                    }
                  />
                </label>
              )
            ) : newCategoryData.image ? (
              <div className="group relative h-44 w-full overflow-hidden rounded-xl border-2 border-slate-100 dark:border-slate-700">
                <img
                  src={URL.createObjectURL(newCategoryData.image)}
                  alt="Category preview"
                  className="h-full w-full object-cover"
                />

                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() =>
                      setNewCategoryData((prev) => ({
                        ...prev,
                        image: null,
                      }))
                    }
                  >
                    <MdCancel className="text-4xl text-white transition-colors hover:text-red-500" />
                  </button>
                </div>
              </div>
            ) : (
              <label
                htmlFor="create-category-image"
                className="group flex h-44 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-700/50"
              >
                <FaCloudUploadAlt className="mb-2 text-4xl text-slate-400 group-hover:text-rose-900" />

                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Upload Image
                </p>

                <span className="mt-1 text-[10px] text-red-500">
                  * Required
                </span>

                <input
                  id="create-category-image"
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) =>
                    setNewCategoryData((prev) => ({
                      ...prev,
                      image: e.target.files?.[0] || null,
                    }))
                  }
                />
              </label>
            )}
          </div>

          {/* Details */}
          <div className="col-span-1 flex flex-col justify-center gap-4 md:col-span-2">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {editCategoryData.id
                  ? "Edit Category"
                  : "Add Category"}
              </h2>

              {editCategoryData.id && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-red-500"
                >
                  <MdCancel size={20} />
                  Cancel
                </button>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Category Name <span className="text-red-500">*</span>
              </label>

              <input
                type="text"
                required
                placeholder="Enter category name..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition-all focus:ring-2 focus:ring-rose-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                value={
                  editCategoryData.id
                    ? editCategoryData.name
                    : newCategoryData.name
                }
                onChange={(e) => {
                  if (editCategoryData.id) {
                    setEditCategoryData((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }));
                  } else {
                    setNewCategoryData((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }));
                  }
                }}
              />
            </div>

            <button
              type="submit"
              disabled={creating || updating}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-rose-900 px-8 py-3 font-bold text-white shadow-lg shadow-rose-900/20 transition-all hover:bg-rose-800 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 md:w-max"
            >
              {editCategoryData.id ? (
                <>
                  <FaSave size={14} />
                  {updating ? "Updating..." : "Update Category"}
                </>
              ) : (
                <>
                  <FaPlus size={14} />
                  {creating ? "Creating..." : "Add Category"}
                </>
              )}
            </button>
          </div>
        </form>

        {/* Category list */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {allCategory.length > 0 ? (
            allCategory.map((item, index) => (
              <div
                key={item._id || index}
                className={`flex items-center gap-4 rounded-2xl border bg-gray-100 p-3 shadow-sm transition-all hover:shadow-md dark:bg-slate-800 ${
                  editCategoryData.id === item._id
                    ? "border-rose-800 ring-2 ring-rose-800/20"
                    : "border-slate-200 dark:border-slate-700"
                }`}
              >
                <img
                  src={`${img_url}${item.image}`}
                  alt={item.name}
                  className="h-16 w-16 rounded-full border-2 border-slate-100 object-cover shadow-inner dark:border-slate-700"
                />

                <div className="min-w-0 flex-1">
                  <p className="line-clamp-1 text-sm font-bold text-slate-800 dark:text-white">
                    {item.name}
                  </p>

                  <span className="mt-1 inline-block rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-900 dark:bg-rose-900/20 dark:text-rose-400">
                    {item.product?.length || 0} Products
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => openEditCategory(item)}
                    title="Edit category"
                    className="cursor-pointer rounded-xl p-2.5 text-slate-400 transition-all hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20"
                  >
                    <FaEdit size={16} />
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteCategory(item._id)}
                    title="Delete category"
                    className="cursor-pointer rounded-xl p-2.5 text-slate-400 transition-all hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
                  >
                    <FaTrash size={16} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full rounded-2xl border-2 border-dashed border-slate-200 py-20 text-center text-slate-400 dark:border-slate-700">
              No categories available yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;