import { Nav, Navbar, Container } from 'react-bootstrap'
import { Link, useLocation } from 'react-router-dom'
import styles from './NavBar.module.css'
import Logo from './../../assets/energy.svg?react'
import GitHubLogo from './../../assets/github-logo.svg?react'
import { IRotas } from '../../types'

const NavBar: React.FC<{ rotas: Array<IRotas> }> = ({ rotas }) => {
  const location = useLocation()
  return (
    <Navbar
      sticky="top"
      variant="dark"
      className={styles.navBar}
      expand="lg"
      collapseOnSelect
    >
      <Container>
        <Logo className="m-2" />
        <Navbar.Brand as={Link} to="/">
          Calculadora
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto" activeKey={location.pathname}>
            {rotas.map((rota) => (
              <Nav.Link
                key={rota.key}
                as={Link}
                to={rota.caminho}
                eventKey={rota.caminho}
              >
                {rota.nome}
              </Nav.Link>
            ))}
          </Nav>
        </Navbar.Collapse>
        <Nav.Link
          target="_blank"
          rel="noreferrer"
          aria-label="Código no GitHub"
          href="https://github.com/ocristopfer/calculadora-energetica"
        >
          <GitHubLogo />
        </Nav.Link>
      </Container>
    </Navbar>
  )
}
export default NavBar
