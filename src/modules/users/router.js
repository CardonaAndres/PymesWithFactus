import express from 'express';
import * as UserController from '../users/controller.js';
import { checkRole } from '../../middlewares/checkRole.js';

const router = express.Router();

router.get('/profile', UserController.profile);
router.get('/total-users', checkRole([ 1 ]), UserController.getAllUsers);
router.get('/user/:userID', checkRole([ 1 ]), UserController.getUserByUserID);
router.put('/admin-update-user/:userID', checkRole([ 1 ]), UserController.updateByAdmin);
router.put('/user-update', UserController.update);


export default router