import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
    const token = req.cookies.accessToken;
    
    if (!token) return res.status(401).json({ message: "Usuario no autenticado" });

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next()
    } catch (error) {
        if (error.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token expirado", code: "ACCESS_TOKEN_EXPIRED" });
        } else if (error.name === "JsonWebTokenError") {
        return res.status(401).json({ message: "Token inválido", code: "ACCESS_TOKEN_INVALID"});
        }
        return res.status(500).json({ message: "Error interno al verificar token" });
    }
};

export default auth;