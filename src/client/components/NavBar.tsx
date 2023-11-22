import React from 'react';
import { NavLink } from 'react-router-dom';
import {Container, Nav, Navbar } from 'react-bootstrap';

const NavBar = () => {
    return (
        <Navbar expand="md" className='nav-deco'>
            <Container fluid className='nav'>
                <Navbar.Toggle aria-controls="navbarScroll" className="light"/>
                <Navbar.Collapse id="navbarScroll">
                    <Nav className="m-0 nav"
                        navbarScroll>
                        <NavLink to='/' className={({ isActive, isPending }) =>
                            isPending ? 'pending' : isActive ? 'active' : ''
                        }>Home</NavLink>
                        <NavLink to='/references' className={({ isActive, isPending }) =>
                            isPending ? 'pending' : isActive ? 'active' : ''
                        }>References</NavLink>
                        <NavLink to='/about' className={({ isActive, isPending }) =>
                            isPending ? 'pending' : isActive ? 'active' : ''
                        }>About</NavLink>
                        <NavLink to='/calendar' className={({ isActive, isPending }) =>
                            isPending ? 'pending' : isActive ? 'active' : ''
                        }>Calendar</NavLink>
                        <NavLink to='/equipment' className={({ isActive, isPending }) =>
                            isPending ? 'pending' : isActive ? 'active' : ''
                        }>Equipment</NavLink>
                        <NavLink to='/contact-me' className={({ isActive, isPending }) =>
                            isPending ? 'pending' : isActive ? 'active' : ''
                        }>Contact me</NavLink>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavBar;