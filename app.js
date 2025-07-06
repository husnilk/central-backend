require("dotenv").config();
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var authRouter = require("./routes/auth");
var tasksRouter = require("./routes/tasks");
var supervisorsRouter = require("./routes/supervisors");
var subordinatesRouter = require("./routes/subordinates");
var groupsRouter = require("./routes/groups");
var profileRouter = require("./routes/profile");
var logbooksRouter = require("./routes/logbooks");
var authenticateToken = require("./middleware/authenticate");

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/api/users", authenticateToken, usersRouter);
app.use("/api/auth", authRouter);
app.use("/api/tasks", authenticateToken, tasksRouter);
app.use("/api/supervisors", authenticateToken, supervisorsRouter);
app.use("/api/subordinates", authenticateToken, subordinatesRouter);
app.use("/api/groups", authenticateToken, groupsRouter);
app.use("/api/profile", profileRouter);
app.use("/api/tasks", authenticateToken, logbooksRouter);

module.exports = app;
