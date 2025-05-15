const {Router} = require("express");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User.js");
const router = Router();

const secretKey = process.env.SECRET_KEY || "secret";
router.post("/api/auth/login",
    [
        body("email", "Email inválido").isEmail(),
        body("password", "La contraseña es obligatoria").notEmpty(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        try {
            const user = await User.findOne({ email });
            if (!user) return res.status(400).json({ message: "Credenciales incorrectas" });

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(400).json({ message: "Credenciales incorrectas" });

            const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
                expiresIn: "1d",
            });

            res.json({ token });
        } catch (err) {
            res.status(500).json({ message: "Error en el servidor" });
        }
    }
);



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

function verifyToken(req, res, next) {
    const header = req.headers["authorization"];
    if (header !== undefined) {
        const token = header.split(" ")[1];
        jwt.verify(token, secretKey, (error, decoded) => {
            if (error) {
                return res.sendStatus(403);
            }
            req.userId = decoded.id;
            next();
        });
    } else {
        res.sendStatus(403);
    }
}


router.post("/api/auth/register",
    [
        body("name", "El nombre es obligatorio").notEmpty(),
        body("email", "Email inválido").isEmail(),
        body("password", "La contraseña debe tener al menos 6 caracteres").isLength({ min: 6 }),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password } = req.body;

        try {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: "El usuario ya existe" });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new User({ name, email, password: hashedPassword });

            await newUser.save();

            const token = jwt.sign({ id: newUser._id }, process.env.SECRET_KEY, {
                expiresIn: "1d",
            });

            res.json({ token });
        } catch (err) {
            res.status(500).json({ message: "Error en el servidor" });
        }
    }
);

router.get('/api/auth/me', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener usuario', error });
    }
});




module.exports = router;