import express from "express";
import * as FactusController from './controller.js';

const router = express.Router();

router.get('/my-bills', FactusController.getAllBills);
router.get('/my-bill/:number', FactusController.getBillByNumber);
router.get('/measurement-units', FactusController.getMeasurementUnitsRequest);
router.post('/my-bill', FactusController.createBill);

export default router;