const express = require('express');
const router = express.Router();
const {check} = require('express-validator');

const {validarCampos} = require('../middlewares/validar-campos');
const { httpItems, calcularNivelItem } = require('../controllers/items.js');
const { validarJWT } = require('../middlewares/validar-token.js');


const jwt = require('jsonwebtoken');
const { itemsHelper } = require('../helpers/item.js');
// Ruta para crear un nuevo item
router.post('/crear', [
  validarJWT,
  check('descripcion', 'La descripción es obligatoria').not().isEmpty(),
  check('medida', 'La medida es obligatoria').not().isEmpty(),
  check('funcion', 'La función debe ser 1 o 2').isIn([1, 2]),
  check('principianteRef', 'Referencia para principiante es requerida').isNumeric(),
  check('intermedioRef', 'Referencia para intermedio es requerida').isNumeric(),
  check('avanzadoRef', 'Referencia para avanzado es requerida').isNumeric(),
  validarCampos
], httpItems.postItem);

router.put('/editar/:id', [ 
validarJWT,
  check('id', 'ID inválido').isMongoId(),
  check('descripcion', 'La descripción es obligatoria').not().isEmpty(),
  check('medida', 'La medida es obligatoria').not().isEmpty(),
  check('funcion', 'La función debe ser 1 o 2').isIn([1, 2]),
  check('principianteRef', 'Referencia para principiante es requerida').isNumeric(),
  check('intermedioRef', 'Referencia para intermedio es requerida').isNumeric(),
  check('avanzadoRef', 'Referencia para avanzado es requerida').isNumeric(),
  validarCampos
  ], httpItems.putEditarItem);


// Ruta para obtener todos los items
router.get('/listaItem',[validarJWT, validarCampos], httpItems.getItems);


// Ruta para obtener item por id.
router.get('/listaId/:id',[validarJWT], httpItems.getItemPorId);

// Ruta para calcular el nivel de un item basado en los datos evaluados
router.post('/evaluar-nivel',[validarJWT], calcularNivelItem);

//eliminar items
router.delete('/itemId/:id', [
        validarJWT,
        check('id', 'No es un ID válido').isMongoId(),
        check('id').custom(itemsHelper.existeItemID),
        validarCampos
], httpItems.deleteItem);


router.get('/buscar', [validarJWT], httpItems.buscarItems);

module.exports = router;

