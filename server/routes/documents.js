let express = require('express');
let router = express.Router();

let documentController = require('../controllers/document_controller');


// Get document page
router.get('/list-document',documentController.listDocuments);

// Post document page
router.post('/add-document',documentController.addDocument);

// Update document by id
router.post('/update-document',documentController.updateDocument);

//Delete document by id
router.delete('/document/:id',documentController.deleteDocument);

module.exports=router;
