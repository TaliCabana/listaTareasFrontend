const tareasBackend = import.meta.env.VITE_API_TAREAS;

export const listarTareas = async () => {
  try {
    const respuesta = await fetch(tareasBackend);
    console.log(respuesta);
    return respuesta;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const listarTareasPorId =  async (id) => {
  try {
    const respuesta = await fetch (`${tareasBackend}/${id}`)
    console.log(respuesta)
    return respuesta
  } catch (error) {
    console.error(error)
    return null // si retorna nulo es poruqe algo falló
  }
}