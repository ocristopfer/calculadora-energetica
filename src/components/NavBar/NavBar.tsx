import { Navbar, Container, Nav } from 'react-bootstrap'
import styles from './NavBar.module.css'
import { ReactComponent as Logo } from './../../assets/energy.svg'
import { ReactComponent as GitHubLogo } from './../../assets/github-logo.svg'
import { IRotas } from '../../interfaces/props/IRotas'

const NavBar: React.FC<{ rotas: Array<IRotas> }> = ({ rotas }) => {
  let menu: Array<any> = [
    <Nav.Link key={0} href="/">
      Home
    </Nav.Link>,
  ]
  if (rotas.length > 0) {
    menu = rotas.map((rota) => (
      <Nav.Link key={rota.key} href={rota.caminho}>
        {rota.nome}
      </Nav.Link>
    ))
  }
  return (
    <>
      <Navbar variant="dark" className={styles.navBar} expand="lg">
        <Container>
          <Logo className="m-2" />
          <Navbar.Brand href="/">Calculadora</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">{menu}</Nav>
          </Navbar.Collapse>
          <Nav.Link
            target="_blank"
            href="https://github.com/ocristopfer/calculadora-ligth"
          >
            <GitHubLogo />
          </Nav.Link>
        </Container>
      </Navbar>
    </>
  )
}
export default NavBar
