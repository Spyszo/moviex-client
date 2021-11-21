/* eslint-disable no-useless-escape */
/* eslint-disable react-hooks/exhaustive-deps */
import "./formStyle.scss";
import "./RegisterBox.scss";
import { useEffect, useState } from "react";
import axios from "axios"

import { useSnackbar } from 'notistack';

const RegisterBox = (props) => {

    const { enqueueSnackbar } = useSnackbar();

    const [startClosing, setStartClosing] = useState(false)
    const [show, setShow] = useState(false)
    const [errors, setErrors] = useState({
        name: false,
        email: false,
        password: false
    })

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


    const handleClose = () => props.close()
    const handleShowLogin = () => props.showLogin()
    

    const handleSubmitRegister = (e) => {
        const errorsCopy = errors

        e.preventDefault()

        const name = e.target[0].value
        const email = e.target[1].value
        const password = e.target[2].value
        const passwordCheck = e.target[3].value
        
        //Imię
        if (name.length < 3) errorsCopy.name = true
        if (name.length >= 3 && errors.name) errorsCopy.name = false

        //Email
        const emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!email.match(emailPattern)) errorsCopy.email = true
        if (email.match(emailPattern) && errors.email) errorsCopy.email = false

        //Hasło
        if (password !== passwordCheck) errorsCopy.password = true

        setErrors({...errorsCopy})

        if (errorsCopy.name || errorsCopy.email  || errorsCopy.password  || errorsCopy.passwordCheck )
            return

        axios.post(`${process.env.REACT_APP_API}/api/auth/register`, {
            email, password, passwordCheck, displayName: name
        })
            .then(res => res.data)
            .then(res => {
                enqueueSnackbar(res.message)
            })
            .catch(err => {
                if (err.response && err.response.data && err.response.data.message) {
                    enqueueSnackbar(err.response.data.message)
                } else {
                    enqueueSnackbar("Błąd serwera")
                }
            })

    }

    return (
        show &&
        <div className={"form-container registerBox-container " + (startClosing? "closeAnimation": "")}>
            <div className={"registerBox " + (startClosing? "closeAnimation": "")}>
                <button className="close" onClick={handleClose}><span className="material-icon">close</span></button>

                <div className="title-logo">
                    <span className="material-icon">theaters</span>
                    Moviex
                </div>
                <h2>Rejestracja</h2>
                <form action="" onSubmit={handleSubmitRegister}>
                    <div className={"text-field " + (errors.name && "error")} onChange={()=>{setErrors({...errors, name: false})}}>
                        <input type="text" id="register_name" required />
                        <label htmlFor="register_name">Imię</label>
                    </div>
                    <div className={"text-field " + (errors.email && "error")} onChange={()=>{setErrors({...errors, email: false})}}>
                        <input type="text" id="register_email" required />
                        <label htmlFor="register_email">Adres e-mail</label>
                    </div>
                    <div className={"text-field " + (errors.password && "error")} onChange={()=>{setErrors({...errors, password: false})}}>
                        <input type="password" id="register_password" required />
                        <label htmlFor="register_password">Hasło</label>
                    </div>
                    <div className={"text-field " + (errors.password && "error")} onChange={()=>{setErrors({...errors, password: false})}}>
                        <input type="password" id="register_passwordCheck" required />
                        <label htmlFor="register_passwordCheck">Powtórz hasło</label>
                    </div>
                    <button type="submit" id="submit_register">Zarejestruj się</button>
                </form>

                <p onClick={handleShowLogin}>Masz już konto? <br/> Zaloguj się!</p>
            </div>
        </div>
    )
}

export default RegisterBox