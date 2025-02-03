import express from "express";
import * as ProductController from "./controller.js";

const router = express.Router();

router.get('/my-products', ProductController.getMyProducts);
router.get('/my-products/all', ProductController.getAllMyProducts);
router.get('/my-product/:id', ProductController.getMyProduct);
router.post('/my-product', ProductController.registerProduct);
router.put('/my-product/:id', ProductController.updateProduct);
router.delete('/my-product/:id', ProductController.deleteProduct);

export default router;