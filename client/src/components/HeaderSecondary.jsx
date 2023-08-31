import React from "react";
import '../styles/headerSecondary.scss';
import {NavLink} from "react-router-dom";
import "odometer/themes/odometer-theme-default.css";

function HeaderSecondary() {
    return (
        <div className="header-secondary-wrap">
            <div className="header-secondary-primary-wrap">
                <ul>
                    <li>
                        <NavLink className="navlink" to="/upload_song">Upload Song</NavLink>
                    </li>
                    <li>
                        <NavLink className="navlink" to="/song_list">Songs</NavLink>
                    </li>
                    <li>
                        <NavLink className="navlink" to="/groups">Term Groups</NavLink>
                    </li>
                    <li>
                        <NavLink className="navlink" to="/admin">Admin</NavLink>
                    </li>
                </ul>
            </div>
        </div>
    );
}


export default HeaderSecondary;
