const { signup, sign_in } = require("../controllers/auth.controllers");

module.exports = function (app) {
  app.post("/crm/api/v1/auth/signup", signup);
  app.post("/crm/api/v1/auth/sign_in", sign_in);
};
