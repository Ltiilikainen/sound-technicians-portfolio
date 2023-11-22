import React, { createContext, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import requestServices from './requestServices';
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
import AdminNav from './components/Admin/AdminNav';

type AuthContextProps = {
    jwt: string,
    setJwt: React.Dispatch<React.SetStateAction<string>>| null,
    rsaPub: string,
    setRsaPub: React.Dispatch<React.SetStateAction<string>>| null,
};

export const authContext = createContext<AuthContextProps>({jwt: '', setJwt: null, rsaPub: '', setRsaPub: null});

function App() {
    const [jwt, setJwt] = useState('');
    const [rsaPub, setRsaPub] = useState('');

    const [auth, setAuth] = useState({auth: false, username: ''});

    useEffect(() => {
        requestServices.verifyAdmin(jwt, rsaPub)
            .then(data => {
                setAuth(data);
            });
        console.log(auth);
    }, [jwt]);

    return (
        <div className="App">
            <authContext.Provider value={{jwt: jwt, setJwt: setJwt, rsaPub: rsaPub, setRsaPub: setRsaPub}}>
                <Router>
                    <div className='sticky-top'>
                        <AdminNav username={auth.username}/>
                        <NavBar/>
                    </div>
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
