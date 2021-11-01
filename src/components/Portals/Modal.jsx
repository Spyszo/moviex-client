import "./Modal.scss"
import ReactDOM from "react-dom"
import { useState } from "react"

const Modal = (props) => {
    const [closeAnimation, setCloseAnimation] = useState(false)

    const handleClose = () => {
        setCloseAnimation(true)
        setTimeout(()=>{
            props.close()
        }, 250)
    }

    return ReactDOM
        .createPortal(
            <div onClick={(e)=>e.stopPropagation()} className={"modal-container " + (closeAnimation && "closeAnimation")}>
                <div className="backdrop" onClick={handleClose}></div>
                <div className="modal">
                    {props.children}
                </div>
            </div>,
            document.querySelector("#modal")
        )
}

export default Modal