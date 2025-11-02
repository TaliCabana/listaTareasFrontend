import { Button, Form, Table, Modal } from "react-bootstrap";
import Swal from "sweetalert2";
import { useState, useEffect } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import {
  borrarTarea,
  crearTarea,
  editarTarea,
  listarTareas,
  listarTareasPorId,
} from "../src/helpers/queries";

const ListaTareas = () => {
  const [tareas, setTareas] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTareas, setFilteredTareas] = useState([]);

  /* Estados del modal */
  const [showModal, setShowModal] = useState(false);
  const [descripcion, setDescripcion] = useState("");
  const [editId, setEditId] = useState(null);

  /* Buscar tareas */
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  useEffect(() => {
    if (searchTerm) {
      const searchCode = parseInt(searchTerm);
      const filtered = tareas.filter(
        (tarea, i) =>
          tarea.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tarea.codigo === searchCode ||
          (!isNaN(searchCode) && i + 1 === searchCode)
      );
      setFilteredTareas(filtered);
    } else {
      setFilteredTareas(tareas);
    }
  }, [searchTerm, tareas]);

  // ✅ Cargar tareas desde localStorage al iniciar
  /*   useEffect(() => {
    const data = localStorage.getItem("tareas");
    if (data) {
      setTareas(JSON.parse(data));
    }
  }, []); */

  // ✅ Cargar tareas desde el backend al iniciar
  useEffect(() => {
    obtenerTareas();
  }, []);

  // ✅ Obtener tareas
  const obtenerTareas = async () => {
    // 1- solicitar los datos al backend con la función de queries
    const respuesta = await listarTareas();
    // 2- Verificar que los datos llegaron correctamente -> utilizo .json para acceder al body
    if (respuesta.status === 200) {
      const datos = await respuesta.json();
      // 3- Cargo los producto en el state
      setTareas(datos);
    }
  };

  // 💾 Guardar tareas en localStorage
  const guardarEnLocalStorage = (data) => {
    localStorage.setItem("tareas", JSON.stringify(data));
  };

  // ✅ Marcar tarea como completada
  const toggleCompletada = (id) => {
    const nuevasTareas = tareas.map((tarea) =>
      tarea._id === id ? { ...tarea, completada: !tarea.completada } : tarea
    );
    setTareas(nuevasTareas);
  };

  // 🗑 Eliminar tarea con SweetAlert2
  const handleDelete = (id) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¡Esta tarea no podrás volver a verla!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#30d6c0ff",
      cancelButtonColor: "rgba(221, 51, 96, 1)",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      customClass: {
        popup: "swal2-popup-custom",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        const respuesta = await borrarTarea(id);
        if (respuesta && respuesta.status === 200)
          Swal.fire({
            title: "¡Eliminada!",
            text: "La tarea fue eliminada correctamente.",
            icon: "success",
          });
        obtenerTareas(); //  Actualizo el listado desde el backend
      } else {
        Swal.fire({
          title: "Ocurrió un error",
          text: "La tarea no pudo ser eliminada",
          icon: "error",
        });
      }
    });
  };

  // ✅ Función para traer la tarea desde backend antes de editar
  const buscarTareaPorId = async (id) => {
    const respuesta = await listarTareasPorId(id);
    if (respuesta.status === 200) {
      const tareaBuscada = await respuesta.json();
      setDescripcion(tareaBuscada.descripcion);
      setEditId(tareaBuscada._id);
    }
  };

  // Abrir moodal (para agregar o editar)
  const handleOpenModal = (tarea = null) => {
    if (tarea) {
      buscarTareaPorId(tarea._id);
    } else {
      setDescripcion("");
      setEditId(null);
    }
    setShowModal(true);
  };

  // 💾 Guardar tarea (nueva o editada)
  const handleSave = async () => {
    if (!descripcion.trim()) {
      Swal.fire("Error", "La descripción no puede estar vacía.", "error");
      return;
    }
    // Editar tarea existente
    if (editId) {
      const tareaEditada = { descripcion, completada: false };
      const respuesta = await editarTarea(editId, tareaEditada);

      if (respuesta && respuesta.status === 200) {
        Swal.fire("Editada", "La tarea fue editada correctamente.", "success");
        obtenerTareas(); // actualizo la lista desde el backend
      } else {
        Swal.fire("Error", "No se pudo editar la tarea", "error");
      }
    } else {
      // Agregar nueva tarea - CREAR
      const nuevasTareas = {
        descripcion,
        completada: false,
      };
      const respuesta = await crearTarea(nuevasTareas);
      if (respuesta.status === 201) {
        Swal.fire(
          "Agregada",
          "La tarea fue agregada correctamente.",
          "success"
        );
        obtenerTareas();
        obtenerTareas(); // Actualiza la lista con los cambios del backend
      } else {
        Swal.fire("Error", "Ocurrió un problema al crear la tarea.", "error");
      }
    }
    setShowModal(false);
    setDescripcion("");
    setEditId(null);
  };

  return (
    <section className="container my-4">
      <div className="d-flex justify-content-around mb-3">
        <h1 className="">Listado de tareas</h1>
        <div className="d-flex justify-content-between align-items-center flex-wrap titulo-y-boton"></div>
        <Button className="py-0 btn-add" onClick={() => handleOpenModal()}>
          Agregar tarea ➕
        </Button>
      </div>

      {/* 🔍 Buscador */}
      {tareas.length > 0 && (
        <div>
          <Form className="row g-3">
            <div className="col-12 col-md-8 col-lg-6 d-flex">
              <Form.Control
                type="text"
                placeholder="Qué tarea estás buscando? 👀"
                className="mb-3 search-input"
                aria-label="Buscador de tareas"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </Form>
        </div>
      )}

      {/* 👌🏽 Tablita de tareas */}
      <Table responsive bordered hover variant="dark" className="mt-4">
        <thead>
          <tr className="text-center">
            <th>N°</th>
            <th>Estado</th>
            <th>Descripción</th>
            <th>Opciones</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {filteredTareas.length > 0 ? (
            filteredTareas.map((tarea, i) => (
              <tr key={tarea._id}>
                <td>{i + 1}</td>
                <td>
                  <Form.Check
                    type="checkbox"
                    checked={tarea.completada}
                    onChange={() => toggleCompletada(tarea._id)}
                  />
                </td>

                <td
                  style={{
                    textDecoration: tarea.completada ? "line-through" : "none",
                    color: tarea.completada ? "gray" : "white",
                  }}
                >
                  {tarea.descripcion}
                </td>

                <td>
                  <Button
                    className="m-1 btn-edit"
                    onClick={() => handleOpenModal(tarea)}
                  >
                    <i className="bi bi-pencil-square"></i>
                  </Button>
                  <Button
                    className="m-1 btn-delete"
                    onClick={() => handleDelete(tarea._id)}
                  >
                    <i className="bi bi-trash"></i>
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No hay tareas para mostrar</td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Modal para agregar/editar tarea */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {editId !== null ? "Editar Tarea" : "Agregar nueva tarea"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Ingresá tu tarea abajo 👇🏽</Form.Label>
              <Form.Control
                type="text"
                value={descripcion}
                minLength={3}
                maxLength={100}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Qué tarea vamos a agregar? 🤔"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button className="btn-save" onClick={handleSave}>
            Guardar
          </Button>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>
    </section>
  );
};

export default ListaTareas;
