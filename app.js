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

function isTodoOr404(todo, res) {
  if (!todo) return res.render('404');
}

// GET home page
app.get('/', (req, res) => {
  todos = todos.sort((a, b) => b.id - a.id);
  res.render('todos/index', { todos });
});

// GET all todos
app.get('/todos', (req, res) => {
  // sort todos DESC order
  todos = todos.sort((a, b) => b.id - a.id);
  res.render('todos/todos-list', { todos });
});

// GET new todo form
app.get('/todos/new', (req, res) => {
  res.render('todos/new-form');
});

// POST a new todo
app.post('/todos', (req, res) => {
  todosLength += 1;
  const newTodo = {
    id: todosLength,
    text: req.body.text
  };
  todos = [...todos, newTodo];
  res.render('todos/show', { todo: newTodo });
});

// GET a todo by id for editing
app.get('/todos/edit/:id', (req, res) => {
  const todo = todos.find(todo => todo.id === parseInt(req.params.id));
  isTodoOr404(todo, res);
  res.render('todos/edit-form', { todo });
});

// PUT update a todo by id  
app.put('/todos/:id', (req, res) => {
  const todoId = parseInt(req.params.id);
  const todoIndex = todos.findIndex(todo => todo.id === todoId);
  isTodoOr404(todos[todoIndex], res);

  const updatedTodo = {
    id: todoId,
    text: req.body.text
  };

  todos[todoIndex] = updatedTodo;
  res.render('todos/show', { todo: updatedTodo });
});


// DELETE a todo by id
app.delete('/todos/:id', (req, res) => {
  const todoIndex = todos.findIndex(t => t.id === parseInt(req.params.id));
  isTodoOr404(todos[todoIndex], res);

  todos.splice(todoIndex, 1);
  todos = todos.sort((a, b) => b.id - a.id);
  res.render('todos/todos-list', { todos });
});

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
