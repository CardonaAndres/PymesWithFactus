import express from "express";
import * as FactusController from './controller.js';

const router = express.Router();

router.get('/my-bills', FactusController.getAllBills);
router.get('/my-bill/:number', FactusController.getBillByNumber);
router.post('/my-bill', FactusController.createBill);

export default router;