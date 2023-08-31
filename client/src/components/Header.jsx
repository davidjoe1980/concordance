import React, { useCallback, useState, useEffect } from "react";
import {useNavigate} from 'react-router-dom';
import { CirclesWithBar } from  'react-loader-spinner';
import '../styles/header.scss';
import {NavLink} from "react-router-dom";
import logo from "../assets/logo.svg";
import {getGroupsData} from "../api/userAPI";
import {loadState, saveState} from "../lib/localStorage";
import apiClient from '../http-common';

const SAVED_TERMS_KEY = 'saved_terms';

function Header({setSearchResults, setMetaSearchResults}) {
    const navigate = useNavigate();
    const [term, setTerm] = useState('');
    const [searching, setSearching] = useState(false);
    const [occurrences, setOccurrences] = useState(null);
    const [metaResults, setMetaResults] = useState(null);
    const [groupsData, setGroupsData] = useState([]);
    const [savedTerms, setSavedTerms] = useState([]);
    

    useEffect(() => {
        getGroupsData().then((res) => {
            setGroupsData(res.data);
        });
    }, [setGroupsData]);
    
    const handleSearch = useCallback((e) => {
        setSearching(true);
        apiClient.get(`/search/song?term=${term}`)
            .then(response => {
                console.log(response.data);
                setOccurrences(response.data.map((data) => { return data.term_occurrence_id }));
            }).catch(response => {
                console.log(response)
            });

        apiClient.get(`/search/meta?term=${term}`)
        .then(response => {
            console.log(response.data);
            setMetaResults(response.data);               
        }).catch(response => {
            console.log(response)
        });
    }, [term]);
    const handleTermChange = useCallback((e) => {
        setTerm(e.target.value);
    }, [setTerm]);

    const handleGroupChange = useCallback((e) => {
        setSearching(true);
        const groupName = e.target.value;
        apiClient.get(`/search/song?group=${groupName}`)
            .then(response => {
                console.log(response.data);
                setOccurrences(response.data.map((data) => { return data.term_occurrence_id }));
                setMetaResults([]);
            }).catch(response => {
                console.log(response)
            });
    }, [setOccurrences]);

    useEffect(() => {
        if (occurrences && metaResults && searching) {
            setSearchResults(occurrences);
            setMetaSearchResults(metaResults);
            setSearching(false);
            
            navigate('/search_results');
        }
    }, [occurrences, navigate, setSearchResults, metaResults, setMetaSearchResults, setSearching, searching]);

    useEffect(() => {
        const termsArr = loadState(SAVED_TERMS_KEY) || [];

        setSavedTerms(termsArr);
    }, []);

    const saveTerm = useCallback(() => {
        if(term.length === 0) {
            return;
        }
        const newTerms = [...savedTerms, term];

        saveState(SAVED_TERMS_KEY, newTerms);
        setSavedTerms(newTerms);
    }, [term, savedTerms]);

    const deleteTerm = useCallback(() => {
        const newTerms = savedTerms.filter(item => item !== term);

        saveState(SAVED_TERMS_KEY, newTerms);
        setSavedTerms(newTerms);
    }, [term, savedTerms]);

    return (
        <div className="header-wrap">
            <header className="header">
                <div className="primary-wrap">
                    <div className="brand-wrap">
                        <h1>
                            <NavLink to="/" className="brand-link">
                                <img src={logo} height="60px" width="70px"/>
                            </NavLink>
                        </h1>
                    </div>

                    <div className="search-wrap">
                        <img
                            src="https://w7.pngwing.com/pngs/582/430/png-transparent-search-magnifier-find-zoom-glass-seo-optimization-instagram-icon.png"
                            alt="go" className="search-icon"/>

                        <input type="text" placeholder="Search for terms"
                               name="search"
                               className="text-input"
                               list="saved_terms"
                               onChange={handleTermChange} />
                        <datalist id="saved_terms">
                            {savedTerms.map((saveTerm, index) => {
                                return <option key={`saveTerm${index}`}>{saveTerm}</option>
                            })}
                        </datalist>

                        <select className="select-input" onChange={handleGroupChange} defaultValue="">
                            <option disabled value=""> -- select a group -- </option>
                            {groupsData.map((group, index) => {
                                return <option key={index}>{group.term_group_name}</option>;
                            })}
                        </select>

                        <button onClick={handleSearch} aria-label="Search" className="header-search-btn" type="submit">
                            <span className="text">Search</span>
                        </button>

                        <button onClick={saveTerm} aria-label="Search" className="header-save-search-btn" type="submit">
                            <span>Save Term</span>
                        </button>

                        <button onClick={deleteTerm} aria-label="Search" className="header-save-search-btn" type="submit">
                            <span>Delete Term</span>
                        </button>
                    </div>

                    <CirclesWithBar
                        height="100"
                        width="100"
                        color="#4fa94d"
                        wrapperClass="search-loader"
                        visible={searching}
                        ariaLabel='circles-with-bar-loading'
                    />
                </div>
            </header>
        </div>
    );
}


export default Header;
