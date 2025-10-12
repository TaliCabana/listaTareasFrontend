import { Navbar, Container, Nav, Dropdown } from "react-bootstrap";

const NavbarTareas = ({ theme, setTheme }) => {
  const handleChangeTheme = (nuevoTema) => {
    setTheme(nuevoTema);
    document.body.className = nuevoTema;
    localStorage.setItem("theme", nuevoTema);
  };

  return (
    <Navbar expand="lg" className="mb-4 bg-navbar">
      <Container>
        <Navbar.Brand style={{ color: "var(--color-text)" }}>🌸 Lista de Tareas</Navbar.Brand>
        <Nav className="ms-auto">
          <Dropdown>
            <Dropdown.Toggle variant="light" id="dropdown-basic">
              Estilos 🎨
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => handleChangeTheme("theme-cute")}>Cute 💖</Dropdown.Item>
              <Dropdown.Item onClick={() => handleChangeTheme("theme-sky")}>Sky 💙</Dropdown.Item>
              <Dropdown.Item onClick={() => handleChangeTheme("theme-basic")}>Básico ⚪</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default NavbarTareas;
