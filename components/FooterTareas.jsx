import { Container} from "react-bootstrap";


const FooterTareas = () => {
  return (
    <footer className="footer bg-footer py-3 mt-auto">
      <Container>
        <p className="text-center my-2">
          &copy; 2025 <span>Tu lista de taras</span>  -  Todos los derechos reservados
        </p>
      </Container>
    </footer>
  );
};

export default FooterTareas;
