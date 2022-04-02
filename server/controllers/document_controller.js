
//CRUD of documents

let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let passport = require('passport');

let DocumentModel = require('../models/document');

const Document = mongoose.model('Document');


var multer = require('multer');
  
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});
  
var upload = multer({ storage: storage });


// create documents
exports.addDocument = function(req,res){
    const document = new Document();
        document.user = req.user._id;
        document.drivingLicence = {
            data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.drivingLicence)),
            contentType: 'image/png'
        };
        document.healthCard = {
            data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.healthCard)),
            contentType: 'image/png'
        };
        document.ontarioId = {
            data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.ontarioId)),
            contentType: 'image/png'
        };
        document.passport = {
            data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.passport)),
            contentType: 'image/png'
        };

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
    Document.find({user:req.user._id},function(error,documents){
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
    const document = new Document();
    document.user = req.user._id;
    document.drivingLicence = {
        data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.drivingLicence)),
        contentType: 'image/png'
    };
    document.healthCard = {
        data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.healthCard)),
        contentType: 'image/png'
    };
    document.ontarioId = {
        data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.ontarioId)),
        contentType: 'image/png'
    };
    document.passport = {
        data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.passport)),
        contentType: 'image/png'
    };
    Document.findOneAndUpdate({user:req.user._id},(error,document)=>{
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
    Document.findOneAndDelete({user:req.user._id},(error,document)=>{
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
