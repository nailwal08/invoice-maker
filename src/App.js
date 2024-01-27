import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Container from 'react-bootstrap/Container';
import InvoiceForm from './components/invoiceForm';
import { BiHeart } from 'react-icons/bi';



class App extends Component {
  render() {
    return (
      <div className="App d-flex flex-column align-items-center justify-content-center w-100">
        <Container>
          <InvoiceForm />
        </Container>
        <h5 className="fw-bold text-black">
          Made with <BiHeart /> by
          <a href="https://github.com/nailwal08" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'black' }}> Nikhil Nailwal</a>
        </h5>
      </div>
    );
  }
}

export default App;