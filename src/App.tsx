import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Home, About, Contact } from './pages'
import { NavBar } from './components'
import { Container } from 'react-bootstrap'
import { IRotas } from './types'
import { useTranslation } from 'react-i18next'
import { namespaces } from './i18n/i18n.constants'

const App = () => {
  const { t } = useTranslation(namespaces.navbar)
  let rotas: Array<IRotas> = [
    { key: 0, caminho: '/', nome: t('inicio') },
    { key: 1, caminho: '/about', nome: t('sobre') },
    { key: 2, caminho: '/contact', nome: t('contato') },
  ]

  return (
    <>
      <NavBar rotas={rotas}></NavBar>
      <Container>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Container>
    </>
  )
}

export default App
