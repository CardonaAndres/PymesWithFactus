import { connDB } from "../../utils/dataBase.js";

const conn = await connDB();

export const getUsersPaginate = async (offset) => {
    const [ users ] = await conn.query(`SELECT * FROM users LIMIT 12 OFFSET ?`, [offset]);
    return users;
}


export const totalUsers = async () => {
    const [ users ] = await conn.query(`SELECT COUNT(*) AS total FROM users`);
    return users[0].total;  
}

export const changePassword = async (useData) => {
    const { password, user_ID } = useData;
    await conn.query(`UPDATE users SET password = ? WHERE user_ID = ?`,[ password, user_ID ]);
}

export const update = async (userData) => {
    const { names, email, trade_name, company, address, phone, 
        type_document_ID, municipality_ID, user_ID } = userData;
  
    await conn.query(`UPDATE users SET names = ?, email = ?, trade_name = ?, company = ?, 
      address = ?, phone = ?, type_document_ID = ?, municipality_ID = ? WHERE user_ID = ?`,[
        names, email, trade_name, company, address, phone, type_document_ID, municipality_ID, user_ID
      ]
    )
}

export const updateByAdmin = async (userData) => {
    const { email, role_ID, new_user_ID } = userData;
    await conn.query(`UPDATE users SET role_ID = ?, user_ID = ? WHERE email = ?`,[
        role_ID, new_user_ID, email
    ]);
}
