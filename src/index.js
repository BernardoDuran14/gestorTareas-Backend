const express = require('express');
const morgan = require('morgan');

const app = express();
// DB
require("dotenv").config();
require("./database.js");

// Global
app.set("port", process.env.PORT || 3000);

// configuraciones
app.use(morgan("dev"));
app.use(express.json()); // express que use json

// Endpoints
app.use(require("./routes/index.js"));
app.use(require("./routes/auth.js"));
app.use(require("./routes/tasks.js"));

// Server
app.listen(app.get("port"), () => {
   console.log(`Server is running 🏎 on port ${app.get("port")}`);
});