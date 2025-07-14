import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'


export const useStoreAtleta = defineStore('atleta', () => {
  const validacion = ref('')
  const estatus = ref('')
  const perfiles = ref([])
  const perfil = ref(null)

  // Requiere token para todas las rutas (protected)
  function insertarToken(token) {
    if (token) {
      axios.defaults.headers.common['x-token'] = token
    }
  }

  // Listar todos los perfiles (solo admin)
const getAll = async (token) => {
  try {
    if (!token) {
      estatus.value = 403
      validacion.value = 'Token no proporcionado'
      return []
    }
    insertarToken(token)
    const res = await axios.get('https://gim-crossfit.onrender.com/api/atleta/listarTodo')
    estatus.value = res.status
    // Solo guarda el array de atletas, no el objeto completo
    perfiles.value = res.data.atletas || []
    return res.data.atletas || []
  } catch (err) {
    estatus.value = err.response?.status || 500
    validacion.value = err.response?.data?.msg || 'Error al obtener perfiles'
    return []
  }
}

  // Listar un perfil por id (usuario/cliente)
  const getById = async (id, token) => {
    try {
      insertarToken(token)
      const res = await axios.get(`https://gim-crossfit.onrender.com/api/atleta/listar/${id}`)
      estatus.value = res.status
      perfil.value = res.data
      return res.data
    } catch (err) {
      estatus.value = err.response?.status || 500
      validacion.value = err.response?.data?.msg || 'Error al obtener perfil'
      return null
    }
  }

  // Obtener perfil de atleta por id de usuario
  const getByUsuarioId = async (usuarioId, token) => {
    try {
      insertarToken(token)
      // Cambia la ruta para que apunte a /por-usuario/:usuarioId
      const res = await axios.get(`https://gim-crossfit.onrender.com/api/atleta/por-usuario/${usuarioId}`)
      estatus.value = res.status
      perfil.value = res.data.atleta
      return res.data
    } catch (err) {
      estatus.value = err.response?.status || 500
      validacion.value = err.response?.data?.msg || 'Error al obtener perfil por usuario'
      return null
    }
  }

  // Buscar perfiles por palabra clave (admin o autorizado)
  const buscar = async (clave, token) => {
    try {
      insertarToken(token)
      const res = await axios.get('https://gim-crossfit.onrender.com/api/atleta/buscar-perfiles', {
        params: { clave }
      })
      estatus.value = res.status
      perfiles.value = res.data
      return res.data
    } catch (err) {
      estatus.value = err.response?.status || 500
      validacion.value = err.response?.data?.msg || 'Error al buscar'
      return []
    }
  }

  // Crear perfil de atleta
  const crear = async (atletaData, token) => {
    try {
      insertarToken(token)

  
      // ENVÍA SOLO { atletaData } SI EL BACKEND LO REQUIERE
      const res = await axios.post('https://gim-crossfit.onrender.com/api/atleta/crearPerfil', { atletaData })
      estatus.value = res.status
      return { success: true, data: res.data }
    } catch (err) {
      estatus.value = err.response?.status || 500
      validacion.value = err.response?.data?.msg || 'Error al crear perfil'
      return { success: false, msg: validacion.value }
    }
  }

  // Editar perfil
  const editar = async (id, atletaData, token) => {
    try {
      insertarToken(token)
      const res = await axios.put(`https://gim-crossfit.onrender.com/api/atleta/editarPerfil/${id}`, { atletaData })
      estatus.value = res.status
      return { success: true, data: res.data }
    } catch (err) {
      estatus.value = err.response?.status || 500
      validacion.value = err.response?.data?.msg || 'Error al editar perfil'
      return { success: false, msg: validacion.value }
    }
  }

  // Eliminar perfil
  const eliminar = async (id, token) => {
    try {
      insertarToken(token)
      const res = await axios.delete(`https://gim-crossfit.onrender.com/api/atleta/eliminarPerfil/${id}`, atletaData)
      estatus.value = res.status
      return { success: true, data: res.data }
    } catch (err) {
      estatus.value = err.response?.status || 500
      validacion.value = err.response?.data?.msg || 'Error al eliminar perfil'
      return { success: false, msg: validacion.value }
    }
  }

  // const filtrados = computed(() =>
  //   (perfiles.value || []).filter(a => a.nombre && a.nombre.toLowerCase().includes('texto'))
  // )

  return {
    perfiles,
    lista: perfiles, // <-- agrega esta línea
    perfil,
    validacion,
    estatus,
    getAll,
    getById,
    getByUsuarioId,
    buscar,
    crear,
    editar,
    eliminar,
    // filtrados,
  }
})


