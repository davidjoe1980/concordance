import React, { useState } from "react";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import {
    Header,
    HeaderSecondary,
    Home,
    Navigation,
    UploadSong,
    Admin,
    SongList,
    Song,
    Results,
    TermGroups
} from "./components";

import "./styles/index.scss";

export default function App(){
    document.body.style.backgroundColor = '#F0F0F0';
    const [searchResults, setSearchResults] = useState([]);
    const [metaSearchResults, setMetaSearchResults] = useState([]);

    return (
        <Router>
            <Navigation/>
            <Header setSearchResults={setSearchResults} setMetaSearchResults={setMetaSearchResults}/>
            <HeaderSecondary/>
            <div className="main-wrap">
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/upload_song" element={<UploadSong/>}/>
                    <Route path="/song_list" element={<SongList/>}/>
                    <Route path="/song" element={<Song setSearchResults={setSearchResults}/>}/>
                    <Route path="/admin" element={<Admin/>}/>
                    <Route path="/groups" element={<TermGroups/>}/>
                    <Route path="/search_results" element={<Results searchResults={searchResults} metaSearchResults={metaSearchResults} />} />
                </Routes>
            </div>
        </Router>
    )
}