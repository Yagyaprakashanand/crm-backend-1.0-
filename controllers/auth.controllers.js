const bcrypt = require("bcrypt");
const User = require("../models/user.models");
const jwt = require("jsonwebtoken");
const SECRET_KEY = require("../configs/auth.configs");
const { USER_TYPE, USER_STATUS, USER_TYPES } = require("../constant");
function signup(req, res) {
  const { name, email, userId, password, userType } = req.body;
  // console.log(name, email, userId, password, userType);
  const userObj = {
    name: name,
    email: email,
    userId: userId,
    password: bcrypt.hashSync(password, 10),
    userType: userType,
    userStatus:
      userType === USER_TYPES.CUSTOMER
        ? USER_STATUS.APPROVED
        : USER_STATUS.PENDING,
  };
  User.create(userObj)
    .then((data) => {
      res.status(200).send({
        _id: data._id,
        name: data.name,
        email: data.email,
        userId: data.userId,
        userType: data.userType,
        userStatus: data.userStatus,
      });
    })
    .catch((err) => res.status(500).send(err));
  // res.send("Got the signup request");
}

async function sign_in(req, res) {
  const { userId, password } = req.body;
  const user = await User.findOne({ userId: userId });
  // console.log(user);
  // res.send(user);

  if (user === null) {
    res.status(401).send({
      message: "failed User does not exist",
    });
    return;
  }

  if (user.userStatus !== USER_STATUS.APPROVED) {
    res.status(401).send({
      message: "Cannot allow login as user is not approved yet",
    });
    return;
  }

  const isPasswordValid = bcrypt.compareSync(password, user.password);

  if (!isPasswordValid) {
    res.status(401).send({
      message: "Password is invalid ",
    });
    return;
  }
  const token = jwt.sign(
    {
      userId: user.userId,
      userType: user.userType,
      email: user.email,
    },
    SECRET_KEY,
    {
      expiresIn: "6h",
    }
  );
  res.status(200).send({
    name: user.name,
    userStatus: user.userStatus,
    accessToken: token,
  });
}

module.exports = {
  signup: signup,
  sign_in: sign_in,
};
