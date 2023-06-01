import express from "express";
import { Fruits } from "../models/fruitsSchema";
import { body, header, param, query } from "express-validator";
import { checkErrors, isAuth } from "../utils/utils";

const router = express.Router();

//add fruits
router.post(
  "/",
  //header("authorization").isJWT(),
  body("romaji_name").exists().isString(),
  body("type").exists().isString(),
  body("description").exists().isString(),
  body("urlImg").optional().isString(),
  checkErrors,
  //isAuth,

  async (req, res) => {
    try {
      const { romaji_name, type, description, urlImg } = req.body;
      const fruit = new Fruits({
        romaji_name,
        type,
        description,
        urlImg,
      });
      //Adds document to collection
      const fruitsSaved = await fruit.save();
      res.status(201).json(fruit);
    } catch (err) {
      res.status(400).json({ message: "Fields required"});
    }
  }
);

//edit fruits
router.patch(
  "/:id",
  //header("authorization").isJWT(),
  param("id").isMongoId(),
  body("romaji_name").optional().isString(),
  body("type").optional().isString(),
  body("description").optional().isString(),
  body("urlImg").optional().isString(),
  checkErrors,
  // isAuth,
  async (req, res) => {
    const { id } = req.params;
    const { romaji_name, type, description, urlImg } = req.body;
    try {
      const fruit = await Fruits.findByIdAndUpdate(
        id,
        {
          romaji_name: romaji_name,
          type: type,
          description: description,
          urlImg: urlImg,
        },
        { new: true, runValidators: true }
      );
      if (!fruit) {
        return res.status(404).json({ message: "fruit not found" });
      }
      res.status(200).json({ message: "fruit updated", fruit });
    } catch (err) {
      res.status(500).json({ err });
    }
  }
);

//delete fruits
router.delete(
  "/:id",
  //header("authorization").isJWT(),
  param("id").isMongoId(),
  checkErrors,
  //isAuth,
  async (req, res) => {
    const { id } = req.params;
    const fruitDeleted = await Fruits.findByIdAndDelete(id);
    fruitDeleted
      ? res.status(200).json({ message: "fruit delete", fruitDeleted })
      : res.status(404).json({ message: "fruit not found" });
  }
);

//get all fruits and query
router.get(
  "/",
  query("type").optional().isString(),
  checkErrors,
  async (req, res) => {
    const filters: any = {};
    for (const queryKey in req.query) {
      if (req.query.hasOwnProperty(queryKey)) {
        const queryValue = req.query[queryKey];
        if (queryValue) {
          filters[queryKey] = new RegExp(queryValue as string, "i");
        }
      }
    }

    const fruitsQuery = await Fruits.find(filters);
    if (!fruitsQuery) {
      return res.json(Fruits.find());
    }
    res.json(fruitsQuery);
  }
);

//get fruit by ID
router.get("/:id", param("id").isMongoId(), checkErrors, async (req, res) => {
  const { id } = req.params;
  const fruits = await Fruits.findById(id);
  if (!fruits) {
    return res.status(404).json({ message: "fruits not found" });
  }
  res.json(fruits);
});

export default router;
