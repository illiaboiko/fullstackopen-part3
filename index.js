const express = require("express");
const app = express();

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.use(express.json());

app.get("/", (request, response) => {
  response.send("<h1>Back-End Phonebook exercise</h1/");
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/info", (request, response) => {
  console.log(request.headers);
  const totalPersons = persons.length;
  const timestamp = new Date().toString();
  console.log(`total: ${totalPersons} \n timestamp: ${timestamp}`);
  response.send(`Phonebook has info for ${totalPersons} people 
                    <br>
                    ${timestamp}`);
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const person = persons.find((person) => person.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
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
        error: 'name and number must be specified'
    })
  } else if (persons.find(p=> p.name === name)) {
    return response.status(400).json({
        error: 'name must be unique'
    })
    
  }

  const person = {
    id: generateId(),
    name: name,
    number: number,
  };

  persons = persons.concat(person);
  console.log("person added", person);
  response.json(person);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
