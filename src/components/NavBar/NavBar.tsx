import { Navbar, Container, Nav } from 'react-bootstrap'
import styles from './NavBar.module.css'
import { ReactComponent as GitHubLogo } from './../../assets/github-logo.svg'
import { IRotas } from '../../interfaces/props/IRotas'

const NavBar: React.FC<any> = (props) => {
  let menu: Array<any> = [<Nav.Link href="/">Home</Nav.Link>]
  let rotas = props.rotas as IRotas[]
  if (rotas.length > 0) {
    menu = rotas.map((rota) => (
      <Nav.Link key={rota.key} href={rota.caminho}>
        {rota.nome}
      </Nav.Link>
    ))
  }
  return (
    <>
      <Navbar variant="dark" className={styles.navBar}>
        <Container>
          <Navbar.Brand href="#home">Calculadora Ligth</Navbar.Brand>
          <Nav className="me-auto">
            {menu}
            <Nav.Link
              target="_blank"
              href="https://github.com/ocristopfer/calculadora-ligth"
            >
              <GitHubLogo />
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    </>
  )
}
export default NavBar
