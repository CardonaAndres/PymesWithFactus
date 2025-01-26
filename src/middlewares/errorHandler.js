
export const errorHandler = (err, req, res, next) => {
    // Si el error tiene una propiedad "status", usarla; si no, usar 500 como error por defecto
    const statusCode = err.status || 500;
    const message = err.message || 'Internal Server Error';

    // Responder con el error en formato JSON
    res.status(statusCode).json({
        success: false,  
        code: statusCode,
        message: message,
    });
};