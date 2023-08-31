import React from "react";
import {NavLink} from "react-router-dom";
import '../styles/navigation.scss';

function Navigation() {
    return (
        <div className="nav-wrap">
            <div className="nav-primary-wrap">
                <NavLink className="nav-home" to="/">
                    <img className="nav-icon" src="https://cdn-icons-png.flaticon.com/512/25/25694.png"
                         alt="H"/>
                    Home
                </NavLink>
            </div>
        </div>
    );
}

export default Navigation;