const { Router } = require("express");
const { check } = require("express-validator");
const { validarJWT } = require("../middlewares/validar-token");
const { validarCampos } = require("../middlewares/validar-campos");
const { httpAtleta } = require("../controllers/perfilAtleta");
const { validarPropietario, validarRol } = require("../middlewares/validar-rol");
const upload = require("../middlewares/upload");

const atletaHelper = require("../helpers/atleta");

const router = Router();



//listar por id
router.get("/listar/:id", [validarJWT], httpAtleta.getPerfilPorId);

//listar todo
router.get( "/listarTodo", [validarJWT, validarRol("administrador")],httpAtleta.getTodosLosPerfiles);

//listar por palabra clave
router.get('/buscar-perfiles', [validarJWT], httpAtleta.buscarAtletasPorNombre);

// listar perfil por usuarioId
router.get('/por-usuario/:usuarioId', [validarJWT], httpAtleta.getPerfilPorUsuarioId);

// Crear perfil
router.post(
  "/crearPerfil",
  [
    validarJWT,
    // check("atletaData.usuario_id").custom(atletaHelper.usuarioYaTienePerfil),
    check("atletaData.nombre", "El nombre es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  httpAtleta.postCrearPerfilCompleto
);


// subir imagen evidencia.

router.post(
  "/subir-evidencia/:_id/:item_id",
  [validarJWT, upload.single('evidencia')],
  httpAtleta.subirEvidencia
);

// Editar perfil
router.put(
  "/editarPerfil/:id",
  [
    validarJWT,
    validarPropietario,
    check("id", "ID de atleta no válido").isMongoId(),
    check("id").custom(atletaHelper.existeAtletaPorId),
    check("atletaData.nombre", "El nombre es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  httpAtleta.putEditarPerfil
);


//eliminar perfil.
router.delete("/eliminarPerfil/:id", [validarJWT, validarPropietario], httpAtleta.eliminarPerfil);

module.exports = router;
