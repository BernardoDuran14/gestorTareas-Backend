const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRET_KEY || "secret";

function verifyToken(req, res, next) {
    const header = req.headers["authorization"];
    if (!header) return res.status(403).json({ message: "Token no enviado" });

    const token = header.split(" ")[1];
    try {
        const decoded = jwt.verify(token, secretKey);
        req.userId = decoded.id;
        next();
    } catch (error) {
        return res.status(403).json({ message: "Token inválido" });
    }
}

module.exports = verifyToken;
