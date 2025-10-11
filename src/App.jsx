import { Container } from "react-bootstrap";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ListaTareas from "../components/ListaTareas";

export default function AppLayout() {
  return (
    <BrowserRouter>
      <main>
        <Container>
          <Routes>
            {/* Ruta principal → muestra la lista */}
            <Route path="/" element={<ListaTareas />} />

            {/* Ruta para agregar o editar tarea */}
            <Route path="/tarea" element={<FormularioTarea />} />
          </Routes>
        </Container>
      </main>
    </BrowserRouter>
  );
}

