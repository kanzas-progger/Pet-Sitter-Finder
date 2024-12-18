import React from "react";
import './Navbar.css'
import Button from '@mui/material/Button';

const Navbar = () => {
    return (
        <header className="navbar-header">
            <nav className="navbar">
                <div className="nav-items">
                    <a href="/">Ситтеры</a>
                    <a href="/">Ситтеры</a>
                    <a href="/">Ситтеры</a>
                </div>
                <div className="nav-items">
                    <Button variant="contained" color="primary">Зарегистрироваться</Button>
                    <Button variant="contained">Войти</Button>
                </div>
            </nav>
        </header>
    )
}

export default Navbar;