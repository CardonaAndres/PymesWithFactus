import express from "express";
import * as ContactController from './controller.js';

const router = express.Router();

router.get('/my-contacts', ContactController.getAllContacts);
router.get('/my-contact/:document_number', ContactController.getContact);
router.post('/my-contact', ContactController.createContact);
router.put('/my-contact/:id', ContactController.updateContact);
router.delete('/my-contact/:id', ContactController.deleteContact);

export default router;