import React, { createContext, useState } from 'react';
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
import EquipmentPage from './components/EquipmentPage';
import AdminLogin from './components/Admin/AdminLogin';
import requestServices from './requestServices';
import AdminNav from './components/Admin/AdminNav';

type AuthContextProps = {
    jwt: string,
    setJwt: React.Dispatch<React.SetStateAction<string>>| null,
    rsaPub: string,
    setRsaPub: React.Dispatch<React.SetStateAction<string>>| null
};

export const authContext = createContext<AuthContextProps>({jwt: '', setJwt: null, rsaPub: '', setRsaPub: null});

function App() {
    const [jwt, setJwt] = useState('');
    const [rsaPub, setRsaPub] = useState('');

    return (
        <div className="App">
            <authContext.Provider value={{jwt: jwt, setJwt: setJwt, rsaPub: rsaPub, setRsaPub: setRsaPub}}>
                <Router>
                    {jwt && requestServices.verifyAdmin(jwt, rsaPub) && <AdminNav/>}
                    <NavBar />
                    <Routes>
                        {/*Visitor routes*/}
                        <Route path='/' element={<HomePage />} />
                        <Route path='/references' element={<References />} />
                        <Route path='/about' element={<About />} />
                        <Route path='/calendar' element={<Schedule />} />
                        <Route path='/equipment' element={<EquipmentList />} />
                        <Route path='/equipment/:id' element={<EquipmentPage />} />
                        <Route path='/contact-me' element={<ContactForm />} />

                        {/*Admin routes*/}
                        <Route path='/login' element={<AdminLogin />} />
                    </Routes>
                </Router>
            </authContext.Provider>
        </div>
    );
}

export default App;
