const Atleta = require("../models/perfilAtleta");
const Item = require("../models/items");
// const usuarios =require("..models/usuario.js")

const cloudinary = require('../utils/cloudinary.js');
const streamifier = require('streamifier');

const httpAtleta = {
  postCrearPerfilCompleto: async (req, res) => {
    try {
      const { atletaData } = req.body;
      // console.log('atletaData recibido:', atletaData);
      const itemIds = atletaData.items.map(i => i.item_id.toString());
      const idsUnicos = new Set(itemIds);
      if (idsUnicos.size !== itemIds.length) {
        return res.status(400).json({ msg: "No se pueden repetir los mismos items en un atleta." });
      }

      const itemsEvaluados = [];
      const habilidadesEvaluadas = [];

      function quitarAcentos(str) {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      }

      const grupos = {
        "movimientos de peso": [
          "sentadilla", "peso muerto", "bench press", "strict press"
        ],
        "levantamientos": [
          "front squat", "squat clean", "push jerk", "split jerk", "ohs", "clean and jerk", "bar muscle up", "snatch"
        ],
        "movimientos de gimnasia": [
          "push up", "hspu", "push jerk", "pull ups", "t2b", "k2e", "rope climb", "muscle ups", "ring muscle ups", "hand stand walk", "walk walls"
        ],
        "movimientos metabólicos": [
          "wall ball", "burpees", "box jump", "5 kilometros corriendo", "5 km corriendo", "1 milla corriendo",
          "5 kilometros remo", "5 km remo", "10 kilometros remo", "10 km remo", "single unders",
          "double unders", "single cross over", "double cross over"
        ]
      };

      for (const entrada of atletaData.items) {
        const item = await Item.findById(entrada.item_id);
        if (!item) continue;

        const valorNum = parseFloat(entrada.valor);
        let nivel;

        if (item.funcion === 1) {
          nivel = valorNum <= item.principianteRef ? "principiante"
               : valorNum <= item.intermedioRef ? "intermedio"
               : valorNum <= item.avanzadoRef ? "avanzado"
               : "rx";
        } else if (item.funcion === 2) {
          nivel = valorNum >= item.principianteRef ? "principiante"
               : valorNum >= item.intermedioRef ? "intermedio"
               : valorNum >= item.avanzadoRef ? "avanzado"
               : "rx";
        }

        let grupo = "otro";
        let desc = quitarAcentos(item.descripcion.toLowerCase().trim())
                    .replace(/[-_]/g, " ")
                    .replace(/\s+/g, " ")
                    .replace("kilometros", "km"); // normalización de términos

        const palabrasDesc = new Set(desc.split(" "));

        for (const [nombreGrupo, palabras] of Object.entries(grupos)) {
          for (const palabra of palabras) {
            const palabraLimpia = quitarAcentos(palabra.toLowerCase().trim()).replace(/\s+/g, " ");
            if (palabraLimpia === desc || palabrasDesc.has(palabraLimpia)) {
              grupo = nombreGrupo;
              break;
            }
          }
          if (grupo !== "otro") break;
        }

        itemsEvaluados.push({
          item_id: item._id,
          valor: entrada.valor,
          nivel,
          grupo,
          evidencia: entrada.evidencia || null // Aseguramos que la evidencia sea opcional
        });

        habilidadesEvaluadas.push({
          habilidad: item.descripcion,
          nivel,
          medida: item.medida,
          grupo,
          evidencia: entrada.evidencia || null // Aseguramos que la evidencia sea opcional
        });
      }

      atletaData.items = itemsEvaluados;

      const nuevoAtleta = new Atleta(atletaData);
      await nuevoAtleta.save();

      res.status(201).json({
        msg: "Perfil de atleta creado correctamente",
        atleta: nuevoAtleta,
        habilidadesEvaluadas
      });

    } catch (error) {
      res.status(500).json({
        msg: "Error al crear el perfil",
        error: error.message
      });
    }
  },
  // .subir evidencia..
subirEvidencia: async (req, res) => {
  try {
    const { _id, item_id } = req.params;

    if (!req.file) {
      return res.status(400).json({ msg: "No se subió ninguna imagen." });
    }

    // Subir imagen a Cloudinary desde el buffer
    const subirACloudinary = (fileBuffer) => {
      return new Promise((resolve, reject) => {
        const upload_stream = cloudinary.uploader.upload_stream(
          { folder: 'evidencias' },
          (error, result) => {
            if (result) resolve(result.secure_url);
            else reject(error);
          }
        );
        streamifier.createReadStream(fileBuffer).pipe(upload_stream);
      });
    };

    const urlCloudinary = await subirACloudinary(req.file.buffer);

    const atleta = await Atleta.findById(_id);
    if (!atleta) {
      return res.status(404).json({ msg: "Atleta no encontrado" });
    }

    const item = atleta.items.id(item_id) || atleta.items.find(i => i.item_id.toString() === item_id);
    if (!item) {
      return res.status(404).json({ msg: "Item no encontrado" });
    }

    // Solo sumar puntos si no tenía evidencia previa
    const sumaPuntos = !item.evidencia;

    item.evidencia = urlCloudinary;

    if (sumaPuntos) {
      atleta.puntos = (atleta.puntos || 0) + 10;
      console.log(`✅ Se asignaron 10 puntos a ${atleta.nombre}. Total: ${atleta.puntos}`);
    } else {
      console.log(`ℹ️ Ya existía evidencia. No se asignaron puntos a ${atleta.nombre}`);
    }

    await atleta.save();

    res.json({
      msg: `Evidencia subida correctamente${sumaPuntos ? " y puntos asignados" : ""}`,
      evidencia: item.evidencia,
      puntosTotales: atleta.puntos
    });
  } catch (error) {
    console.error("❌ Error al subir evidencia:", error.message);
    res.status(500).json({
      msg: "Error al subir la evidencia",
      error: error.message
    });
  }
},



getPerfilPorId: async (req, res) => {
  try {
    const { id } = req.params;
    const atleta = await Atleta.findById(id).populate('usuario_id', 'email rol');
    if (!atleta) {
      return res.status(404).json({ msg: 'Perfil no encontrado' });
    }
    res.json({ atleta });
  } catch (error) {
    res.status(500).json({ msg: 'Error al obtener el perfil', error: error.message });
  }
},


getTodosLosPerfiles: async (req, res) => {
  try {
    const atletas = await Atleta.find()
      .populate('usuario_id', 'email rol')
      .populate({
        path: 'items.item_id',
        select: 'descripcion medida'
      });

    res.json({ total: atletas.length, atletas });
  } catch (error) {
    res.status(500).json({ msg: 'Error al obtener los perfiles', error: error.message });
  }
},

buscarAtletasPorNombre: async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ msg: "Debes proporcionar un término de búsqueda." });
    }

    const regex = new RegExp(q, 'i'); // Búsqueda insensible a mayúsculas/minúsculas
    const atletas = await Atleta.find({ nombre: { $regex: regex } }).populate('usuario_id', 'email rol');

    res.status(200).json({
      total: atletas.length,
      atletas
    });
  } catch (error) {
    res.status(500).json({ msg: "Error al buscar atletas", error: error.message });
  }
},


  putEditarPerfil: async (req, res) => {
    try {
      const { id } = req.params;
      const { atletaData } = req.body;

      const atletaExistente = await Atleta.findById(id);
      if (!atletaExistente) {
        return res.status(404).json({ msg: "Atleta no encontrado" });
      }

      const itemsEvaluados = [];
      const habilidadesEvaluadas = [];

      function quitarAcentos(str) {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      }

      const grupos = {
        "movimientos de peso": [
          "sentadilla", "peso muerto", "bench press", "strict press"
        ],
        "levantamientos": [
          "front squat", "squat clean", "push jerk", "split jerk", "ohs", "clean and jerk", "bar muscle up", "snatch"
        ],
        "movimientos de gimnasia": [
          "push up", "hspu", "push jerk", "pull ups", "t2b", "k2e", "rope climb", "muscle ups", "ring muscle ups", "hand stand walk", "walk walls"
        ],
        "movimientos metabólicos": [
          "wall ball", "burpees", "box jump", "5 kilometros corriendo", "5 km corriendo", "1 milla corriendo",
          "5 kilometros remo", "5 km remo", "10 kilometros remo", "10 km remo", "single unders",
          "double unders", "single cross over", "double cross over"
        ]
      };

      for (const entrada of atletaData.items) {
        const item = await Item.findById(entrada.item_id);
        if (!item) continue;

        const valorNum = parseFloat(entrada.valor);
        let nivel;

        if (item.funcion === 1) {
          nivel = valorNum <= item.principianteRef ? "principiante"
               : valorNum <= item.intermedioRef ? "intermedio"
               : valorNum <= item.avanzadoRef ? "avanzado"
               : "rx";
        } else if (item.funcion === 2) {
          nivel = valorNum >= item.principianteRef ? "principiante"
               : valorNum >= item.intermedioRef ? "intermedio"
               : valorNum >= item.avanzadoRef ? "avanzado"
               : "rx";
        }

        let grupo = "otro";
        let desc = quitarAcentos(item.descripcion.toLowerCase().trim())
                    .replace(/[-_]/g, " ")
                    .replace(/\s+/g, " ")
                    .replace("kilometros", "km");

        const palabrasDesc = new Set(desc.split(" "));

        for (const [nombreGrupo, palabras] of Object.entries(grupos)) {
          for (const palabra of palabras) {
            const palabraLimpia = quitarAcentos(palabra.toLowerCase().trim()).replace(/\s+/g, " ");
            if (palabraLimpia === desc || palabrasDesc.has(palabraLimpia)) {
              grupo = nombreGrupo;
              break;
            }
          }
          if (grupo !== "otro") break;
        }

        itemsEvaluados.push({
          item_id: item._id,
          valor: entrada.valor,
          nivel,
          grupo,
          evidencia: entrada.evidencia || null // Aseguramos que la evidencia sea opcional
        });

        habilidadesEvaluadas.push({
          habilidad: item.descripcion,
          nivel,
          medida: item.medida,
          grupo,
          evidencia: entrada.evidencia || null // Aseguramos que la evidencia sea opcional
        });
      }

      atletaExistente.set({ ...atletaData, items: itemsEvaluados });
      await atletaExistente.save();

      res.status(200).json({
        msg: "Perfil de atleta actualizado correctamente",
        atleta: atletaExistente,
        habilidadesEvaluadas
      });

    } catch (error) {
      res.status(500).json({
        msg: "Error al actualizar el perfil",
        error: error.message
      });
 
    }
  },
  
eliminarPerfil: async (req, res) => {
  try {
    const { id } = req.params;

    const atleta = await Atleta.findById(id);
    if (!atleta) {
      return res.status(404).json({ msg: 'Perfil de atleta no encontrado' });
    }

    await Atleta.findByIdAndDelete(id);
    res.json({ msg: 'Perfil de atleta eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ msg: 'Error al eliminar el perfil', error: error.message });
  }
},


  // Obtener perfil de atleta por usuarioId
  getPerfilPorUsuarioId: async (req, res) => {
    try {
      const { usuarioId } = req.params;
      const atleta = await Atleta.findOne({ usuario_id: usuarioId })
        .populate('usuario_id', 'email rol')
        .populate({ path: 'items.item_id', select: 'descripcion medida' });
      if (!atleta) {
        return res.status(404).json({ msg: 'Perfil de atleta no encontrado para este usuario' });
      }
      res.json({ atleta });
    } catch (error) {
      res.status(500).json({ msg: 'Error al obtener el perfil por usuario', error: error.message });
    }
  }
};


module.exports = { httpAtleta };
