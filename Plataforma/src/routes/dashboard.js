var express = require("express");
var router = express.Router();

var dashboardController = require("../controllers/dashboardController");

router.get("/escoteiros/:fkUsuario", function (req, res) {
    dashboardController.obterQuantidadeEscoteiros(req, res);
});

router.get("/financeiro/arrecadado/:fkUsuario", function (req, res) {
    dashboardController.obterValorArrecadado(req, res);
});

router.get("/financeiro/atrasado/:fkUsuario", function (req, res) {
    dashboardController.obterValorAtrasado(req, res);
});

router.get("/financeiro/grafico-linha/:fkUsuario", function (req, res) {
    dashboardController.obterDadosGraficoLinha(req, res);
});

router.get("/financeiro/grafico-rosca/:fkUsuario", function (req, res) {
    dashboardController.obterDadosGraficoRosca(req, res);
});
 
module.exports = router;