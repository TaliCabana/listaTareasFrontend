import { Container } from "react-bootstrap";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ListaTareas from "../components/ListaTareas";
import NavbarTareas from "../components/NavbarTareas";
import { useState, useEffect } from "react";

function App() {
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") ||
      "theme-cute" ||
      "theme-sky" ||
      "theme-basic"
  );

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  return (
    <>
      <NavbarTareas theme={theme} setTheme={setTheme} />
      <Container>
        <ListaTareas />
      </Container>

    </>
  );
}

export default App;

/*       <BrowserRouter>
        <main>
          <Container>
            <Routes>
              <Route path="/" element={<ListaTareas />} />
            </Routes>
          </Container>
        </main>
      </BrowserRouter> */
