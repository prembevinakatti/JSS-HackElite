import React, { useState } from "react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useSelector } from "react-redux";
import axiosInstance from "../../../utils/Axiosinstance";
import { toast } from "react-hot-toast";
const AdminHeadPanel = () => {
  const [mainCategory, setMainCategory] = useState("");
  const [subCategories, setSubCategories] = useState([""]);
  const user = useSelector((state) => state.auth.authUser);
  const handleAddSubCategory = () => {
    setSubCategories([...subCategories, ""]);
  };
  const handleSubCategoryChange = (index, value) => {
    const updatedSubCategories = [...subCategories];
    updatedSubCategories[index] = value;
    setSubCategories(updatedSubCategories);
  };
  const handleRemoveSubCategory = (index) => {
    const updatedSubCategories = subCategories.filter((_, i) => i !== index);
    setSubCategories(updatedSubCategories);
  };
  const handleSubmit = async () => {
    if (!mainCategory || subCategories.some((subcat) => !subcat.trim())) {
      return toast.error("Please fill out all fields.");
    }
    const data = {
      toUpdate: "maincategory",
      data: {
        _id: mainCategory,
        Subcategories: subCategories,
      },
    };
    try {
      const response = await axiosInstance.post("/api/categories/update", data);
      if (response.status === 201) {
        toast.success("Main category and subcategories added successfully.");
        setMainCategory("");
        setSubCategories([""]);
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while updating categories.");
    }
  };
  return (
    <div className="p-8">
      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold">
            {user.role === "Head" ? "Head Control Panel" : "Admin Control Panel"}
          </h2>
        </CardHeader>
        <CardContent>
          {user.role === "Head" && (
            <div>
              <Label htmlFor="mainCategory">Main Category</Label>
              <Input
                id="mainCategory"
                placeholder="Enter main category"
                className="mt-2"
                value={mainCategory}
                onChange={(e) => setMainCategory(e.target.value)}
              />
              <div className="mt-6">
                <Label>Subcategories</Label>
                {subCategories.map((subCategory, index) => (
                  <div className="flex items-center gap-4 mt-2" key={index}>
                    <Input
                      placeholder={`Subcategory ${index + 1}`}
                      value={subCategory}
                      onChange={(e) => handleSubCategoryChange(index, e.target.value)}
                    />
                    <Button onClick={() => handleRemoveSubCategory(index)} >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button className="mt-4" onClick={handleAddSubCategory} >
                  + Add Subcategory
                </Button>
              </div>
            </div>
          )}

          {user.role !== "Head" && (
            <div>
              <Label>Main Category</Label>
              <Input value={user.branch} disabled className="mt-2" />
              <div className="mt-6">
                <Label>Subcategories</Label>
                {subCategories.map((subCategory, index) => (
                  <div className="flex items-center gap-4 mt-2" key={index}>
                    <Input
                      placeholder={`Subcategory ${index + 1}`}
                      value={subCategory}
                      onChange={(e) => handleSubCategoryChange(index, e.target.value)}
                    />
                    <Button onClick={() => handleRemoveSubCategory(index)} >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button className="mt-4" onClick={handleAddSubCategory}>
                  + Add Subcategory
                </Button>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={handleSubmit} className="w-full">
            Submit
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminHeadPanel;
