let mongoose = require('mongoose');

let Schema = mongoose.Schema;
let Model = mongoose.model;

// status - New / Read / Reply / Solve / Close
// create a model class
let Ticket = mongoose.Schema({
    
    senderid: String,
    title: String,
    name: String,
    description: String,
    status: String,
    replyid: String,
    createdate: Date,
    updatedate: Date
},
{
  collection: "tickets"
});

module.exports = Model('Ticket', Ticket);