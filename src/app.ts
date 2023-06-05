import express from "express";
import characters from "./routes/characters";
import mongoose from "mongoose";
import crews from "./routes/crews";
import fruits from "./routes/fruits";
import users from "./routes/users";
import cors from "cors";
import dotenv from "dotenv"

dotenv.config();

export const app = express();

const apiVersion = "v1"

app.use(express.json());
app.use(cors())
app.use(`/${apiVersion}/characters`, characters);
app.use(`/${apiVersion}/crews`, crews);
app.use(`/${apiVersion}/fruits`, fruits);
app.use(`/${apiVersion}/users`, users);

//SERVER
app.listen(process.env.PORT, async () => {
  console.log("Server is running");
  await mongoose
    .connect(`${String(process.env.MONGO_URL)}/${process.env.DB}`)
    .then(() => {
      console.log("| Connection to MongoDB | HOST: localhost:27017");
    })
    .catch((error) => {
      console.log("| An error occurred while connecting to MongoDB: ", error);
    });
});

