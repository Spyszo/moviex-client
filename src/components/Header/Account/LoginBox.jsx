/* eslint-disable react-hooks/exhaustive-deps */
import "./LoginBox.scss";
import "./formStyle.scss";
import ForgotPasswordBox from "./ForgotPasswordBox"
import { useEffect, useState } from "react";
import axios from "axios"
import Cookies from 'universal-cookie';

import { useDispatch } from "react-redux";

import { useSnackbar } from 'notistack';

const LoginBox = (props) => {

    const { enqueueSnackbar } = useSnackbar();

    const [startClosing, setStartClosing] = useState(false)
    const [show, setShow] = useState(false)
    const [showForgotPassoword, setShowForgotPassword] = useState(false)
    
    const dispatch = useDispatch();

    useEffect(()=>{
        if (show && !props.show) {
            setStartClosing(true)

            setTimeout(()=>{
                setShow(false)
                setStartClosing(false)
            }, 240)
        } else {
            setShow(props.show)
        }
    }, [props.show])

    const handleClose = () => {
        props.close()
    }

    const handleShowRegister = () => {
        props.showRegister()
    }

    const handleShowForgotPassword = () => {
        setShowForgotPassword(true)
    }

    const handleShowLogin = () => {
        setShowForgotPassword(false)
    }

    const handleLogin = (e) => {
        e.preventDefault()
        
        const email = e.target[0].value
        const password = e.target[1].value

        axios.post(`${process.env.REACT_APP_API}/api/auth/login`, {
            email, password
        }, {
            withCredentials: true,
            credentials: "include"
        })
            .then(res => res.data)
            .then(res => {
                enqueueSnackbar(res.message)
                if (res.user) {
                    const cookies = new Cookies();
                    cookies.set('loggedIn', "true", {maxAge: 123123123})
                    dispatch({
                        type: "SET_USERDATA",
                        data: res.user
                    }) 
                }
                props.close()
            }).catch(err => {
                if (err.response && err.response.data && err.response.data.message) {
                    enqueueSnackbar(err.response.data.message)
                } else {
                    enqueueSnackbar("Błąd serwera")
                }
            })
    }

    return (
        show &&
            <div className={"loginBox " + (startClosing? "closeAnimation": "")}>
                <button className="close" onClick={handleClose}><span className="material-icon">close</span></button>
                <div className="title-logo">
                    <span className="material-icon">theaters</span>
                    Moviex
                </div>

                <div className={"login " + (showForgotPassoword? "moveLeft": "")}>
                    <h2>Logowanie</h2>
                    <form action="" onSubmit={handleLogin}>
                        <div className="text-field">
                            <input type="text" id="login_email" required />
                            <label htmlFor="login_email">Adres e-mail</label>
                        </div>
                        <div className="text-field">
                            <input type="password" id="login_password" required />
                            <label htmlFor="login_password">Hasło</label>
                        </div>
                    
                        <button type="button" id="forgot_password" onClick={handleShowForgotPassword}>Zapomniałem hasła</button>

                        <button id="submit_login">Zaloguj się</button>
                    </form>
                    <p onClick={handleShowRegister}>Nie masz konta? <br/> Załóż je teraz!</p>
                </div>

                <div className={"forgotPasswordBox " + (showForgotPassoword? "moveLeft": "")}>
                    <ForgotPasswordBox showLogin={handleShowLogin}/>
                </div>
            </div>
    )
}

export default LoginBox