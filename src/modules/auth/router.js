import express from "express";
import * as AuthController from './controller.js'

const router = express.Router();

router.post('/login', AuthController.login);
router.post('/register', AuthController.register);
router.post('/logout', AuthController.logout);
router.post('/verify-token', AuthController.verifyToken)
router.post('/change-password', AuthController.changePassword);

export default router;
