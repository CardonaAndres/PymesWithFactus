import { SECRET_KEY } from '../configs/config.js';
import JWT from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    try {
        const token = req.cookies.tokenClient;
        if (!token) 
            return res.status(401).json({ message: "Token no encontrado. Acceso no autorizado." });
          
        JWT.verify(token, SECRET_KEY, (err, decoded) => {
            if (err) {
                const message = err.name === 'TokenExpiredError'
                    ? 'El token ha expirado. Por favor, inicia sesión nuevamente.'
                    : 'Token inválido. Acceso denegado.';
                return res.status(403).json({ message });
            }
            req.user = decoded;
            next();
        });

    } catch (err){
        return res.status(403).json({
            message: "Token inválido o expirado." 
        })
    }
}