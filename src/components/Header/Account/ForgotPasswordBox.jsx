import "./ForgotPasswordBox.scss"

const ForgotPasswordBox = (props) => {
    const handleSubmitReset = () => {

    }

    return (
        <div className="forgotPassword">
        <h2>Zapomniałem hasła</h2>
        <p>Na twój adres e-mail zostanie wysłany 5 cyfrowy kod. </p>
        <div className="text-field">
            <input type="text" id="forgotPassword_email" required />
            <label htmlFor="forgotPassword_email">Adres e-mail</label>
        </div>
        <button id="submitEmail" onClick={handleSubmitReset}>Resetuj hasło</button>
        <button id="backToLogin" onClick={ props.showLogin }>Powrót</button>
        </div>
    )
}

export default ForgotPasswordBox