const {Router} = require("express");

const router = Router();

router.get("/users", (req, res) => {
    let response =[
    {"name": "Messi", "age": 36, "team": "Inter Miami"},
    {"name": "Cristiano Ronaldo", "age": 38, "team": "Al Nassr"},
    {"name": "Neymar", "age": 31, "team": "Al Hilal"}
    ];
    res.json(response);
});
router.post("/users", (req, res) => {
    console.log(req.body);
    res.send({"msg": "User created"});
});

module.exports = router;