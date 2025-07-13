


// const jwt = require('jsonwebtoken');
// const items=require('../routes/items')
const mongoose = require('mongoose');

// const bcrypt = require('bcrypt');

const itemsSchema = new mongoose.Schema({
    // idproducto: { type: mongoose.Schema.Types.ObjectId,ref:'Producto' },
    descripcion: { type: String, required: true, unique:true },
    medida: { type: String, required: true, default: "",min:8,max:15 },
    principianteRef: { type: Number, required: true, default: 1 },
    intermedioRef: { type: Number, required: true, default: 1 },
    avanzadoRef: { type: Number, required: true, default: 1 },
    funcion: { type: Number, enum: [1, 2], required: true }//1  20 30 40      // Menor valor es mejor//2  40 30 20
    
    
}, { timestamps: true });

module.exports= mongoose.model("Items", itemsSchema);