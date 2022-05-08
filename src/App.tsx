import React from 'react';
import './App.css';
import About from './components/About';
import Contact from './components/Contact';

import { Routes, Route } from 'react-router-dom';
import {Calculadora, NavBar} from './components';
import { Container } from 'react-bootstrap';
import { IRotas } from './interfaces/props/IRotas';

function App() {
  let rotas = [{key:0, caminho:'/', nome: "Home"}, {key:1,caminho:'/about', nome: "Sobre"},{key:2,caminho:'/contact', nome: "Contato"}] as IRotas[]
  
  return (
    <>
     <NavBar rotas={rotas}></NavBar>
     <Container>
        <Routes>
          <Route path='/' element={<Calculadora/>} />
          <Route path='/about' element={<About/>} />
          <Route path='/contact' element={<Contact/>} />
        </Routes>
    </Container>
    </>
  );
}

export default App;
