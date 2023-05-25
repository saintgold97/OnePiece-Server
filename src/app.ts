import express from "express";
import characters from "./routes/characters";
import mongoose from "mongoose";
import crews from "./routes/crews";
import fruits from "./routes/fruits";
import users from "./routes/users";
import cors from "cors";
export const app = express();

const apiVersion = "v1"

app.use(express.json());
app.use(cors())
app.use(`/${apiVersion}/characters`, characters);
app.use(`/${apiVersion}/crews`, crews);
app.use(`/${apiVersion}/fruits`, fruits);
app.use(`/${apiVersion}/users`, users);

//SERVER
app.listen(process.env.PORT || 3001, async () => {
  console.log("Server is running");
  await mongoose
    .connect(`mongodb://127.0.0.1:27017/${process.env.DB}`)
    .then(() => {
      console.log("| Connection to MongoDB | HOST: localhost:27017");
    })
    .catch((error) => {
      console.log("| An error occurred while connecting to MongoDB: ", error);
    });
});

