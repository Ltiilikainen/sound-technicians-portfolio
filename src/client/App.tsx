import React from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import NavBar from './components/NavBar';
import HomePage from './components/HomePage';
import References from './components/References';
import About from './components/About';
import Schedule from './components/Schedule';
import EquipmentList from './components/EquipmentList';
import ContactForm from './components/ContactForm';

function App() {
    return (
        <div className="App">
            <Router>
                <NavBar />
                <Routes>
                    <Route path='/' element={<HomePage />} />
                    <Route path='/references' element={<References />} />
                    <Route path='/about' element={<About />} />
                    <Route path='/calendar' element={<Schedule />} />
                    <Route path='/equipment' element={<EquipmentList />} />
                    <Route path='/contact-me' element={<ContactForm />} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;
