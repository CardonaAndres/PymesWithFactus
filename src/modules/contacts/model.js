import { connDB } from '../../utils/dataBase.js';

const conn = await connDB();

export const getAllContactsPaginate = async (user_ID, offset) => {
    const [ contacts ] = await conn.query(
        `SELECT * FROM contacts WHERE user_ID = ? LIMIT 12 OFFSET ?`, [user_ID, offset]
    );

    return contacts;
}

export const getContactByDocNumber = async (user_ID, document_number) => {
    const [ contact ] = await conn.query(
        `SELECT * FROM contacts WHERE user_ID = ? AND document_number = ?`, [
            user_ID, document_number
        ]
    );

    return contact[0];
}

export const getContactByID = async (user_ID, contact_ID) => {
    const [ contact ] = await conn.query(
        `SELECT * FROM contacts WHERE user_ID = ? AND contact_ID = ?`, [
            user_ID, contact_ID
        ]
    );

    return contact[0];
}

export const getTotalContacts = async (user_ID) => {
    const [ contacts ] = await conn.query(
        `SELECT COUNT(*) AS total FROM contacts WHERE user_ID = ?`, [user_ID]
    );

    return contacts[0].total;
}

export const createContact = async (contactData) => {
    const { user_ID, names, company, address, email, 
        phone, document_number, type_document_ID, municipality_ID } = contactData;

    await conn.query(`INSERT INTO contacts (user_ID, names, company, address, email, 
        phone, document_number, type_document_ID, municipality_ID) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, [user_ID, names, company, address, email, 
            phone, document_number, type_document_ID, municipality_ID]
    );

}

export const updateContact = async (contactData) => {
    const { user_ID, contact_ID, names, company, address, email, 
        phone, document_number, type_document_ID, municipality_ID } = contactData;

    await conn.query(
        `UPDATE contacts SET names = ?, company = ?, address = ?, email = ?, phone = ?, 
        document_number = ?, type_document_ID = ?, municipality_ID = ? 
        WHERE contact_ID = ? AND user_ID = ?`, [
            names, company, address, email, phone, document_number, type_document_ID, 
            municipality_ID, contact_ID, user_ID
        ]
    );
}

export const deleteContact = async (user_ID, contact_ID) => {
    await conn.query(
        `DELETE FROM contacts WHERE user_ID = ? AND contact_ID = ?`, [user_ID, contact_ID]
    );
}