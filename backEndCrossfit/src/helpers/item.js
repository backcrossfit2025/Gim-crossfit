const Items =require('../models/items.js')

const itemsHelper = {
 
    existeItemID: async (id, req) => {
        if (id) {
            const existe = await Items.findOne({ id })
            if (existe) {
                if (req.req.method === "PUT") {
                    if (existe.id !== req.req.usuariobd.id)
                        throw new Error(`Ya existe ese id en la base de datos!!! ${id}`)

                } else {
                    throw new Error(`Ya existe ese id en la base de datos!!! ${id}`)
                }
            }
        }
    }


}
module.exports= {itemsHelper}