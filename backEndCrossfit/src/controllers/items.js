const Item = require("../models/items");

const httpItems = {
  postItem: async (req, res) => {
    try {
      const newItem = new Item(req.body);
      await newItem.save();
      res.status(201).json({
        msg: "Item creado correctamente",
        item: newItem,
      });
    } catch (error) {
      res.status(500).json({
        msg: "Error al crear el item",
        error: error.message,
      });
    }
  },

  getItems: async (req, res) => {
    try {
      const items = await Item.find();
      res.status(200).json(items);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

getItemPorId: async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Item.findById(id);
    if (!item) {
      return res.status(404).json({ msg: "Item no encontrado" });
    }
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener el item", error: error.message });
  }
},
  putEditarItem: async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const item = await Item.findById(id);
    if (!item) {
      return res.status(404).json({ msg: "Item no encontrado" });
    }

    Object.assign(item, updateData);
    await item.save();

    res.status(200).json({
      msg: "Item actualizado correctamente",
      item
    });
  } catch (error) {
    res.status(500).json({
      msg: "Error al actualizar el item",
      error: error.message
    });
  }
},


buscarItems: async (req, res) => {
  try {
    const { q } = req.query;
    const regex = new RegExp(q, "i"); // búsqueda insensible a mayúsculas/minúsculas
    const items = await Item.find({ descripcion: regex });

    res.status(200).json({ total: items.length, items });
  } catch (error) {
    res.status(500).json({ msg: "Error al buscar items", error: error.message });
  }
},


deleteItem: async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Item.findByIdAndDelete(id);
    if (!item) {
      return res.status(404).json({ msg: "Item no encontrado o ya eliminado" });
    }
    res.status(200).json({ msg: "Item eliminado correctamente", item });
  } catch (error) {
    res.status(500).json({ msg: "Error al eliminar el item", error: error.message });
  }
},

};


const calcularNivelItem = async (req, res) => {
  try {
    const { datosEvaluar } = req.body;
    const resultados = [];

    // Función para quitar acentos
    function quitarAcentos(str) {
      return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    // Grupos dinámicos
    const grupos = {
      "movimientos de peso": [
        "peso muerto",
        "deadlift",
        "squat clean",
        "push jerk",
        "split jerk",
        "overhead squat",
        "ohs",
        "clean and jerk",
        "snatch",
      ],
      "movimientos de gimnasia": [
        "push up",
        "hspu",
        "pull ups",
        "muscle up",
        "handstand",
        "bar muscle up",
        "strict pull up",
      ],
      "movimientos metabólicos": [
        "wall ball",
        "burpees",
        "remo",
        "row",
        "run",
        "carrera",
        "bike",
        "assault",
      ],
    };

    for (const key in datosEvaluar) {
      const entrada = datosEvaluar[key];
      const valor =
        entrada?.valor_kg ||
        entrada?.tiempo_minutos ||
        entrada?.distancia_metros;
      if (valor === undefined) continue;

      const nombreLimpio = key.replace(/_/g, " ");
      const item = await Item.findOne({
        descripcion: { $regex: new RegExp(nombreLimpio, "i") },
      });

      if (!item) {
        resultados.push({ key, error: "Item no encontrado" });
        continue;
      }

      let nivel;
      if (item.funcion === 2) {
        if (valor >= item.principianteRef) nivel = "principiante";
        else if (valor >= item.intermedioRef) nivel = "intermedio";
        else if (valor >= item.avanzadoRef) nivel = "avanzado";
        else nivel = "rx";
      } else {
        if (valor <= item.principianteRef) nivel = "principiante";
        else if (valor <= item.intermedioRef) nivel = "intermedio";
        else if (valor <= item.avanzadoRef) nivel = "avanzado";
        else nivel = "rx";
      }

      // Asignar grupo dinámico
      let grupo = "otro";
      let desc = item.descripcion.toLowerCase();
      desc = quitarAcentos(desc)
        .replace(/[-_]/g, " ")
        .replace(/\s+/g, " ")
        .trim();

      for (const [nombreGrupo, palabras] of Object.entries(grupos)) {
        if (
          palabras.some((palabra) =>
            desc.includes(quitarAcentos(palabra.toLowerCase()))
          )
        ) {
          grupo = nombreGrupo;
          break;
        }
      }

      resultados.push({
        descripcion: item.descripcion,
        valor,
        funcion: item.funcion,
        nivel,
        grupo,
      });
    }

    res.status(200).json({
      msg: "Evaluación completada",
      resultados,
    });
  } catch (error) {
    res.status(500).json({ msg: "Error al evaluar", error: error.message });
  }
};



module.exports = {
  httpItems,
  calcularNivelItem,
};
