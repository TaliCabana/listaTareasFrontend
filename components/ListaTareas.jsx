import { Button, Form, Table } from "react-bootstrap";
import Swal from "sweetalert2";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ListaTareas = () => {
    const [tareas, setTareas] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredTareas, setFilteredTareas] = useState([]);
    const Navigate = useNavigate();

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    }
    useEffect(() => {
        if (searchTerm) {
            const searchCode = parseInt(searchTerm);
            const filtered = tareas.filter(
                (tarea,i)=> tarea.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) || tarea.codigo === searchCode ||
                (!isNaN(searchCode) && i+1 === searchCode)
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

    const handleDelete = (codigo) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "¡Esta tarea no podrás volver a verla!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#30d6c0ff', 
            cancelButtonColor: 'rgba(221, 51, 96, 1)',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            customClass: {
                popup: 'swal2-popup-custom',
                comfirmButton: 'swal2-confirm-custom',
                cancelButton: 'swal2-cancel-custom'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                const tareaActual = [...tareas];
                tareaActual.splice(codigo,1);
                localStorage.setItem("tareas", JSON.stringify(tareaActual));
                setTareas(tareaActual);
                Swal.fire({
                    title: '¡Eliminada!',
                    text: 'La tarea fue eliminada correctamente.',
                    icon: 'success',
                    customClass: {
                        popup: 'swal2-popup-custom',
                        confirmButton: 'btn-swal-confirm'
                }
                });
            }
        });
    }

      // ✅ Editar tarea → manda datos al formulario
    


    return (
        <section className="container my-4">
            <div className="d-flex justify-content-between mb-3">
                <h1>Listado de tareas</h1>
                <Button 
                    className="py-0" 
                    onClick={() => Navigate("/")}>
                        Agregar tarea
                    </Button>
            </div>
            
        </section>
    );
};

export default ListaTareas;


