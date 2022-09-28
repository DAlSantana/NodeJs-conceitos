const express = require('express');
const cors = require('cors');

const { v4: uuidv4, v4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const { username } = request.headers;

  const user = users.find((user) => user.username === username);

  if (!user) {
    return response.status(404).json({ error: "User not found" })
  }

  request.user = user;

  return next();
}

app.post('/users', (request, response) => {
  // Complete aqui
  const { name, username } = request.body;
  const id = uuidv4();

  const userExist = users.find((user)=> user.username === username);

  //Video
  if(userExist){
    return response.status(400).json({error: "Username aleready exists"});
  }

  const createdUser = {
    id,
    name,
    username,
    todos: []
  }

  users.push(createdUser);

  return response.status(201).send(createdUser);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  //Video
  const {user} = request;

  return response.json(user.todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { title, deadline } = request.body;
  const { user } = request;
  const id = uuidv4();

  const createdTodo = {
    id: id,
    title: title,
    deadline: new Date(deadline),
    done: false,
    created_at: new Date()
  };

  user.todos.push(createdTodo);


  return response.status(201).send(createdTodo);
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { title, deadline } = request.body;
  const { id } = request.params;
  const { user } = request;

  const todo = user.todos.find((todo) => todo.id === id);

  if(!todo){
    return response.status(404).json({error: "Todo not found"});
  }

  // Find trabalha com referência em memória por isso não retiramos e adicionamos novamente
  // const updatedTodo = {
  //   ...todo,
  //   title: title,
  //   deadline: deadline,
  // };
  
  todo.title = title;
  todo.deadline = new Date(deadline);

  return response.json(todo);
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { id } = request.params;
  let { user } = request;

  const todo = user.todos.find((todo) => todo.id === id);
  
  if(!todo){
    return response.status(404).json({error: "Todo not found"});
  }

  const updatedTodo = {
    ...todo,
    done: true
  };

  return response.status(200).send(updatedTodo);
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { id } = request.params;
  let { user } = request;

  const todoIndex = user.todos.findIndex((todo) => todo.id === id);

  if(todoIndex === -1){
    return response.status(404).json({error: "Todo not found"});
  }

  user.todos.splice(todoIndex, 1);

  return response.status(204).json()
});

module.exports = app;