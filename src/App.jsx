import { Container } from "react-bootstrap";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ListaTareas from "../components/ListaTareas";

export default function App() {
  return (
    <BrowserRouter>
      <main>
        <Container>
          <Routes>
            {/* Ruta principal → muestra la lista */}
            <Route path="/" element={<ListaTareas />} />
          </Routes>
        </Container>
      </main>
    </BrowserRouter>
  );
}

