import * as ContactModel from './model.js';
import { validateUserData } from '../../utils/validateData.js';

export const getAllContacts = async (req, res, next) => {
    try {

        const { user_ID } = req.user;
        const { page = 1 } = req.query; 
        const offset = (page - 1) * 12; 
        const totalContacts = await ContactModel.getTotalContacts(user_ID)
        const contacts = await ContactModel.getAllContactsPaginate(user_ID, offset);
        const totalPages = Math.ceil(totalContacts / 12);

        return res.status(200).json({
            contacts,
            pagination: {
                currentPage: parseInt(page),   
                totalPages: totalPages,        
                totalUsers: totalContacts,          
            },
            message: "Tarea exitosa"
        });

    } catch (err) {
        next(err);
    }
}

export const getContact = async (req, res, next) => {
    try {
        const { user_ID } = req.user;
        const { document_number } = req.params;

        const contact = await ContactModel.getContactByDocNumber(user_ID, document_number);

        if(!contact){
            const err = new Error('El contacto no se encuentra registrado');
            err.status = 404;
            throw err;
        }

        return res.status(200).json(contact)

    } catch (err) {
        next(err);
    }
}

export const createContact = async (req, res, next) => {
    try {
        const { user_ID } = req.user;
        const { names, company = "", address, email, phone, document_number, 
                type_document_ID, municipality } = req.body;
               
        const dataValidated = await validateUserData({
            user_ID : document_number, names, address, email, phone, type_document_ID, municipality
        });

        const isContactReRegistered = await ContactModel.getContactByDocNumber(
            user_ID, document_number
        );

        if (isContactReRegistered) {
            const err = new Error('El usuario ya se encuentra registrado en tu lista de contactos');
            err.status = 400;
            throw err
        }

        await ContactModel.createContact({
            user_ID, names, company, address, email, phone, document_number, type_document_ID,
            municipality_ID : dataValidated.municipalityInfo.id
        });

        return res.status(201).json({
            message : 'Contacto agregado correctamente'
        });

    } catch (err) {
        next(err);
    }
}

export const updateContact = async (req, res, next) => {
    try {
        const { id } = req.params; const { user_ID } = req.user;
        const contact = await ContactModel.getContactByID(user_ID, id);

        if(!contact){
            const err = new Error('Hubo un error al encontrar el usuario');
            err.status = 404;
            throw err;
        }

        const { names = contact.names, 
                company = contact.company, 
                address = contact.address, 
                email = contact.email, 
                phone = contact.phone, 
                document_number = contact.document_number, 
                type_document_ID = contact.type_document_ID, 
                municipality 
        } = req.body;

        const dataValidated = await validateUserData({
            user_ID : String(document_number), names, address, email, phone, type_document_ID, municipality
        });

        if(parseInt(document_number) !== parseInt(contact.document_number)){
            const isContactReRegistered = await ContactModel.getContactByDocNumber(
                user_ID, document_number
            );

            if (isContactReRegistered) {
                const err = new Error('El usuario ya se encuentra registrado en tu lista de contactos');
                err.status = 400;
                throw err
            }
        }

        await ContactModel.updateContact({
            user_ID, contact_ID : id, names, company, address, email, phone, document_number, type_document_ID, municipality_ID : dataValidated.municipalityInfo.id
        });

        return res.status(200).json({
            message : 'Contacto actualizado correctamente'
        });

    } catch (err) {
        next(err);
    }
}

export const deleteContact = async (req, res, next) => {
    try {
        const { id } = req.params; const { user_ID } = req.user;
        const contact = await ContactModel.getContactByID(user_ID, id);

        if(!contact){
            const err = new Error('Hubo un error al encontrar el usuario');
            err.status = 404;
            throw err;
        }
        
        await ContactModel.deleteContact(user_ID, id);

        return res.status(200).json({
            message : 'Contacto eliminado correctamente'
        });

    } catch (err) {
        next(err);
    }
}