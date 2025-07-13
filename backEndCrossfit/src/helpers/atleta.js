const Atleta = require("../models/perfilAtleta");

const usuarioYaTienePerfil = async (usuario_id = '') => {
  const existe = await Atleta.findOne({ usuario_id });
  if (existe) {
    throw new Error('Este usuario ya tiene un perfil de atleta creado');
  }
};

const existeAtletaPorId = async (id = '') => {
  const existe = await Atleta.findById(id);
  if (!existe) {
    throw new Error(`No existe un perfil de atleta con el ID: ${id}`);
  }
};

module.exports = {
  usuarioYaTienePerfil,
  existeAtletaPorId
};

