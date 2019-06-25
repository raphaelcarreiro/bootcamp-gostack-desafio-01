const express = require("express");

const server = express();

let projects = [
  {
    id: 1,
    title: "Node Desafio",
    tasks: []
  },
  {
    id: 2,
    title: "BootCamp",
    tasks: []
  }
];

let requestCounter = 0;

server.use(express.json());

server.use((req, res, next) => {
  requestCounter++;
  console.log(`Request ${requestCounter}`);
  return next();
});

function checkProject(req, res, next) {
  let exists = false;

  projects.forEach(item => {
    if (item.id === parseInt(req.params.id)) {
      exists = true;
    }
  });

  if (!exists) {
    return res.status(400).json({
      message: "Project ID not found"
    });
  }

  return next();
}

server.post("/projects", (req, res) => {
  const { title, id } = req.body;

  projects.push({
    id: id,
    title: title,
    tasks: []
  });

  return res.json(projects);
});

server.post("/projects/:id/tasks", checkProject, (req, res) => {
  const { id } = req.params;
  const { tasks } = req.body;

  projects = projects.map(project => {
    return project.id === parseInt(id) ? { ...project, tasks: tasks } : project;
  });

  return res.json(projects);
});

server.get("/projects", (req, res) => {
  return res.json(projects);
});

server.put("/projects/:id", checkProject, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  projects = projects.map(item => {
    return item.id === parseInt(id) ? { ...item, title: title } : item;
  });

  return res.json(projects);
});

server.delete("/projects/:id", checkProject, (req, res) => {
  const { id } = req.params;

  projects = projects.filter(item => {
    return item.id !== parseInt(id);
  });

  return res.json();
});

server.listen(3000);
