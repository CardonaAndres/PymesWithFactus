import validator from 'validator';
import { colombianPhoneRegex, nameRegex, documentTypes } from '../configs/config.js';
import { getMunicipalitie } from '../modules/factusAPI/controller.js';

export const validateUserData = async (userData) => {
    
    const errors = [];
    const { user_ID, names, address, email, phone, type_document_ID, municipality } = userData;
    let isDocumentTypeValid = false;

    if (!user_ID || !names || !address || !email || !phone || !type_document_ID || !municipality) 
         errors.push('Todos los campos son requeridos');

    const findMunicipality = await getMunicipalitie(municipality);

    if (!findMunicipality.data.data[0]) errors.push('El municipio no ha sido encontrado')

    if (!validator.isEmail(email)) errors.push('El correo electrónico no es válido');

    if (!nameRegex.test(names)) 
         errors.push('El nombre contiene caracteres no válidos. Solo se permiten letras, espacios, acentos y guiones');
    
    if (!colombianPhoneRegex.test(phone)) 
         errors.push('El número de teléfono no es válido. Debe ser un número de celular colombiano de 10 dígitos y empezar con 3');
    
    /*
        Validar que el campo "user_ID" sea un número válido 
        (si es necesario, por ejemplo, si es un NIT o cédula)
    */
    if (!validator.isAlphanumeric(user_ID)) errors.push('El ID del usuario no es válido');

    for(let typeDocument of documentTypes){
        if(typeDocument.ID === parseInt(type_document_ID)){
            isDocumentTypeValid = true;
            break;
        }
    }

    if(!isDocumentTypeValid) errors.push('Tipo de documento NO valido')
    
    if (errors.length > 0 || !isDocumentTypeValid) {
        const error = new Error(errors.join(', '));
        error.status = 400;
        throw error;
    }

    return {
        municipalityInfo : findMunicipality.data.data[0]
    }
}