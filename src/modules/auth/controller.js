import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";
import * as AuthModel from './model.js';
import * as UserModel from '../users/model.js';
import { passwordRegex, isProduction, SECRET_KEY } from "../../configs/config.js";
import { validateUserData } from "../../utils/validateData.js";
import { createTokenAccess } from "../../libs/jwt.js";

export const login = async (req, res, next) => {
    try {
        const { user_ID, password } = req.body;

        const user = await AuthModel.getUserByID(user_ID);

        if(!user){
            const err = new Error(`El usuario con el documento: ${user_ID} no se encuentra registrado`);
            err.status = 400;
            throw err;
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        
        if(!isPasswordCorrect){
            const err = new Error(`Contraseña incorrecta`);
            err.status = 400;
            throw err;
        }

        const token = await createTokenAccess({ 
            user_ID : user.user_ID, 
            names : user.names,
            email : user.email, 
            phone : user.phone,
            role_ID : user.role_ID
        });

        res.cookie('token', token, {
            httpOnly : true,
            secure: isProduction,  // La cookie solo se envía a través de HTTPS
            sameSite: 'none',     
            maxAge: 3600000,     // La cookie expira en 1 hora (valor en milisegundos)
            path: '/',          // Ruta en la que la cookie es válida
        });

        return res.status(200).json({
            message : 'Sesión Iniciada Correctamente', 
            user : {
                user_ID : user.user_ID,
                names : user.names,
                email : user.email,
                phone : user.phone,
                role_ID : user.role_ID
            }, token
        });

    } catch (err) {
        next(err);
    }
} 

export const register = async(req, res, next) => {
    try {
        const { password, user_ID, names, email, trade_name, company, address, phone,
            type_document_ID } = req.body;  

        const isUserRegistered = await AuthModel.findUser(user_ID, email, phone);

        if(isUserRegistered){
            const err = new Error('El usuario ya se encuentra registrado, revisa tu documento, email o celular');
            err.status = 400;
            throw err; 
        }

        const dataValidated = await validateUserData(req.body)

        if (!passwordRegex.test(password)) {
            const err = new Error(
                'La contraseña debe tener al menos 8 caracteres, incluir una letra mayúscula, una letra minúscula, un número y un símbolo especial'
            );
            err.status = 400;
            throw err;
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const municipality_ID = dataValidated.municipalityInfo.id;

        await AuthModel.register({
            user_ID, names, trade_name, company, address, email, phone, type_document_ID, 
            municipality_ID, password : passwordHash
        });

        const token = await createTokenAccess({ user_ID, names, email, phone });

        res.cookie('token', token, {
            httpOnly : true,
            secure: isProduction,        // La cookie solo se envía a través de HTTPS
            sameSite: 'none',  
            maxAge: 3600000,     // La cookie expira en 1 hora (valor en milisegundos)
            path: '/',           // Ruta en la que la cookie es válida
        });

        return res.status(201).json({
            message : 'Registrado correctamente', 
            user : {
                names, user_ID, email, phone, role_ID : 2
            } , token
        })

    } catch (err) {
        next(err);
    }   
}

export const logout = async (req, res, next) => {
    try {
        res.clearCookie('token', {
            httpOnly: true, // Asegurar que la cookie solo sea accesible desde el servidor
            secure: isProduction, // Solo en HTTPS en producción
            sameSite: 'none',
        });

        res.clearCookie('tokenClient', {
            secure: isProduction, // Solo en HTTPS en producción
            sameSite: 'none',
        });

        return res.status(200).json({ message: 'Sesión cerrada correctamente, vuelve pronto' });

    } catch (err) {
        next(err);
    }
}

export const changePassword = async(req, res, next) => {
    try {
        const { user_ID, email, phone, password } = req.body;

        if (!passwordRegex.test(password)) {
            const err = new Error(
                'La contraseña debe tener al menos 8 caracteres, incluir una letra mayúscula, una letra minúscula, un número y un símbolo especial'
            );
            err.status = 400;
            throw err;
        }

        const user = await AuthModel.getUserByID(user_ID);

        if(!user){
            const err = new Error(`El usuario con el documento: ${user_ID} no ha sido encontrado`);
            err.status = 404;
            throw err;
        }

        if(user.email !== email || user.phone !== phone){
            const err = new Error(`Correo o celular incorrecto`);
            err.status = 404;
            throw err;
        }

        const passwordHash = await bcrypt.hash(password, 10);

        await UserModel.changePassword({
            user_ID, password : passwordHash
        })

        return res.status(200).json({
            message : 'Contraseña actualizada correctamente'
        })
        

    } catch (err) {
        next(err)
    }
} 

export const verifyToken = async (req, res, next) => {
    try {
        const token = req.cookies.tokenClient;

        if(!token){
            const err = new Error('Por favor, iniciar sesión');
            err.status = 401;
            throw err;
        }

        const decoded = JWT.verify(token, SECRET_KEY);
        req.user = decoded;

        return res.status(200).json({ user : decoded });  

    } catch (err) {
        next(err);
    }
}