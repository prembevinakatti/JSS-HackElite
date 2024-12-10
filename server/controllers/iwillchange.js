const categoryModle = require("../models/category");
const categoryModel = require("../models/category");

module.exports.updateCategory = async (req, res) => {
  try {
    const { toUpdate, data } = req.body;
    if (!data || !data._id || !data.Subcategories) {
      return res.status(400).json({ message: "Invalid input data" });
    }
    if (toUpdate === "maincategory") {
      await categoryModel.create({
        _id: data._id,
        subcategories: data.Subcategories,
      });
      return res.status(201).json({ message: "Main category created successfully" });
    } else {
      const categoryData = await categoryModel.findOne({ _id: data._id });
      if (!categoryData) {
        return res.status(404).json({ message: "Category not found" });
      }
      data.Subcategories.forEach((subcat) => {
        if (!categoryData.subcategories.includes(subcat)) {
          categoryData.subcategories.push(subcat);
        }
      });
      await categoryData.save();
      return res.status(200).json({ message: "Category updated successfully" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred", error: error.message });
  }
};
const categoryModel = require("../models/category");

module.exports.getCategoryDataByRole = async (req, res) => {
  try {
    const { user } = req;
    let data;

    if (user.role === "head") {
      const categories = await categoryModel.find({});
      if (!categories || categories.length === 0) {
        return res.status(404).json({ message: "No categories found" });
      }
      data = categories;
    } else {
      const { maincategory } = req.body;
      if (!maincategory) {
        return res.status(400).json({ message: "maincategory is required" });
      }
      const category = await categoryModel.findOne({ _id: maincategory });
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      data = category;
    }
    return res.status(200).json({ message: "Fetched category successfully", data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred", error: error.message });
  }
};
