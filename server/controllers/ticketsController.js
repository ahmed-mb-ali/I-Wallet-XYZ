let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let passport = require('passport');
const nodemailer = require('nodemailer');



//Import user model
let ticket = require('../models/ticket');


// create the User Model instance
let userModel = require('../models/user');
let User = userModel.User; // alias

module.exports.showAll = async (req, res, next) => {
    var items = await ticket.find({replyid : null, });
    res.render('tickets/list',
        {
            title: 'Home', displayName: req.user ? req.user.displayName : '',
            isAdmin: req.user ? req.user.isAdmin : false,
            title: "Tickets",
            items: items
        });
}

module.exports.displayNewTicket = (req, res, next) => {
    res.render('tickets/new', { items  : [], title: 'Home', displayName: req.user ? req.user.displayName : '', isAdmin: req.user ? req.user.isAdmin : false, title: 'Customer Care', displayName: req.user ? req.user.displayName : '' });
}


module.exports.showReply = async (req, res, next) => {

    var id = req.query.id;
    var item = await ticket.findById(id);
    var items = await ticket.find({replyid : id});
    if (item)
        res.render('tickets/new', { items : items,  item: item, title: 'Home', displayName: req.user ? req.user.displayName : '', isAdmin: req.user ? req.user.isAdmin : false, title: 'Customer Care', displayName: req.user ? req.user.displayName : '' });
    else
        res.redirect("/tickets");
}


module.exports.processReply =async (req, res, next) => {
    var id = req.query.id;
    var item = await ticket.findById(id);
    if (item) {
        const data = req.body;

        let newTicket = ticket({
            senderid:req.user.id,
            title: data.title,
            description: data.description,
            status: "Reply",
            createdate: new Date(),
            replyid : id
        });

        await ticket.create(newTicket, (err) => {
            if (err) {
                console.log(err);
            }
        });

        await ticket.findByIdAndUpdate(id,{status : "Reply"});
        res.redirect("/tickets");
        return;
    }
    res.redirect("ticket/reply?id=" + id);
}

module.exports.addTicket = async (req, res, next) => {
    let errors = {}
    let date = new Date();
    let data = req.body;
    let id = req.params.id;
    let newstatus = "New";



    data.senderid = req.user.id;
    //Error checking
    if (!data.senderid) {
        errors.senderid = "Sender User Id is required";
    }
    if (!data.title) {
        errors.title = "Title is required"
    }
    if (!data.description) {
        errors.description = "Description is required"
    }
    if (!data.status) {
        data.status = "New";
    }

    if (Object.keys(errors).length) {
        console.log(errors)
        res.render('tickets/new',
            {
                items : [],
                title: 'Home', displayName: req.user ? req.user.displayName : '',
                isAdmin: req.user ? req.user.isAdmin : false,
                title: "NewTicket",
                item: data,
                errors: errors
            });
        return;
    }

    let newTicket = ticket({

        senderid: data.senderid,
        title: data.title,
        description: data.description,
        status: newstatus,
        createdate: date
    });

    ticket.create(newTicket, (err) => {
        if (err) {
            console.log(err);
        }
    });
    res.redirect("/tickets")
}


