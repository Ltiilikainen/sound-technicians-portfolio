import React from 'react';
import { NavLink } from 'react-router-dom';

const NavBar = () => {
    return (
        <div className="nav">
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
        </div>
    );
};

export default NavBar;