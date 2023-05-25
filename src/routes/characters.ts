import express from "express";
import { Characters } from "../models/charactersSchema";
import { body, header, param, query } from "express-validator";
import { checkErrors, isAuth } from "../utils/utils";

const router = express.Router();

//add characters
router.post(
  "/",
  header("authorization").isJWT(),
  body("name").exists().isString(),
  body("role").exists().isString(),
  body("size").exists().isString(),
  body("age").exists().isNumeric(),
  body("bounty").exists().isString(),
  body("fruit").optional().isString(),
  body("crew").exists().isString(),
  body("urlImg").optional().isString(),
  checkErrors,
  isAuth,
  async (req, res) => {
    const { name, role, size, age, bounty, fruit, crew, urlImg } = req.body;
    const character = new Characters({
      name,
      role,
      size,
      age,
      bounty,
      fruit,
      crew,
      urlImg,
    });
    //Adds document to collection
    const charactersSaved = await character.save();
    res.status(201).json(character);
  }
);

//edit characters
router.patch(
  "/:id",
  header("authorization").isJWT(),
  param("id").isMongoId(),
  body("name").optional().isString(),
  body("role").optional().isString(),
  body("size").optional().isString(),
  body("age").optional().isNumeric(),
  body("bounty").optional().isString(),
  body("fruit").optional().isString(),
  body("crew").optional().isString(),
  body("urlImg").optional().isString(),
  checkErrors,
  isAuth,
  async (req, res) => {
    const { id } = req.params;
    const { name, role, size, age, bounty, fruit, crew, urlImg } = req.body;
    try {
      const character = await Characters.findByIdAndUpdate(
        id,
        {
          name: name,
          role: role,
          size: size,
          age: age,
          bounty: bounty,
          fruit: fruit,
          crew: crew,
          urlImg: urlImg,
        },
        { new: true, runValidators: true }
      );
      if (!character) {
        return res.status(404).json({ message: "characters not found" });
      }
      res.status(200).json({ message: "character updated", character });
    } catch (err) {
      res.status(500).json({ err });
    }
  }
);

//delete characters
router.delete(
  "/:id",
  header("authorization").isJWT(),
  param("id").isMongoId(),
  checkErrors,
  isAuth,
  async (req, res) => {
    const { id } = req.params;
    const characterDelete = await Characters.findByIdAndDelete(id);
    characterDelete
      ? res.status(200).json({ message: "character delete", characterDelete })
      : res.status(404).json({ message: "character not found" });
  }
);

//get all characters and query
router.get(
  "/",
  query("name").optional().isString(),
  query("role").optional().isString(),
  query("crew").optional().isString(),
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

    try {
      const charactersQuery = await Characters.find(filters);
      if (!charactersQuery) {
        return res.json(await Characters.find());
      }
      res.json(charactersQuery);
    } catch (err) {
      res
        .status(500)
        .json({ err: "An error occurred when querying characters" });
    }
  }
);

//get characters by ID
router.get("/:id", param("id").isMongoId(), checkErrors, async (req, res) => {
  const { id } = req.params;
  const characters = await Characters.findById(id);
  if (!characters) {
    return res.status(404).json({ message: "characters not found" });
  }
  res.json(characters);
});

export default router;
