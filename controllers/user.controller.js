const { USER_TYPES, USER_STATUS } = require("../constant");
const User = require("../models/user.models");

async function getAllUsers(req, res) {
  const queryObj = {};
  if (
    [USER_TYPES.ENGINEER, USER_TYPES.CUSTOMER, USER_TYPES.ADMIN].includes(
      req.query.userType
    )
  ) {
    queryObj.userType = req.query.userType;
  }
  if (
    [USER_STATUS.PENDING, USER_STATUS.APPROVED].includes(req.query.userStatus)
  ) {
    queryObj.userStatus = req.query.userStatus;
  }
  const users = await User.find(queryObj).select(
    "name email userId userStatus userType"
  );
  res.status(200).send(users);
}

async function getUserByUserId(req, res) {
  const userId = req.params.userId;
  try {
    const user = await User.findById(userId).select("-password");

    if (user === null) {
      res.status(404).send({
        message: `User with userId ${userId} does not exist`,
      });
      return;
    }
    res.status(200).send(user);
  } catch (ex) {
    res.status(404).send({
      message: `User with userId ${userId} does not exist`,
    });
  }
}

async function updateUserDetails(req, res) {
  const userId = req.params.userId;
  try {
    const user = await User.findByIdAndUpdate(userId, {
      userType: req.body.userType,
      userStatus: req.body.userId,
      name: req.body.name,
    });

    res.status(200).send(user);
  } catch (ex) {
    res.status(404).send({
      message: `User with userId ${userId} does not exist`,
    });
  }
}

module.exports = {
  getAllUsers: getAllUsers,
  getUserByUserId: getUserByUserId,
  updateUserDetails: updateUserDetails,
};
