const morgan = require("morgan");
const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();

const Person = require("./models/person");

app.use(express.static("dist"));
app.use(cors());

let persons = [];

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(express.json());
morgan.token("body", (req, res) => JSON.stringify(req.body));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

app.get("/", (request, response) => {
  response.send("<h1>Back-End Phonebook exercise</h1/");
});

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

app.get("/info", (request, response) => {
  Person.find({}).then((persons) => {
    const totalPersons = persons.length;
    const timestamp = new Date().toString();

    console.log(`total: ${totalPersons} \n timestamp: ${timestamp}`);
    response.send(`Phonebook has info for ${totalPersons} people 
                    <br>
                    ${timestamp}`);
  });
});

app.get("/api/persons/:id", (request, response) => {
  Person.findById(request.params.id).then( person => {
    response.json(person)
  })
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const person = persons.find((person) => person.id === id);
  if (person) {
    persons = persons.filter((p) => p.id !== id);
    console.log("deleted successfully");
    response.json(person);
  } else {
    response.status(204).end();
  }
});

const generateId = () => {
  const maxId = persons.length > 0 ? Math.max(...persons.map((n) => n.id)) : 0;
  return maxId + 1;
};

app.post("/api/persons", (request, response) => {
  const body = request.body;
  const { name, number } = body;

  if (!name || !number) {
    return response.status(400).json({
      error: "name and number must be specified",
    });
  }
  // } else if (persons.find((p) => p.name === name)) {
  //   return response.status(400).json({
  //     error: "name must be unique",
  //   });
  // }

  const person = new Person ({
    name: name,
    number: number,
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
  
});

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
