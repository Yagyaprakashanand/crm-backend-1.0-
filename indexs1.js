const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");

const { verifyAdmin, verifyJwtToken } = require("./middlewares/verifyJwt");
const { DB_URL, DB_NAME } = require("./configs/db.configs");
const { PORT } = require("./configs/server.configs");

const app = express();
app.use(bodyParser.json());

mongoose
  .connect(`${DB_URL}`)
  .then(() => console.log("connection successful"))
  .catch((ex) => console.log("error in connection", ex));

require("./routes/auth.routes")(app);
require("./routes/user.routes")(app);
require("./routes/ticket.routes")(app);

// filterings
app.get("/crm/api/v1/users", [verifyAdmin]);

app.get("/crm/api/v1/users/:userId");
app.listen(PORT);
