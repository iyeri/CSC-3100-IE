// backend.js
import express from "express";
import cors from "cors";
import userService from "./services/user-service.js";
import dotenv from "dotenv";
import mongoose from "mongoose";


dotenv.config();

const { MONGO_CONNECTION_STRING } = process.env;

mongoose.set("debug", true);
mongoose
  .connect(MONGO_CONNECTION_STRING + "users") // connect to db "users"
  .catch((error) => console.log(error));


const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
  res.send("Hello World!");
});


app.get("/users", (req, res) => {
  const name = req.query.name;
  const job = req.query.job;

  /* getUsers() from ./services/user_service.js already handles multi-condition
     queries, I found no need to individually implement usage of
     findUserByName() and findUserByJob().
  */
  userService.getUsers(name, job)
    .then((result) => {
      if (result === undefined) {
         res.status(404).send("Resource not found");
      }

      res.send(result);
    })
    .catch((error) => {
      console.log(error);
    });
});


app.get("/users/:id", (req, res) => {
  const id = req.params["id"] // or req.params.id
  userService.findUserById(id)
    .then((result) => {
      if (result === undefined) {
        res.status(404).send("Resource not found.");
      }

      res.send(result);
    })
    .catch((error) => {
      console.log(error);
    });
});


// Ensure that the POST request is json! (the "Content-Type" header should be set to "application/json")
app.post("/users", (req, res) => {
  const userToAdd = req.body;
  userService.addUser(userToAdd)
    .then((newUser) => {
      res.status(201).send(newUser);
    })
    .catch((error) => {
      console.log(error);
    });
});


app.delete("/users/:id", (req, res) => {
  const id = req.params.id // or req.params["id"]
  userService.removeUser(id)
    .then((result) => {
      if (result === undefined) {
        res.status(404).send("Resource not found.");
      }

      res.status(204).send(result);
    })
    .catch((error) => {
      console.log(error);
    });
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
