import logo from './logo.svg';
import './App.css';
import ListaCursos from './components/ListaCursos';
import Register from './components/Register';
import Login from './components/Login';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


function App() {
  return (
    <Router>
      <div className="App">
        <h1>Consumo de API RESTful - Cursos MongoDB</h1>
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cursos" element={<ListaCursos />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
