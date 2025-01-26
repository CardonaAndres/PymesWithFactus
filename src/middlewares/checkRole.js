
export const checkRole = (roles) => {
    return (req, res, next) => {
        const user = req.user; // El usuario decodificado del token

        if (!user) return res.status(401).json({ message: 'Usuario no autenticado' });

        // Verificar si el rol del usuario está en los roles permitidos
        if (!roles.includes(user.role_ID)) 
            return res.status(403).json({ message: 'Acceso denegado. Rol no autorizado.' });      

        next();
    };
}