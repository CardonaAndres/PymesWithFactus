import * as ProductModel from './model.js';
import * as FactusController from '../factusAPI/controller.js';

export const getAllMyProducts = async (req, res, next) => {
    try {
        
        const { user_ID } = req.user; 
        const products = await ProductModel.getMyProducts(user_ID);
        return res.status(200).json( products );

    } catch (err) {
        next(err);
    }
}

export const getMyProducts = async (req, res, next) => {
    try {
        const { user_ID } = req.user; const { page = 1 } = req.query; 
        const offset = (page - 1) * 12; 
        const totalProducts = await ProductModel.getTotalProducts(user_ID);
        const products = await ProductModel.getMyProductsPaginate(user_ID, offset);
        const totalPages = Math.ceil(totalProducts / 12);

        return res.status(200).json({
            products,
            pagination: {
                currentPage: parseInt(page),   
                totalPages: totalPages,        
                totalProducts: totalProducts,          
            },
            message: "Tarea exitosa"
        });

    } catch (err) {
        next(err);
    }
}

export const getMyProduct = async (req, res, next) => {
    try {
        const { user_ID } = req.user; const { id } = req.params;
        const product = await ProductModel.getMyProductByID(id, user_ID);

        if(!product){
            const err = new Error('Producto no encontrado');
            err.status = 404;
            throw err;
        }

        return res.status(200).json({
            product,
            message: "Tarea exitosa"
        });

    } catch (err) {
        next(err);
    }
}

export const registerProduct = async (req, res, next) => {
    try {
        const measurementUnits = await FactusController.getMeasurementUnits();
        let isUnitMeasureID = false;

        if (!measurementUnits.status) 
            throw new Error('Error interno en el servidor');   
        
        const { user_ID } = req.user; 
        
        const {
            name, description = "", price, tax_rate, unit_measure_ID
        } = req.body;

        if (!name || !price || !tax_rate || !unit_measure_ID){
            const err = new Error('Faltan campos obligatorios');
            err.status = 400;
            throw err;
        }

        for(let item of measurementUnits.data.data){
            if (item.id === unit_measure_ID){
                isUnitMeasureID = true;
                break;
            }
        }

        if (!isUnitMeasureID){
            const err = new Error('La unidad de medida no es válida');
            err.status = 400;
            throw err;
        }

        await ProductModel.registerProduct({
            name, description, price, tax_rate, unit_measure_ID, user_ID
        });

        return res.status(201).json({
            message : 'Producto registrado con éxito',
        });

    } catch (err) {
        next(err);
    }   
}

export const updateProduct = async (req, res, next) => {
    try {
        const measurementUnits = await FactusController.getMeasurementUnits();
        let isUnitMeasureID = false;

        if (!measurementUnits.status) 
            throw new Error('Error interno en el servidor');

        const { user_ID } = req.user; const { id } = req.params;
        const product = await ProductModel.getMyProductByID(id, user_ID);

        if(!product){
            const err = new Error('Producto no encontrado');
            err.status = 404;
            throw err;
        }

        const {
            name = product.name, 
            description = product.description, 
            price = product.price, 
            tax_rate = product.tax_rate, 
            unit_measure_ID = product.unit_measure_ID, 
        } = req.body;

        for(let item of measurementUnits.data.data){
            if (item.id === unit_measure_ID){
                isUnitMeasureID = true;
                break;
            }
        }

        if (!isUnitMeasureID){
            const err = new Error('La unidad de medida no es válida');
            err.status = 400;
            throw err;
        }

        await ProductModel.updateProduct({
            name, description, price, tax_rate, unit_measure_ID, user_ID, product_ID: id
        });

        return res.status(200).json({
            message : 'Producto actualizado con éxito',
        });

    } catch (err) {
        next(err);
    }
}

export const deleteProduct = async (req, res, next) => {
    try {
        const { user_ID } = req.user; const { id } = req.params;
        const product = await ProductModel.getMyProductByID(id, user_ID);

        if(!product){
            const err = new Error('Producto no encontrado');
            err.status = 404;
            throw err;
        }

        await ProductModel.deleteProduct(id, user_ID);

        return res.status(200).json({
            message : 'Producto eliminado con éxito',
        });

    } catch (err) {
        next(err);
    }
}