import { connDB } from "../../utils/dataBase.js";

const conn = await connDB();

export const register = async (userData) => {
    const {user_ID, names, trade_name, company, address, 
        email, phone, type_document_ID, municipality_ID, password} = userData;

    await conn.query(`INSERT INTO users (user_ID, names, trade_name, company, address, email, phone, type_document_ID, municipality_ID, role_ID, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [ user_ID, names, trade_name, company, address, email, phone, type_document_ID, municipality_ID, 2, password ]);
}

export const getUserByID = async (user_ID) => {
    const [ userInfo ] = await conn.query('SELECT * FROM users where user_ID = ?', [user_ID]);
    return userInfo[0];
}

export const findUser = async (user_ID, email, phone) => {
    const [ userInfo ] = await conn.query(`SELECT * FROM users 
        WHERE user_ID = ? OR email = ? OR phone = ?`, [user_ID, email, phone]);

    return userInfo[0]
}