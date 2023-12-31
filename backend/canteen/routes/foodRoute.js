const express = require("express");
const foodRouter = express.Router();
const {
  getFoods,
  getFoodsById,
  postFoods,
  updateFoods,
  deleteFoods,
} = require("../controller/foodController");
foodRouter.get("/", getFoods);
foodRouter.get("/:id", getFoodsById);
foodRouter.post("/", postFoods);
foodRouter.put("/:id", updateFoods);
foodRouter.delete("/:id", deleteFoods);
module.exports = foodRouter;
