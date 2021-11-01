/* eslint-disable react-hooks/exhaustive-deps */
import "./BackdropImage.scss"

import React, { useState, useEffect } from "react"
import { useSelector } from "react-redux";


const BackdropImage = () => {


    const [backdrop, setBackdrop] = useState({
        active: null,
        previous: null
    })

    const [style, setStyle] = useState("fadeOut")

    const { backdrop_path } = useSelector(state => state);

    useEffect(()=>{
        setBackdrop({
            active: backdrop_path,
            previous: backdrop.active
        })
        setStyle("none")
        setTimeout(()=>{
            setStyle("fadeOut")
        }, 40)
    }, [backdrop_path])


    return (
    <div className="backdrop_image">

        {
            backdrop.active
                ? <img src={ "https://image.tmdb.org/t/p/original/" + backdrop.active } alt={ backdrop.active } />
                :null
        }
        {  
            backdrop.previous
                ? <img className={ style } src={ "https://image.tmdb.org/t/p/original/" + backdrop.previous } alt={ backdrop.previous } />
                : null
        }
    </div>
    )
}


export default BackdropImage;