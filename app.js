const express = require('express');
const app = express();
const path = require('path');
const ejsMate = require('ejs-mate');
const morgan = require('morgan');

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.locals.title = 'Todos App with HTMX';

// In-memory array to store todos
let todos = [
  {
    id: 1,
    text: 'Take out the trash'
  },
  {
    id: 2,
    text: 'Do the laundry'
  },
  {
    id: 3,
    text: 'Walk the dog'
  }
];
let todosLength = todos.length;

// GET home page
app.get('/', (req, res) => {
  todos = todos.sort((a, b) => b.id - a.id);
  res.render('todos/index', { todos, title: 'Todos Index' });
});

// GET all todos
app.get('/todos', (req, res) => {
  // sort todos DESC order
  todos = todos.sort((a, b) => b.id - a.id);
  res.render('todos/todos-list', { todos });
});

// GET new todo form
app.get('/todos/new', (req, res) => {
  res.render('todos/new-form', { title: 'New Todo' });
});

// POST a new todo
app.post('/todos', (req, res) => {
  todosLength += 1;
  const newTodo = {
    id: todosLength,
    text: req.body.text
  };
  todos = [...todos, newTodo];
  res.render('todos/show', { todo: newTodo, includeNewForm: false });
});

// GET a todo by id
app.get('/todos/:id', (req, res) => {
  const todo = todos.find(todo => todo.id === parseInt(req.params.id));
  if (!todo) return res.status(404).render('404');
  res.render('todos/show', { todo, includeNewForm: true });
});

// GET a todo by id for editing
app.get('/todos/edit/:id', (req, res) => {
  const todo = todos.find(todo => todo.id === parseInt(req.params.id));
  if (!todo) return res.status(404).render('404');
  res.render('todos/edit-form', { todo, title: 'Edit Todo' });
});

// PUT update a todo by id  
app.put('/todos/:id', (req, res) => {
  const todoId = parseInt(req.params.id);
  const todoIndex = todos.findIndex(todo => todo.id === todoId);
  if (todoIndex === -1) return res.status(404).render('404');

  const updatedTodo = {
    id: todoId,
    text: req.body.text
  };

  todos[todoIndex] = updatedTodo;
  res.render('todos/show', { todo: updatedTodo, includeNewForm: true });
});


// DELETE a todo by id
app.delete('/todos/:id', (req, res) => {
  const todoIndex = todos.findIndex(t => t.id === parseInt(req.params.id));
  if (todoIndex === -1) return res.status(404).render('404');

  todos.splice(todoIndex, 1);
  todos = todos.sort((a, b) => b.id - a.id);
  res.render('todos/todos-list', { todos });
});

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
