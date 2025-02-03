import { connDB } from "../../utils/dataBase.js";

const conn = await connDB();

export const getMyProducts = async (user_ID) => {
    const [ products ] = await conn.query(
        `SELECT * FROM products WHERE user_ID = ?`,[ user_ID ]
    );

    return products;
}

export const getMyProductsPaginate = async (user_ID, offset) => {
    const [ products ] = await conn.query(
        `SELECT * FROM products WHERE user_ID = ? LIMIT 12 OFFSET ?`,[ user_ID, offset]
    );

    return products;

}

export const getTotalProducts = async (user_ID) => {
    const [ totalProducts ] = await conn.query(
        `SELECT COUNT(*) AS total FROM products WHERE user_ID = ?`,[ user_ID ]
    );

    return totalProducts[0].total;
}

export const getMyProductByID = async (product_ID, user_ID) => {
    const  [ product ] = await conn.query(
        `SELECT * FROM products WHERE product_ID = ? AND user_ID = ?`,[ product_ID, user_ID ]
    );

    return product[0];  
}

export const registerProduct = async (productData) => {
    const { name, description, price, tax_rate, unit_measure_ID, user_ID } = productData;
    await conn.query(
        `INSERT INTO products (name, description, price, tax_rate, unit_measure_ID, user_ID) 
         VALUES (?,?,?,?,?,?)`,
        [name, description, price, tax_rate, unit_measure_ID, user_ID] 
    );
}

export const updateProduct = async (productData) => {
    const { name, description, price, tax_rate, unit_measure_ID, user_ID, product_ID } = productData;
    await conn.query(
        `UPDATE products SET name = ?, description = ?, price = ?, tax_rate = ?, unit_measure_ID = ?
         WHERE product_ID = ? AND user_ID = ?`,
        [name, description, price, tax_rate, unit_measure_ID, product_ID, user_ID]
    );
}

export const deleteProduct = async (product_ID, user_ID) => {
    await conn.query(
        `DELETE FROM products WHERE product_ID = ? AND user_ID = ?`,[ product_ID, user_ID ]
    );
}