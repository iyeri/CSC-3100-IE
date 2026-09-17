// backend.js
import express from "express";
import cors from "cors";

const users = {
  users_list: [
    {
      id: "xyz789",
      name: "Charlie",
      job: "Janitor",
    },
    {
      id: "abc123",
      name: "Mac",
      job: "Bouncer",
    },
    {
      id: "ppp222",
      name: "Mac",
      job: "Professor",
    },
    {
      id: "yat999",
      name: "Dee",
      job: "Aspiring actress",
    },
    {
      id: "zap555",
      name: "Dennis",
      job: "Bartender",
    },
  ],
};


const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});


const findUserByName = (name) => {
  return users["users_list"].filter((user) => user["name"] === name);
};

const findUserByNameAndJob = (name, job) => {
  return users["users_list"].filter((user) => (user["name"] === name && user["job"] === job));
};

app.get("/users", (req, res) => {
  const name = req.query.name;
  const job = req.query.job;

  if (name != undefined && job != undefined) {
    let result = findUserByNameAndJob(name, job);
    result = { users_list: result };
    res.send(result);
  } else if (name != undefined) {
    let result = findUserByName(name);
    result = { users_list: result };
    res.send(result);
  } else {
    res.send(users);
  }
});


const findUserById = (id) => {
  return users["users_list"].find((user) => user["id"] === id);
};

app.get("/users/:id", (req, res) => {
  const id = req.params["id"] // or req.params.id
  let result = findUserById(id);
  if (result === undefined) {
    res.status(404).send("Resource not found.");
  } else {
    res.send(result);
  }
});


// Sorry if this is atrocious... I am but a js newbie
const createId = () => {
  const char1 = String.fromCharCode(97 + Math.floor(Math.random() * 26));
  const char2 = String.fromCharCode(97 + Math.floor(Math.random() * 26));
  const char3 = String.fromCharCode(97 + Math.floor(Math.random() * 26));
  const num1 = Math.floor(Math.random() * 10);
  const num2 = Math.floor(Math.random() * 10);
  const num3 = Math.floor(Math.random() * 10);

  const id = `${char1}${char2}${char3}${num1}${num2}${num3}`;
  return id;
}

const addUser = (user) => {
  if (user["id"] == undefined) {
    let id = createId();
    let result = findUserById(id);
    while (result !== undefined) {
      id = createId();
      result = findUserById(id);
    }

    user["id"] = id;
  }

  users["users_list"].push(user);
  return user;
};

// Ensure that the POST request is json! (the "Content-Type" header should be set to "application/json")
app.post("/users", (req, res) => {
  const userToAdd = req.body;
  const newUser = addUser(userToAdd);
  res.status(201).send(newUser);
});


const deleteUserById = (id) => {
  const userToDelete = findUserById(id);
  if (userToDelete === undefined) {
    return undefined;
  }

  const updatedUsers = users["users_list"].filter((user) => user["id"] !== id);
  users["users_list"] = updatedUsers;
  
  return userToDelete;
}

app.delete("/users/:id", (req, res) => {
  const id = req.params.id // or req.params["id"]
  let result = deleteUserById(id);
  if (result === undefined) {
    res.status(404).send("Resource not found.");
  } else {
    res.status(204).send(result);
  }
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
