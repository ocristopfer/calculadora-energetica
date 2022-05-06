import React from "react";
import { Navbar, Container, Nav } from "react-bootstrap";
import styles from "./NavBar.module.css";
const NavBar = () => {
  return (
    <>
      <Navbar variant="dark" className={styles.navBar}>
        <Container>
          <Navbar.Brand href="#home">Calculadora Ligth</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link
              target="_blank"
              href="https://github.com/ocristopfer/calculadora-ligth"
            >
              GitHub
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
};
export default NavBar;
