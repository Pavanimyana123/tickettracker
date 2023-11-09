import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Client from './Components/Client';
import Tester from './Components/Tester';
import Tickets from './Components/Tickets';
import TesterLogin from './Components/TesterLogin';


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Client/>} />
        <Route path="/tester" element={<Tester/>}/>
        <Route path="/tickets" element={<Tickets/>}/>
        <Route path="/testerlogin" element={<TesterLogin/>}/>
      </Routes>
    </BrowserRouter>
  );
}
