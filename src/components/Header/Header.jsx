import "./Header.scss"

import React from 'react';
import SearchBar from './SearchBar'
import { useHistory } from "react-router-dom";

import Account from "./Account/Account"


const Header  = () => {
  const history = useHistory();
  const goToHomePage = () => {
    history.push("/");
  }

  return (
    <header>
        <h2 onClick={goToHomePage}><span className="material-icon">theaters</span>Moviex</h2>
        <SearchBar/>
        <Account />
    </header>
  )
    
}

export default Header