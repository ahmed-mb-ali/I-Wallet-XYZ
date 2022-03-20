let express = require('express');
let router = express.Router();

let documentController = require('../controllers/document');


// Get document page
router.get('/documents',documentController.listDocuments);

// Post document page
router.post('/add-document',documentController.addDocument);

// Get document by id
router.get('/document/:id',documentController.getDocumentsById);

// Update document by id
router.put('/document/:id',documentController.updateDocument);

//Delete document by id
router.delete('/document/:id',documentController.deleteDocument);

module.exports=router;
