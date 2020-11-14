let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');


// create a reference to the model
let Contact = require('../models/business_contacts');


module.exports.displayContactList = (req, res, next) => {
    Contact.find((err, contactList) => {
        if(err)
        {
            return console.error(err);
        }
        else
        {
            //console.log(ContactList);

            res.render('business_contacts/list', 
            {title: 'Business Contacts',
             ContactList:contactList,
             displayName: req.user ? req.user.displayName: ''});
        }
    });
}

module.exports.displayAddPage = (req,res,next) =>{
    res.render('business_contacts/add', {title: 'Add Contact',
    displayName: req.user ? req.user.displayName: ''});

}

module.exports.processAddPage = (req,res,next) => {
    let newContact = Contact({
        "name": req.body.name,
        "number": req.body.number,
        "email": req.body.email,
       
    });
    Contact.create(newContact, (err, Book) =>{
        if(err)
        {
            console.log(err);
            res.end(err);
        }
        else
        {
            //refresh the Contact list
            res.redirect('/business_contacts-list');
        }
    });
}


module.exports.displayEditPage =  (req,res,next) => {
    let id = req.params.id;

    Contact.findById(id, (err, contactToUpdate) => {
        if(err)
        {
            console.log(err);
            res.end(err);
        }
        else
        {
            //show the update view
            res.render('business_contacts/update', {title: 'Update Contact', contact: contactToUpdate,
            displayName: req.user ? req.user.displayName: ''});
        }
    });
}

module.exports.processEditPage =  (req,res,next) => {
    let id = req.params.id;

    let updatedBook = Contact({
        "_id": id,
        "name": req.body.name,
        "number": req.body.number,
        "email": req.body.email,
    });

    Contact.updateOne({_id: id}, updatedBook, (err) => {
        if(err)
        {
            console.log(err);
            res.end(err);
        }
        else
        {
            //refresh the contact list
            res.redirect('/business_contacts-list');
        }
    });
}

// delete contact list individually

module.exports.performDelete = (req,res,next) => { 
    let id = req.params.id;

    Contact.remove({_id: id}, (err) => {
        if(err)
        {
            console.log(err);
            res.end(err);
        }
        else
        {
            //refresh the book list
            res.redirect('/business_contacts-list');
        }
    });

}