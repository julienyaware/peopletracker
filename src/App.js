import { BrowserRouter , Route, Routes  } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import HomePage from './components/HomePage';
import NavBar from './components/NavBar';

function App() {
  return (
    <BrowserRouter>
     <div className="App">
     <NavBar/>
    </div>
    <Routes>
    <Route path="/" element={<HomePage/>} />
    </Routes>
    </BrowserRouter>
   
  );
}

export default App;
