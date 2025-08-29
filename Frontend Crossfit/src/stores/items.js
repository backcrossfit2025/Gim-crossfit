
import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useStoreItems = defineStore('items', () => {
  const items = ref([])
  const item = ref(null)
  const validacion = ref('')
  const estatus = ref('')
  const descripcion= ref('')
  const principianteRef = ref('')
  const intermedioRef = ref('')
  const avanzadoRef = ref('')
  const funcion = ref('')
  const id = ref('')
  
  // Necesitas pasar el token cada vez o guardar en state/global
  function insertarToken(token) {
    if (token) {
      axios.defaults.headers.common['x-token'] = token
    }
  }

  // Obtener todos los items
  const getAll = async (token) => {
    try {
      insertarToken(token)
      const res = await axios.get('http://localhost:2436/api/item/listaItem')
      items.value = res.data
      estatus.value = res.status
      return res.data
    } catch (err) {
      estatus.value = err.response?.status || 500
      validacion.value = err.response?.data?.msg || 'Error al listar items'
      return []
    }
  }

  // Obtener un item por ID
  const getById = async (id, token) => {
    try {
      insertarToken(token)
      const res = await axios.get(`http://localhost:2436/api/item/listaId/${id}`)
      item.value = res.data
      estatus.value = res.status
      return res.data
    } catch (err) {
      estatus.value = err.response?.status || 500
      validacion.value = err.response?.data?.msg || 'Error al buscar item'
      return null
    }
  }

  // Buscar items por texto
  const buscar = async (query, token) => {
    try {
      insertarToken(token)
      const res = await axios.get('http://localhost:2436/api/item/buscar', { params: { q: query } })
      items.value = res.data
      estatus.value = res.status
      return res.data
    } catch (err) {
      estatus.value = err.response?.status || 500
      validacion.value = err.response?.data?.msg || 'Error al buscar'
      return []
    }
  }

  // Crear un nuevo item
  const crear = async (data, token) => {
    try {
      insertarToken(token)
      const res = await axios.post('http://localhost:2436/api/item/crear', data)
      estatus.value = res.status
      return { success: true, data: res.data }
    } catch (err) {
      estatus.value = err.response?.status || 500
      validacion.value = err.response?.data?.msg || 'Error al crear item'
      return { success: false, msg: validacion.value }
    }
  }

  // Editar item
  const editar = async (id, data, token) => {
    try {
      insertarToken(token)
      const res = await axios.put(`http://localhost:2436/api/item/editar/${id}`, data)
      estatus.value = res.status
      return { success: true, data: res.data }
    } catch (err) {
      estatus.value = err.response?.status || 500
      validacion.value = err.response?.data?.msg || 'Error al editar item'
      return { success: false, msg: validacion.value }
    }
  }

  // Eliminar item
  const eliminar = async (id, token) => {
    try {
      insertarToken(token)
      const res = await axios.delete(`http://localhost:2436/api/item/itemId/${id}`)
      
      estatus.value = res.status
      return { success: true, data: res.data }
    } catch (err) {
      estatus.value = err.response?.status || 500
      validacion.value = err.response?.data?.msg || 'Error al eliminar item'
      return { success: false, msg: validacion.value }
    }
  }

  // Evaluar nivel del item (post)
  const evaluarNivel = async (payload, token) => {
    try {
      insertarToken(token)
      const res = await axios.post('http://localhost:2436/api/item/evaluar-nivel', payload)
      estatus.value = res.status
      return res.data
    } catch (err) {
      estatus.value = err.response?.status || 500
      validacion.value = err.response?.data?.msg || 'Error al evaluar nivel'
      return null
    }
  }

  return {
    items,
    item,
    validacion,
    estatus,
    getAll,
    getById,
    buscar,
    editar,
    crear,
    eliminar,
    evaluarNivel
  }
})
