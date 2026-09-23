// src/MyApp.jsx
import React, { useState, useEffect } from "react";
import Table from "./Table";
import Form from "./Form";

const characters = [
  {
    name: "Charlie",
    job: "Janitor",
  },
  {	
    name: "Mac",
    job: "Bouncer",
  },
  {
    name: "Dee",
    job: "Aspiring actress",
  },
  {
    name: "Dennis",
    job: "Bartender",
  },
];

function MyApp() {
  const [characters, setCharacters] = useState([]);

  function removeOneCharacter(id) {
    fetch(`http://localhost:8000/users/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.status === 204) {
          fetchUsers()
            .then((res) => res.json())
            .then((json) => setCharacters(json))
            .catch((error) => {
              console.log(error);
            });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function updateList(person) {
    postUser(person)
      .then((response) => { 
         if (response.status === 201) {
           response.json()
             .then((data) => {
               setCharacters([...characters, data]);
             })
             .catch((error) => {
               console.log(error);
             });
         }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function fetchUsers() {
    const promise = fetch("http://localhost:8000/users");
    return promise;
  }

  function postUser(person) {
    const promise = fetch("http://localhost:8000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(person),
    });

    return promise;
  }

  useEffect (() => {
    fetchUsers()
      .then((res) => res.json())
      .then((json) => setCharacters(json))
      .catch((error) => {
        console.log(error);
       });
  }, []);

  return (
    <div className="container">
      <Table characterData={characters} removeCharacter={removeOneCharacter} />
      <Form handleSubmit={updateList} />
    </div>
  );
}

export default MyApp;
