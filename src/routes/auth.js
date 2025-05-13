const {Router} = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User.js");
const router = Router();

const secretKey = process.env.SECRET_KEY || "secret";
router.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;
    const userFound = await User.findOne({ email });
    if (!userFound) return res.status(400).json({ message: "Usuario no encontrado" });

    const match = await bcrypt.compare(password, userFound.password);
    if (!match) return res.status(401).json({ message: "Contraseña incorrecta" });

    const token = jwt.sign({ id: userFound._id }, secretKey, { expiresIn: "1h" });
    res.json({ token });
});


router.post("/api/users", verifyToken, ( req, res) => {
    jwt.verify(req.token, secretKey, (error, data) => {
       if(error){
           res.sendStatus(403);
       } else {
           res.json({
                message: "Get all users",
                data
           });
       }
    });
});

function verifyToken(req, res, next){
    const header = req.headers["authorization"];
    if(header !== undefined) {
        const token = header.split(" ")[1];
        req.token = token;
        next();
    } else{
        res.sendStatus(403)
    }
}

router.post("/api/auth/register", async (req, res) => {
    const { name, email, password } = req.body;

    const userFound = await User.findOne({ email });
    if (userFound) return res.status(400).json({ message: "Email ya registrado" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
        name,
        email,
        password: hashedPassword
    });

    await newUser.save();
    res.json({ message: "Usuario registrado" });
});

module.exports = router;