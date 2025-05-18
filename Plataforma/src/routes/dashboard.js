var express = require("express");
var router = express.Router();

var escoteiroController = require("../controllers/escoteiroController");

router.get("/escoteiros", function (req, res) {
    escoteiroController.cadastrar(req, res);
});

router.get("/financeiro/arrecadado", function (req, res) {
    escoteiroController.cadastrar(req, res);
});

router.get("/financeiro/atrasado", function (req, res) {
    escoteiroController.cadastrar(req, res);
});

router.get("/financeiro/grafico-linha", function (req, res) {
    escoteiroController.cadastrar(req, res);
});

router.get("/financeiro/grafico-rosca", function (req, res) {
    escoteiroController.cadastrar(req, res);
});
 
module.exports = router;