var express = require("express");
var router = express.Router();

var escoteiroController = require("../controllers/escoteiroController");

router.post("/cadastrar/:fkUsuario", function (req, res) {
    escoteiroController.cadastrar(req, res);
});

router.get("/mensalidades/:fkUsuario", function (req, res) {
    escoteiroController.renderizarEscoteiro(req, res);
});

router.post("/darBaixa", function (req, res) {
    escoteiroController.darBaixa(req, res);
});

router.delete("/deletar/:registroEscoteiro", function (req, res) {
    escoteiroController.deletarEscoteiro(req, res);
});

module.exports = router;