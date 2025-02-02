import fetch from 'node-fetch';
import * as ContactModel from '../contacts/model.js';
import * as ProductModel from '../products/model.js';
import { billFormat } from './billFormat.js';
import { getTokenAccess } from './tokenFactusAccess.js';
import { factusConfig } from '../../configs/config.js';
import { payment_forms, payment_method_codes, legal_organizations } from '../../configs/config.js';

export const getMunicipalitie = async (name) => {
    try {
        const factusToken = await getTokenAccess();

        const res = await fetch(`${factusConfig.URL_BASE}/v1/municipalities?name=${name}`, {
            method : 'GET', headers : {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${factusToken}`,
                'Accept': 'application/json',
            }
        });

        const data = await res.json();

        if (!res.ok) throw new Error(`Error en la solicitud: ${res.statusText}`);

        return { status : true, data }     

    } catch (err) {
        return { status : false, message : `Error al obtener los municipios : ${err.message}` }
    }
}

export const getMeasurementUnits = async () => {
    try {
        const factusToken = await getTokenAccess();

        const res = await fetch(`${factusConfig.URL_BASE}/v1/measurement-units`, {
            method : 'GET', headers : {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${factusToken}`,
                'Accept': 'application/json',
            }
        });

        const data = await res.json();

        if (!res.ok) throw new Error(`Error en la solicitud: ${res.statusText}`);

        return { status : true, data }     

    } catch (err) {
        return { status : false, message : `Error al obtener las unidades de medida : ${err.message}` }
    }
} 

export const getMeasurementUnitsRequest = async (req, res, next) => {
    try {
        const measurementUnits = await getMeasurementUnits();
        if(!measurementUnits.status) throw new Error(measurementUnits.message)
        return res.status(200).json(measurementUnits)

    } catch (err) {
        next(err);
    }
}

export const getAllBills = async (req, res, next) => {
    try {
        const factusToken = await getTokenAccess();
        const { page = 1 } = req.query;
        const factusRes = await fetch(`${factusConfig.URL_BASE}/v1/bills?page=${page}`, {
            method : 'GET', headers : {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${factusToken}`,
                'Accept': 'application/json',
            }
        });

        const data = await factusRes.json();
        if (!factusRes.ok) throw new Error(`Error en la solicitud: ${factusRes.statusText}`);

        return res.status(200).json( data );

    } catch (err) {
        next(err);
    }
}

export const getBillByNumber = async (req, res, next) => {
    try {
        const { number } = req.params;
        const factusToken = await getTokenAccess();
        if(!number){
            const err = new Error('El número de factura es requerido');
            err.status = 400;
            throw err;
        }

        const factusRes = await fetch(`${factusConfig.URL_BASE}/v1/bills/show/${number}`, {
            method : 'GET', headers : {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${factusToken}`,
                'Accept': 'application/json',
            }
        });

        const data = await factusRes.json();
        if (!factusRes.ok) throw new Error(`Error en la solicitud: ${factusRes.statusText}`);

        return res.status(200).json( data );

    } catch (err) {
        next(err);
    }
}

export const createBill = async (req, res, next) => {
    try {
        const factusToken = await getTokenAccess();
        const { user_ID } = req.user; const products = []; 
        let isPaymentMethodCodeValid = false; let isPaymentFormValid = false;
        let isLegalOrganizationValid = false;

        const { 
            contact_document, 
            products_IDS = [],
            is_excluded, 
            quantity = 1,
            payment_form,
            payment_method_code,
            legal_organization_id,
            observation = ""
        } = req.body;

        if(!contact_document || !products_IDS.length){
            const err = new Error('Datos de entrada inválidos');
            err.status = 400;
            throw err;
        }

        const contact = await ContactModel.getContactByDocNumber(user_ID, contact_document);
        
        if(!contact){
            const err = new Error('El contacto no existe');
            err.status = 404;
            throw err;
        }

        for ( const product of products_IDS ){
            const productData = await ProductModel.getMyProductByID(product, user_ID);           
            if(!productData){
                const err = new Error(`El producto con el ID ${product} no existe`);
                err.status = 404;
                throw err;
            }

            products.push(productData);
        }

        for(let item of payment_method_codes){
            if(item.ID === payment_method_code){
                isPaymentMethodCodeValid = true;
                break;
            }
        }

        if(!isPaymentMethodCodeValid){
            const err = new Error('El código de método de pago no es válido');
            err.status = 400;
            throw err;
        }

        for(let item of payment_forms){
            if(item.ID == payment_form){
                isPaymentFormValid = true;
                break;
            }
        }

        if(!isPaymentFormValid){
            const err = new Error('El formulario de pago no es válido');
            err.status = 400;
            throw err;
        }
        
        for(let item of legal_organizations){
            if(item.ID == legal_organization_id){
                isLegalOrganizationValid = true;
                break;
            }
        }

        if(!isLegalOrganizationValid){
            const err = new Error('La organización legal no es válida');
            err.status = 400;
            throw err;
        }

        if(is_excluded != 0 && is_excluded != 1){
            const err = new Error('El campo is_excluded debe ser 0 o 1');
            err.status = 400;
            throw err;
        }

        const moreInfo = { 
            is_excluded, 
            quantity, 
            payment_form, 
            payment_method_code, 
            legal_organization_id,
            observation
        };  

        const bill = billFormat(contact, products, moreInfo);

        const createBillRequest = await fetch(`${factusConfig.URL_BASE}/v1/bills/validate`, {
            method : 'POST', headers : {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${factusToken}`,
                'Accept': 'application/json',
            }, body : JSON.stringify(bill)
        });

        const data = await createBillRequest.json();

        if(!createBillRequest.ok)
            throw new Error(`Error en la solicitud: ${createBillRequest.statusText}`);

        return res.status(201).json({ data });

    } catch (err) {
        next(err);
    }
}