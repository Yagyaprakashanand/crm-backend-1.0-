const { USER_TYPES, USER_STATUS } = require("../constant");
const Ticket = require("../models/ticket.models");
const User = require("../models/user.models");

// find engineer in the DB and set ticketObj.assignee = userId
async function createTicket(req, res) {
  try {
    const ticketObj = req.body;

    ticketObj.reporter = req.userId;

    const engineerCount = await User.count({
      userType: USER_TYPES.ENGINEER,
      userStatus: USER_STATUS.APPROVED,
    });
    const random = Math.floor(Math.random() * engineerCount);

    const assignee = await User.findOne({
      userType: USER_TYPES.ENGINEER,
      userStatus: USER_STATUS.APPROVED,
    }).skip(random); // skip the value in the random number like 0 1 2 if the count of the random number is 3
    ticketObj.assignee = assignee.userId;

    const ticket = await Ticket.create(ticketObj);
    res.send(ticket);
  } catch (ex) {
    res.status(500).send({
      message: `Error occurred - ${ex.message}`,
    });
  }
}

async function getAllTickets(req, res) {
  //  if the user is an admin then return all getAllTickets
  //  is the user is an engineer return ticket assigned to them
  //  if the user is a customer then return tickets created by them
  let filterObj = {};
  if (req.userType === USER_TYPES.ENGINEER) {
    filterObj = { assignee: req.userId };
  } else if (req.userType === USER_TYPES.CUSTOMER) {
    filterObj = { reporter: req.userId };
  }
  const tickets = await Ticket.find(filterObj);
  res.send(tickets);
}

async function getTicketById(req, res) {
  try {
    const ticket = await Ticket.findById(req.params.id);
    res.send(ticket);
  } catch (ex) {
    res.status(400).send({
      message: `Ticket with id ${req.params.id} not found`,
    });
  }
}

async function updateTicket(req, res) {
  const { id } = req.params;
  const ticket = await Ticket.findOne({ _id: id });

  if (
    ticket.assignee === req.userId ||
    ticket.reporter === req.userId ||
    req.userType === USER_TYPES.ADMIN
  ) {
    const updatedTicket = await Ticket.findByIdAndUpdate(id, req.body);
    res.send(updatedTicket);
  } else {
    res.status(403).send({
      message:
        "Only the ticket reporter, or the assignee, or an admin can update the ticket ",
    });
  }
}

module.exports = {
  createTicket: createTicket,
  updateTicket: updateTicket,
  getAllTickets: getAllTickets,
  getTicketById: getTicketById,
};

// module.exports = createTicket;
