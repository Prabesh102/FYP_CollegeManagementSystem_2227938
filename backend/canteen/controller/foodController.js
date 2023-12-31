const asyncHandler = require("express-async-handler");
const Food = require("../model/foodModel");
const getFoods = asyncHandler(async (req, res) => {
  const Foods = await Food.find({});
  res.send(Foods).status(200);
});
const getFoodsById = asyncHandler(async (req, res) => {
  const Foods = await Food.findById(req.params.id);
  if (!Foods) {
    res.json({ message: "Id not found" });
    res.status(404);
  }
  res.send(Foods).status(200);
});
const postFoods = asyncHandler(async (req, res) => {
  const { foodName, price, quantity } = req.body;
  if (!foodName || !price || !quantity) {
    res.json({ message: "Please enter all the  data correctly" });
    res.status(404);
  }
  const Foods = await Food.create({
    foodName,
    price,
    quantity,
  });
  res.send(Foods).status(200);
});
const updateFoods = asyncHandler(async (req, res) => {
  const Foods = await Food.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!Foods) {
    res.send("Food not found");
    res.status(404);
  }
  res.send(Foods).status(200);
});
const deleteFoods = asyncHandler(async (req, res) => {
  const Foods = await Food.findByIdAndDelete(req.params.id);
  if (!Foods) {
    res.send("Foods not found");
    res.status(404);
  }
  res.send(Foods).status(200);
});
module.exports = {
  getFoods,
  getFoodsById,
  postFoods,
  updateFoods,
  deleteFoods,
};
