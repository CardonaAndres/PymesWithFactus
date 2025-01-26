import { CLIENT_ORIGIN } from "./config.js";
import { errorHandler } from "../middlewares/errorHandler.js";
import { verifyToken } from '../middlewares/authMiddleware.js';
import express from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from 'cookie-parser';
import AuthRouter from '../modules/auth/router.js';
import UserRouter from '../modules/users/router.js';
import ContactRouter from '../modules/contacts/router.js';
import ProductRouter from '../modules/products/router.js';
import FactusController from '../modules/factusAPI/router.js';  

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: CLIENT_ORIGIN, 
    credentials: true,  
    methods: ['GET', 'POST', 'PUT', 'DELETE'] 
}));

app.use('/API/auth', AuthRouter);

app.use('/API/users', verifyToken, UserRouter);
app.use('/API/contacts', verifyToken, ContactRouter);
app.use('/API/products', verifyToken, ProductRouter);
app.use('/API/factus', verifyToken, FactusController);

app.use(errorHandler);

export default app;