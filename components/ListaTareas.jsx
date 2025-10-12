import { Button, Form, Table, Modal } from "react-bootstrap";
import Swal from "sweetalert2";
import { useState, useEffect } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
/* import { data } from "react-router-dom";
import { set } from "react-hook-form"; */
/* import { useNavigate } from "react-router-dom"; */

const ListaTareas = () => {
  const [tareas, setTareas] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTareas, setFilteredTareas] = useState([]);
  /*     const Navigate = useNavigate(); */

  /* Estados del modal */
  const [showModal, setShowModal] = useState(false);
  const [descripcion, setDescripcion] = useState("");
  const [editIndex, setEditIndex] = useState(null);

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
  useEffect(() => {
    const data = localStorage.getItem("tareas");
    if (data) {
      setTareas(JSON.parse(data));
    }
  }, []);

  // 💾 Guardar tareas en localStorage
  const guardarEnLocalStorage = (data) => {
    localStorage.setItem("tareas", JSON.stringify(data));
  };

  // ✅ Marcar tarea como completada
  const toggleCompletada = (index) => {
    const nuevasTareas = [...tareas];
    nuevasTareas[index].completada = !nuevasTareas[index].completada;
    setTareas(nuevasTareas);
    guardarEnLocalStorage(nuevasTareas);
  };

  // 🗑 Eliminar tarea con SweetAlert2
  const handleDelete = (index) => {
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
        /*                 comfirmButton: 'swal2-confirm-custom',
                cancelButton: 'swal2-cancel-custom' */
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const nuevasTareas = [...tareas];
        nuevasTareas.splice(index, 1);
        /*                 localStorage.setItem("tareas", JSON.stringify(tareaActual)); */
        setTareas(nuevasTareas);
        guardarEnLocalStorage(nuevasTareas);
        Swal.fire({
          title: "¡Eliminada!",
          text: "La tarea fue eliminada correctamente.",
          icon: "success",
          /*                     customClass: {
                        popup: 'swal2-popup-custom',
                        confirmButton: 'btn-swal-confirm' */
        });
      }
    });
  };

  // Abrir moodal (para agregar o editar)
  const handleOpenModal = (tarea = null, index = null) => {
    if (tarea) {
      setDescripcion(tarea.descripcion);
      setEditIndex(index);
    } else {
      setDescripcion("");
      setEditIndex(null);
    }
    setShowModal(true);
  };

  // 💾 Guardar tarea (nueva o editada)
  const handleSave = () => {
    if (!descripcion.trim()) {
      Swal.fire("Error", "La descripción no puede estar vacía.", "error");
      return;
    }
    const nuevasTareas = [...tareas];

    if (editIndex !== null) {
      // Editar tarea existente
      nuevasTareas[editIndex] = { descripcion };
      Swal.fire("Editada", "La tarea fue editada correctamente.", "success");
    } else {
      // Agregar nueva tarea
      nuevasTareas.push({ descripcion });
      completada: false;
      Swal.fire("Agregada", "La tarea fue agregada correctamente.", "success");
    }
    setTareas(nuevasTareas);
    guardarEnLocalStorage(nuevasTareas);
    setShowModal(false);
    setDescripcion("");
    setEditIndex(null);
  };

  // ✅ Editar tarea → manda datos al formulario
  /*   const handleEdit = (tarea, codigo) => {
    Navigate("/tarea", { state: { tarea, codigo } });
  }; */

  return (
    <section className="container my-4">
      <div className="d-flex justify-content-between mb-3">
        <h1>Listado de tareas</h1>
        <div className="d-flex justify-content-between align-items-center flex-wrap titulo-y-boton"></div>
        <Button className="py-0 btn-add" onClick={() => handleOpenModal()}>
          Agregar tarea ➕
        </Button>
      </div>

      {/* 🔍 Buscador */}
      {tareas.length > 0 && (
        <div>
          <Form className="row g-3">
            <div className="col-12 col-lg-6 col-md-8 d-flex">
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
            <th>Completa</th>
            <th>Descripción</th>
            <th>Opciones</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {filteredTareas.length > 0 ? (
            filteredTareas.map((tarea, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>
                  <Form.Check
                    type="checkbox"
                    checked={tarea.completada}
                    onChange={() => toggleCompletada(i)}
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

                <td className="text-center">
                  <Button
                    className="mx-2 btn-edit"
                    onClick={() => handleOpenModal(tarea, i)}
                  >
                    <i className="bi bi-pencil-square"></i>
                  </Button>
                  <Button className="mx-2 btn-delete" onClick={() => handleDelete(i)}>
                    <i className="bi bi-trash"></i>
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No hay tareas para mostrar</td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Modal para agregar/editar tarea */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {editIndex !== null ? "Editar Tarea" : "Agregar nueva tarea"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                type="text"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Qué tarea vamos a agregar? 😊"
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
