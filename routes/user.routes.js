const {
  getAllUsers,
  getUserByUserId,
  updateUserDetails,
} = require("../controllers/user.controller");
const { verifyAdmin } = require("../middlewares/verifyJwt");
const { events } = require("../models/user.models");

module.exports = function (app) {
  app.get("/crm/api/v1/users", [verifyAdmin], getAllUsers); // verifyAdmin ia a middleware;

  app.get("/crm/api/v1/users/:userId", [verifyAdmin], getUserByUserId);
  app.put("/crm/api/v1/users/:userId", [verifyAdmin], updateUserDetails);
};
