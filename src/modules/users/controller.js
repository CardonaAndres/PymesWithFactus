import { validateUserData } from '../../utils/validateData.js';
import { getUserByID, findUser } from '../auth/model.js';
import * as UserModel from './model.js';

export const getAllUsers = async (req, res, next) => {
    try {
        const { page = 1 } = req.query; 
        const offset = (page - 1) * 12; 
        const totalUsers = await UserModel.totalUsers(); 
        const users = await UserModel.getUsersPaginate(offset);
        const totalPages = Math.ceil(totalUsers / 12);

        users.map(user => delete user.password);

        return res.status(200).json({
            users,
            pagination: {
                currentPage: parseInt(page),   
                totalPages: totalPages,        
                totalUsers: totalUsers,          
            },
            message: "Tarea exitosa"
        });

    } catch (err) {
        next(err);
    }
}

export const getUserByUserID = async (req, res, next) => {
    try {   
        const { userID } = req.params;
        const user = await getUserByID(userID);

        if(!user){
            const err = new Error(`El usuario con el documento: ${userID} no ha sido encontrado`);
            err.status = 404;
            throw err;
        }

        delete user.password;

        return res.status(200).json(user)

    } catch (err) {
        next(err);
    }
}

export const profile = async (req, res, next) => {
    try {
        const { user_ID } = req.user;
        const user = await getUserByID(user_ID);

        if(!user){
            const err = new Error('El usuario no ha sido encontrado');
            err.status(404);
            throw err;
        }

        delete user.password;

        return res.status(200).json(user);

    } catch (err){
        next(err);
    }

}

export const update = async (req, res, next) => {
    try {
        const user_ID = req.user.user_ID;
        const user = await getUserByID(user_ID);
        
        if(!user || user.user_ID !== user_ID){
            const err = new Error('Problemas al buscar el usuario el cual se desea actualizar');
            err.status = 404;
            throw err;
        }

        const { names = user.names, 
                email = user.email,
                trade_name = user.trade_name, 
                company = user.company, 
                address = user.address, 
                phone  = user.phone, 
                type_document_ID = user.type_document_ID,
                municipality
        } = req.body;

        const verifyPhone = await findUser('', '', phone);
        const verifyEmail = await findUser('', email, '');

        if(verifyEmail && verifyEmail.user_ID !== user_ID){
            const err = new Error('El correo se encuentre en uso');
            err.status = 400;
            throw err;
        }

        if(verifyPhone && verifyPhone.user_ID !== user_ID){
            const err = new Error('El celular se encuentre en uso');
            err.status = 400;
            throw err;
        }

        const validatedInfo = await validateUserData({
            user_ID, names, address, email, phone, type_document_ID, municipality
        });

        await UserModel.update({
            names, email, trade_name, company, address, phone, type_document_ID, 
            municipality_ID : validatedInfo.municipalityInfo.id, user_ID
        });

        res.status(200).json({
            message : 'Datos actualizados correctamente'
        });

    } catch (err){
        next(err);
    }

}

export const updateByAdmin = async (req, res, next) => {
    try {
        const { new_user_ID, role_ID = 2 } = req.body;
        const { userID } = req.params;
        const currentUser  = await getUserByID(userID);

        if(!currentUser){
            const err = new Error('El usuario con la CC / NIT no ha sido encontrado');
            err.status = 404;
            throw err
        }

        const isInUseUserID = await getUserByID(new_user_ID);

        if(isInUseUserID){
            const err = new Error('CC / NIT en uso');
            err.status = 404;
            throw err
        }

        await UserModel.updateByAdmin({
            email : currentUser.email, role_ID, new_user_ID
        })

        return res.status(200).json({
            message : 'Información actualizada correctamente'
        })
    

    } catch (err){
        next(err);
    }
}
