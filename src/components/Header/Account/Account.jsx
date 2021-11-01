/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./Account.scss";
import axios from "axios"

import LoginBox from "./LoginBox"
import RegisterBox from "./RegisterBox"
import Cookies from 'universal-cookie';

import { useHistory } from "react-router-dom";

import { useSnackbar } from 'notistack';

const Account = () => {
    const { userData } = useSelector(state => state);
    const [showLogin, setShowLogin] = useState(false)
    const [showRegister, setShowRegister] = useState(false)
    const [showBackdrop, setShowBackdrop] = useState(false)
    const [showMenu, setShowMenu] = useState(false)

    const accountButtonRef = useRef(null)
    const cookies = new Cookies();

    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();

    const handleClickOutside = (e) => {
        if (accountButtonRef.current && !accountButtonRef.current.contains(e.target)) {
            setShowMenu(false)
        }
    }

    useEffect(()=>{
        const verifyJWT = async () => {
            const loggedIn = cookies.get("loggedIn")
            if (loggedIn === "true") {
                await axios.post("http://localhost:5000/api/auth/verify",{},{
                    withCredentials: true,
                    credentials: 'include',
                })
                    .then(res=>res.data)
                    .then(res=> {
                        enqueueSnackbar(res.message)
                        dispatch({
                            type: "SET_USERDATA",
                            data: res.user
                        }) 

                        axios.get("http://localhost:5000/api/collection", {
                            withCredentials: true
                        })
                            .then(res=>res.data)
                            .then(res=> {
                                if (res.authenticated === false) return
                                const movieCollection = res.movies.map(movie => movie.id)
                                const tvSeriesCollection = res.tvSeries.map(tvSeries => tvSeries.id)
                                dispatch({
                                    type: "MOVIECOLLECTION_SET",
                                    data: movieCollection
                                }) 
                                dispatch({
                                    type: "TVSERIESCOLLECTION_SET",
                                    data: tvSeriesCollection
                                }) 
                            })
                    })
                    .catch(err=>{
                        cookies.set("loggedIn", "false")
                    })
            }
        }

        verifyJWT()

        document.addEventListener('click', handleClickOutside, true);
        return () => {
            document.removeEventListener('click', handleClickOutside, true);
        };
    },[])

    const handleSwitchToRegister = () => {
        showLogin && setShowLogin(false)
        !showBackdrop && setShowBackdrop(true)

        setTimeout(()=>{
            setShowRegister(true)
        }, 250)
    }

    const handleSwitchToLogin = () => {
        showRegister && setShowRegister(false)
        !showBackdrop && setShowBackdrop(true)

        setTimeout(()=>{
            setShowLogin(true)
        }, 250)
    }

    const handleShowLogin = (state) => {
        setShowBackdrop(state)
        setShowLogin(state)
    }

    const handleShowRegister = (state) => {
        setShowRegister(state)
        setShowBackdrop(state)
    }

    const handleClose = () => {
        showLogin? handleShowLogin(false): handleShowRegister(false)
    }

    const handleOpenMenu = () => {
        if (showMenu)
            setShowMenu(false)
        else 
            setShowMenu(true)
    }

    const handleLogOut = () => {
        axios.post("http://localhost:5000/api/auth/logout", {}, {
            withCredentials: true,
            credentials: "include"
        })
        cookies.set("loggedIn", "false")
        dispatch({
            type: "SET_USERDATA",
            data: null
        }) 
        setShowMenu(false)
    }

    const history = useHistory();
    
    const handleGoToCollection = () => {
        history.push("/collection");
        setShowMenu(false)
    }

    return (
        <div className="account-button" ref={accountButtonRef}>
            {userData
                ? <button className="account" onClick={ handleOpenMenu }><span className="material-icon">account_circle</span></button>
                : <button className="log-in" onClick={()=>handleShowLogin(true)}>Zaloguj się</button>
            }

            <div className={"menu " + (showMenu? "show": "") }>
                <ul>
                    <li onClick={handleGoToCollection}>Kolekcja</li>
                    <li onClick={handleLogOut}>Wyloguj się</li>
                </ul>                
            </div>

            <div className={"form-backdrop " + (showBackdrop? "active": null)} onClick={ handleClose }></div>
            <LoginBox show={ showLogin } showRegister={ handleSwitchToRegister } close={ ()=>handleShowLogin(false) }/>
            <RegisterBox show={ showRegister } showLogin={ handleSwitchToLogin } close={ ()=>handleShowRegister(false) }/>
        </div>
    )
}

export default Account