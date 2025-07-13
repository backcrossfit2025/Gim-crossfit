const mongoose = require("mongoose");

const atletaSchema = new mongoose.Schema({
  usuario_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
    // unique: true,
  },
  nombre: { type: String },
  fecha_nacimiento: { type: Date, required: true },
  sexo: { type: String, enum: ["M", "F", "NO_ESPECIFICA"] },
  correo: { type: String },
  telefono: { type: String },

  consumismo: [
    {
      tenis_crossfit: { type: Boolean },
      accesorios: [{ type: String }],
      programaciones: [{ type: String }],
    },
  ],

 items: [
  {
    item_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Items",
      required: true
    },
    valor: { type: String },
    nivel: { type: String },
    grupo: { type: String },
    evidencia: { type: String }
  }
],

  datos_antropometricos: {
    estatura_cm: { type: Number },
    peso_kg: { type: Number },
    imc: { type: Number },

    pliegues_cutaneos: {
      biceps: { type: Number },
      triceps: { type: Number },
      escapula: { type: Number },
      abdomen: { type: Number },
      suprailiaco: { type: Number },
      pectoral: { type: Number },
      pierna: { type: Number },
      pantorrilla: { type: Number }
    },

    perimetros_musculares: {
      pectoral: { type: Number },
      hombro: { type: Number },
      cuello: { type: Number },
      biceps_relajado: { type: Number },
      biceps_contraido: { type: Number },
      abdomen: { type: Number },
      cintura: { type: Number },
      cadera: { type: Number },
      muslo_mayor: { type: Number },
      pantorrilla: { type: Number }
    }
  }
},{ 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual para la edad calculada
atletaSchema.virtual("edad").get(function() {
  if (!this.fecha_nacimiento) return null;
  const hoy = new Date();
  const nacimiento = new Date(this.fecha_nacimiento);
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const m = hoy.getMonth() - nacimiento.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }
  return edad;
});

module.exports = mongoose.model("Atleta", atletaSchema);

