
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
  FaImage,
  FaDesktop,
  FaMobileAlt,
} from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { toast } from "react-toastify";

const initialForm = {
  image: null,
  desktop: null,
  mobile: null,
  name: "",
};

const CategoryPage = () => {
  const [newCategoryData, setNewCategoryData] = useState(initialForm);

  const [editCategoryData, setEditCategoryData] = useState({
    id: "",
    name: "",
    image: null,
    desktop: null,
    mobile: null,
    oldImage: "",
    oldDesktop: "",
    oldMobile: "",
  });

  const [allCategory, setAllCategory] = useState([]);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState("");

  const isEditing = Boolean(editCategoryData.id);

  // Fetch categories
  const getCategory = async () => {
    try {
      const response = await axios.get(
        `${base_url}/category/get-all`
      );

      if (response.data.success) {
        setAllCategory(response.data.data || []);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch categories"
      );
    }
  };

  useEffect(() => {
    getCategory();
  }, []);

  // Image selection
  const handleImageChange = (field, file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image");
      return;
    }

    if (isEditing) {
      setEditCategoryData((prev) => ({
        ...prev,
        [field]: file,
      }));
    } else {
      setNewCategoryData((prev) => ({
        ...prev,
        [field]: file,
      }));
    }
  };

  // Image preview
  const getPreview = (file, oldImage) => {
    if (file) return URL.createObjectURL(file);
    if (oldImage) return `${img_url}${oldImage}`;
    return "";
  };

  // Image upload component
  const ImageUpload = ({
    title,
    field,
    file,
    oldImage,
    required = false,
  }) => {
    const preview = getPreview(file, oldImage);

    return (
      <div className="space-y-2">
        <label className="block text-sm font-bold text-slate-700 dark:text-slate-200">
          {title}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>

        <label
          htmlFor={`${isEditing ? "edit" : "create"}-${field}`}
          className="group relative flex h-44 cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-slate-300 bg-white transition hover:border-rose-800 dark:border-slate-600 dark:bg-slate-900"
        >
          {preview ? (
            <>
              <img
                src={preview}
                alt={title}
                className="h-full w-full object-cover"
              />

              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white opacity-0 transition group-hover:opacity-100">
                <FaCloudUploadAlt className="mb-2 text-3xl" />
                <span className="text-sm font-semibold">
                  Change Image
                </span>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center text-slate-400">
              <FaCloudUploadAlt className="mb-2 text-4xl" />
              <span className="text-sm font-semibold">
                Upload Image
              </span>
              <span className="mt-1 text-xs text-red-500">
                {required ? "Required" : "Optional"}
              </span>
            </div>
          )}

          <input
            id={`${isEditing ? "edit" : "create"}-${field}`}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              handleImageChange(field, e.target.files?.[0]);
              e.target.value = "";
            }}
          />
        </label>

        {file && (
          <button
            type="button"
            onClick={() => {
              if (isEditing) {
                setEditCategoryData((prev) => ({
                  ...prev,
                  [field]: null,
                }));
              } else {
                setNewCategoryData((prev) => ({
                  ...prev,
                  [field]: null,
                }));
              }
            }}
            className="text-xs font-semibold text-red-500 hover:text-red-700"
          >
            Remove selected image
          </button>
        )}
      </div>
    );
  };

  // Reset edit form
  const cancelEdit = () => {
    setEditCategoryData({
      id: "",
      name: "",
      image: null,
      desktop: null,
      mobile: null,
      oldImage: "",
      oldDesktop: "",
      oldMobile: "",
    });
  };

  // Create category
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !newCategoryData.name.trim() ||
      !newCategoryData.image ||
      !newCategoryData.desktop ||
      !newCategoryData.mobile
    ) {
      toast.error(
        "Please provide category name and all three images"
      );
      return;
    }

    try {
      setCreating(true);

      const formData = new FormData();

      formData.append("name", newCategoryData.name.trim());
      formData.append("image", newCategoryData.image);
      formData.append("desktop", newCategoryData.desktop);
      formData.append("mobile", newCategoryData.mobile);

      const response = await axios.post(
        `${base_url}/category/create`,
        formData
      );

      if (response.data.success) {
        toast.success(
          response.data.message || "Category created successfully"
        );

        const created = response.data.data || response.data.category;

        if (created) {
          setAllCategory((prev) => [...prev, created]);
        } else {
          await getCategory();
        }

        setNewCategoryData({ ...initialForm });
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to create category"
      );
    } finally {
      setCreating(false);
    }
  };

  // Open edit form
  const openEditCategory = (category) => {
    setEditCategoryData({
      id: category._id,
      name: category.name || "",
      image: null,
      desktop: null,
      mobile: null,
      oldImage: category.image || "",
      oldDesktop: category.desktop || "",
      oldMobile: category.mobile || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Update category
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

      if (editCategoryData.image) {
        formData.append("image", editCategoryData.image);
      }

      if (editCategoryData.desktop) {
        formData.append("desktop", editCategoryData.desktop);
      }

      if (editCategoryData.mobile) {
        formData.append("mobile", editCategoryData.mobile);
      }

      const response = await axios.put(
        `${base_url}/category/edit/${editCategoryData.id}`,
        formData
      );

      if (response.data.success) {
        const updated =
          response.data.data || response.data.category;

        if (updated) {
          setAllCategory((prev) =>
            prev.map((item) =>
              item._id === editCategoryData.id
                ? { ...item, ...updated }
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

  // Delete category
  const deleteCategory = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!confirmed) return;

    try {
      setDeleting(id);

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

        toast.success(
          response.data.message || "Category deleted successfully"
        );
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete category"
      );
    } finally {
      setDeleting("");
    }
  };

  return (
    <div className="min-h-screen bg-white p-4 transition-colors dark:bg-black sm:p-6">
      <div className="mx-auto">

        {/* Page heading */}
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Category Management
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Create, manage and update your product categories.
          </p>
        </div>

        {/* Create / Edit Form */}
        <form
          onSubmit={isEditing ? updateCategory : handleSubmit}
          className="mb-10 rounded-2xl border border-slate-200 bg-gray-50 p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-6"
        >
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {isEditing ? "Edit Category" : "Add New Category"}
              </h2>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {isEditing
                  ? "Replace existing category images if needed."
                  : "Upload all three images to create a category."}
              </p>
            </div>

            {isEditing && (
              <button
                type="button"
                onClick={cancelEdit}
                className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <MdCancel size={19} />
                Cancel
              </button>
            )}
          </div>

          {/* Name */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">
              Category Name <span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              required
              placeholder="Enter category name..."
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-rose-800 focus:ring-2 focus:ring-rose-800/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              value={
                isEditing
                  ? editCategoryData.name
                  : newCategoryData.name
              }
              onChange={(e) => {
                const value = e.target.value;

                if (isEditing) {
                  setEditCategoryData((prev) => ({
                    ...prev,
                    name: value,
                  }));
                } else {
                  setNewCategoryData((prev) => ({
                    ...prev,
                    name: value,
                  }));
                }
              }}
            />
          </div>

          {/* Image uploads */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

            <ImageUpload
              title="Category Image"
              field="image"
              file={
                isEditing
                  ? editCategoryData.image
                  : newCategoryData.image
              }
              oldImage={
                isEditing ? editCategoryData.oldImage : ""
              }
              required={!isEditing}
            />

            <ImageUpload
              title="Desktop Banner"
              field="desktop"
              file={
                isEditing
                  ? editCategoryData.desktop
                  : newCategoryData.desktop
              }
              oldImage={
                isEditing ? editCategoryData.oldDesktop : ""
              }
              required={!isEditing}
            />

            <ImageUpload
              title="Mobile Banner"
              field="mobile"
              file={
                isEditing
                  ? editCategoryData.mobile
                  : newCategoryData.mobile
              }
              oldImage={
                isEditing ? editCategoryData.oldMobile : ""
              }
              required={!isEditing}
            />

          </div>

          {/* Submit */}
          <div className="mt-7 flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={creating || updating}
              className="flex items-center justify-center gap-2 rounded-xl bg-rose-900 px-7 py-3 font-bold text-white shadow-lg shadow-rose-900/20 transition hover:bg-rose-800 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isEditing ? (
                <>
                  <FaSave />
                  {updating ? "Updating..." : "Update Category"}
                </>
              ) : (
                <>
                  <FaPlus />
                  {creating ? "Creating..." : "Create Category"}
                </>
              )}
            </button>

            {isEditing && (
              <button
                type="button"
                onClick={cancelEdit}
                className="rounded-xl border border-slate-300 px-6 py-3 font-semibold text-slate-600 transition hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* Category listing */}
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            All Categories
          </h2>

          <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-bold text-rose-900 dark:bg-rose-900/30 dark:text-rose-300">
            {allCategory.length} Categories
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {allCategory.length > 0 ? (
            allCategory.map((item) => (
              <div
                key={item._id}
                className={`overflow-hidden rounded-2xl border bg-gray-50 shadow-sm transition hover:shadow-md dark:bg-slate-800 ${
                  editCategoryData.id === item._id
                    ? "border-rose-800 ring-2 ring-rose-800/20"
                    : "border-slate-200 dark:border-slate-700"
                }`}
              >
                <div className="relative h-40 bg-slate-200 dark:bg-slate-900">
                  <img
                    src={`${img_url}${item.desktop || item.image}`}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />

                  <span className="absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1 text-xs font-bold text-white">
                    {item.product?.length || 0} Products
                  </span>
                </div>

                <div className="p-4">
                  <h3 className="font-bold text-slate-900 dark:text-white">
                    {item.name}
                  </h3>

                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {[
                      { label: "Category", src: item.image },
                      { label: "Desktop", src: item.desktop },
                      { label: "Mobile", src: item.mobile },
                    ].map((img) => (
                      <div key={img.label}>
                        <p className="mb-1 text-[10px] font-semibold text-slate-500">
                          {img.label}
                        </p>

                        {img.src ? (
                          <img
                            src={`${img_url}${img.src}`}
                            alt={img.label}
                            className="h-16 w-full rounded-lg border border-slate-200 object-cover dark:border-slate-700"
                          />
                        ) : (
                          <div className="flex h-16 items-center justify-center rounded-lg bg-slate-200 text-xs text-slate-400 dark:bg-slate-900">
                            No image
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex gap-2 border-t border-slate-200 pt-3 dark:border-slate-700">
                    <button
                      type="button"
                      onClick={() => openEditCategory(item)}
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-50 py-2 text-sm font-bold text-blue-600 transition hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40"
                    >
                      <FaEdit />
                      Edit
                    </button>

                    <button
                      type="button"
                      disabled={deleting === item._id}
                      onClick={() => deleteCategory(item._id)}
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-50 py-2 text-sm font-bold text-red-600 transition hover:bg-red-100 disabled:opacity-50 dark:bg-red-900/20 dark:hover:bg-red-900/40"
                    >
                      <FaTrash />
                      {deleting === item._id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full rounded-2xl border-2 border-dashed border-slate-200 py-20 text-center dark:border-slate-700">
              <FaImage className="mx-auto mb-3 text-4xl text-slate-300" />
              <p className="font-semibold text-slate-500 dark:text-slate-400">
                No categories available yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
