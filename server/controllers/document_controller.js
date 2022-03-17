
//CRUD of documents

let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let passport = require('passport');

//let DocumentModel = require('../models/document');
//let Document = DocumentModel.Document;

const Document = mongoose.model('Document');

// create documents
exports.addDocument = function(req,res){
    const document = new Document(req.body.document);
    document.save((error)=>{
        if (error){
            return res.status(400).json({
                isSuccess:false,
                message:'Unable to add document',
                error:error,
            })
        } else{
            return res.status(200).json({
                isSuccess: true,
                message:'Document added',
            })
        }
    });
};

// list all documents
exports.listDocuments = function(req,res){
    Document.find({},function(error,documents){
        if(error){
            return res.status(400).json({
                isSuccess:false,
                message:'Unable to retrive document list',
                error:error,
            })
        } else{
            return res.status(200).json({
                isSuccess:true,
                message:'Successfull retriving documents',
                data:documents,
            })
        }
    })
};

// get documents by id
exports.getDocumentsById = function(req,res,id){
    id=req.params.id;
    Document.findById(id).exec((error,document)=>{
        if(error){
            return res.status(400).json({
                isSuccess:false,
                message:'Counter error while retriving document ' + id,
                error:error,
            })
        }
        if(!document){
            return res.status(400).json({
                isSuccess:false,
                message:'Unable to retrive document ' + id,
                error:error,
            })
        }
        return res.status(200).json({
            isSuccess:true,
            message:'Successfull retriving document ' + id,
            data:document,
        })
    })
}


// update document
exports.updateDocument=function(req,res,id){
    id=req.params.id;
    const document = req.body.document;
    Document.findByIdAndUpdate(id,document,(error,document)=>{
        if (error){
            return res.status(400).json({
                isSuccess:false,
                message:'Unable to update document ' + id,
                error:error,
            })
        } else {
            return res.status(200).json({
                isSuccess:true,
                message:'Successfull updating document ' + id,
                data:document,
            })
        }

    })
}


// delete document
exports.deleteDocument = function(req,res,id){
    id=req.params.id;
    Document.findByIdAndDelete(id,(error,document)=>{
        if (error){
            return res.status(400).json({
                isSuccess:false,
                message:'Unable to delete document ' + id,
                error:error,
            })
        } else {
            return res.status(200).json({
                isSuccess:true,
                message:'Successfull delete document ' + id,
                data:document,
            })
        }

    })
}
