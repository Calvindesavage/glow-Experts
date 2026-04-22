"use client";
import { CustomButton, DashboardSidebar } from "@/components";
import { nanoid } from "nanoid";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { formatCategoryName } from "../../../../utils/categoryFormating";
import apiClient from "@/lib/api";

import toast from "react-hot-toast";

const DashboardCategory = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  const fetchCategories = () => {
    apiClient.get("/api/categories")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setCategories(data);
      });
  };

  // getting all categories to be displayed on the all categories page
  useEffect(() => {
    fetchCategories();
  }, []);

  const deleteCategory = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category? All associated products will be deleted.")) return;

    try {
      const response = await apiClient.delete(`/api/categories/${id}`);
      if (response.status === 204) {
        toast.success("Category deleted successfully");
        fetchCategories(); // Refresh the list
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Error deleting category");
      }
    } catch (error) {
      toast.error("There was an error while deleting category");
    }
  };

  return (
    <div className="bg-white flex justify-start max-w-screen-2xl mx-auto h-full max-xl:flex-col max-xl:h-fit max-xl:gap-y-4">
      <DashboardSidebar />
      <div className="w-full">
        <h1 className="text-3xl font-semibold text-center mb-5">
          All Categories
        </h1>
        <div className="flex justify-end mb-5">
          <Link href="/admin/categories/new">
            <CustomButton
              buttonType="button"
              customWidth="110px"
              paddingX={10}
              paddingY={5}
              textSize="base"
              text="Add new category"
            />
          </Link>
        </div>
        <div className="xl:ml-5 w-full max-xl:mt-5 overflow-auto w-full h-[80vh]">
          <table className="table table-md table-pin-cols">
            {/* head */}
            <thead>
              <tr>
                <th>
                  <label>
                    <input type="checkbox" className="checkbox" />
                  </label>
                </th>
                <th>Name</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {categories &&
                categories.map((category: Category) => (
                  <tr key={nanoid()}>
                    <th>
                      <label>
                        <input type="checkbox" className="checkbox" />
                      </label>
                    </th>

                    <td>
                      <div>
                        <p>{formatCategoryName(category?.name)}</p>
                      </div>
                    </td>

                    <td className="flex gap-2">
                      <Link
                        href={`/admin/categories/${category?.id}`}
                        className="btn btn-info btn-xs text-white"
                      >
                        edit
                      </Link>
                      <button
                        onClick={() => deleteCategory(category?.id)}
                        className="btn btn-error btn-xs text-white"
                      >
                        delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
            {/* foot */}
            <tfoot>
              <tr>
                <th></th>
                <th>Name</th>
                <th></th>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardCategory;
