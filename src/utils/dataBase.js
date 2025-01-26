import mysql from "mysql2/promise";
import { dbConfig } from "../configs/config.js";

export const connDB = async () => {

    try {
        const db = mysql.createPool(dbConfig);
        return db;
    } catch (err) {
        console.error("Error creating the database pool:", err);  
        throw new Error("Failed to create database connection pool."); 
    }
    
}
