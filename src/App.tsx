import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { About, Contact } from './pages'
import { NavBar } from './components'
import { Container } from 'react-bootstrap'
import { IRotas } from './types'
import { Calculadora } from './feature'

const App = () => {
  let rotas: Array<IRotas> = [
    { key: 0, caminho: '/', nome: 'Início' },
    { key: 1, caminho: '/about', nome: 'Sobre' },
    { key: 2, caminho: '/contact', nome: 'Contato' },
  ]

  return (
    <>
      <NavBar rotas={rotas}></NavBar>
      <Container>
        <Routes>
          <Route path="/" element={<Calculadora />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Container>
    </>
  )
}

export default App
