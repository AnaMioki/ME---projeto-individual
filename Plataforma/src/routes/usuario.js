var express = require("express");
var router = express.Router();

// app.use(express.static('public'));

var usuarioController = require("../controllers/usuarioController");

// Recebendo os dados do html e direcionando para a função cadastrar de usuarioController.js
router.post("/cadastrar", function (req, res) {
    usuarioController.cadastrar(req, res);
})

router.post("/entrar", function (req, res) {
    usuarioController.entrar(req, res);
    console.log('Recebeu login:', req.body);
});

// router.get("/entrar", (req, res) => {
//     res.status(200).send("Rota GET /usuario/entrar funcionando!");
// });


// router.post('/cadastrar', (req, res) => {
//   console.log('Dados recebidos:', req.body);
// //   res.status(201).send({ message: 'Cadastro realizado com sucesso!' });
// });



module.exports = router;