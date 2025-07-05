require('dotenv').config();
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRouter = require('./routes/auth');
var tasksRouter = require('./routes/tasks');
var supervisorsRouter = require('./routes/supervisors');
var subordinatesRouter = require('./routes/subordinates');
var groupsRouter = require('./routes/groups');
var authenticateToken = require('./middleware/authenticate');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', authenticateToken, usersRouter);
app.use('/auth', authRouter);
app.use('/tasks', authenticateToken, tasksRouter);
app.use('/supervisors', authenticateToken, supervisorsRouter);
app.use('/subordinates', authenticateToken, subordinatesRouter);
app.use('/groups', authenticateToken, groupsRouter);

module.exports = app;
