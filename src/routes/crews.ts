import express from "express";
import { Crews } from "../models/crewsSchema";
import { body, header, param, query } from "express-validator";
import { checkErrors, isAuth } from "../utils/utils";

const router = express.Router();

//add crews
router.post(
  "/",
  header("authorization").isJWT(),
  body("english_name").exists().isString(),
  body("romaji_name").exists().isString(),
  body("total_bounty").exists().isString(),
  body("number_members").exists().isNumeric(),
  body("urlImg").optional().isString(),
  checkErrors,
  isAuth,
  async (req, res) => {
    try {
      const {
        english_name,
        romaji_name,
        total_bounty,
        number_members,
        urlImg,
      } = req.body;
      const crew = new Crews({
        english_name,
        romaji_name,
        total_bounty,
        number_members,
        urlImg,
      });
      //Adds document to collection
      const crewsSaved = await crew.save();
      res.status(201).json(crew);
    } catch (err) {
      res.status(400).json({ message: "Fields required" });
    }
  }
);

//edit crews
router.patch(
  "/:id",
  header("authorization").isJWT(),
  param("id").isMongoId(),
  body("english_name").optional().isString(),
  body("romaji_name").optional().isString(),
  body("total_bounty").optional().isString(),
  body("number_members").optional().isNumeric(),
  body("urlImg").optional().isString(),
  checkErrors,
  isAuth,
  async (req, res) => {
    const { id } = req.params;
    const { english_name, romaji_name, total_bounty, number_members, urlImg } =
      req.body;
    try {
      const crew = await Crews.findByIdAndUpdate(
        id,
        {
          english_name: english_name,
          romaji_name: romaji_name,
          total_bounty: total_bounty,
          number_members: number_members,
          urlImg: urlImg,
        },
        { new: true, runValidators: true }
      );
      if (!crew) {
        return res.status(404).json({ message: "crew not found" });
      }
      res.status(200).json({ message: "crew updated", crew });
    } catch (err) {
      res.status(500).json({ err });
    }
  }
);

//delete crews
router.delete(
  "/:id",
  header("authorization").isJWT(),
  param("id").isMongoId(),
  checkErrors,
  isAuth,
  async (req, res) => {
    const { id } = req.params;
    const crewDeleted = await Crews.findByIdAndDelete(id);
    crewDeleted
      ? res.status(200).json({ message: "crew delete", crewDeleted })
      : res.status(404).json({ message: "crew not found" });
  }
);

//get all crews and query
router.get(
  "/",
  query("english_name").optional().isString(),
  query("romaji_name").optional().isString(),
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

    const crewsQuery = await Crews.find(filters);
    if (!crewsQuery) {
      return res.json(Crews.find());
    }
    res.json(crewsQuery);
  }
);

//get crew by ID
router.get("/:id", param("id").isMongoId(), checkErrors, async (req, res) => {
  const { id } = req.params;
  const crews = await Crews.findById(id);
  if (!crews) {
    return res.status(404).json({ message: "crews not found" });
  }
  res.json(crews);
});

export default router;
