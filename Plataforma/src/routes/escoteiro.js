var express = require("express");
var router = express.Router();

var escoteiroController = require("../controllers/escoteiroController");

router.post("/cadastrar/:fkUsuario", function (req, res) {
    escoteiroController.cadastrar(req, res);
});

router.post("/mensalidades/atualizar", function (req, res) {
    escoteiroController.atualizar(req, res);
});

router.get("/mensalidades/:fkUsuario", function (req, res) {
    escoteiroController.renderizarEscoteiro(req, res);
});

// pagina de mensalidades, eu mudo para put ou patch?
//  faz update no status
router.post("/darBaixa", function (req, res) {
    escoteiroController.darBaixa(req, res);
});

router.delete("/deletar/:registroEscoteiro", function (req, res) {
    escoteiroController.deletarEscoteiro(req, res);
});

//pagina de escoteiro
router.get("/:registroEscoteiro", function (req, res) {
    escoteiroController.carregarDadosEscoteiro(req, res);
});

router.get("/:registroEscoteiro/mensalidades", function (req, res) {
    escoteiroController.carregarMensalidadesEscoteiro(req, res);
});

// para registrar um pagamento em um escoteiro especifico
router.put("/:registroEscoteiro/mensalidades", function (req, res) {
    escoteiroController.carregarMensalidadesEscoteiro(req, res);
});

// router.get("/buscar", function (req, res) {
//     escoteiroController.buscarEscoteiro(req, res);
// });
 
module.exports = router;