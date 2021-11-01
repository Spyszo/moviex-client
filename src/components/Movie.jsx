/* eslint-disable react-hooks/exhaustive-deps */
import "./Movie.scss"

import React, {useRef, useState} from 'react';

import { useHistory } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import axios from "axios";

import Modal from "./Portals/Modal";


const Movie = (props) => {
    const history = useHistory();

    const dispatch = useDispatch();

    const buttonsRef = useRef(null);

    const [inCollection, setInCollection] = useState(false)
    const [showLists, setShowLists] = useState(false)

    const { movieCollection, userData} = useSelector(state => state);

    if (!inCollection && movieCollection.includes(props.data.id)) {
        setInCollection(true)
    } else {
        if (inCollection && !movieCollection.includes(props.data.id)) {
            setInCollection(false)
        }
    }




    let posterUrl = props.data.poster_path? "https://image.tmdb.org/t/p/w342/" + props.data.poster_path: ""

    const handleClick = (e) => {
        if (userData && buttonsRef.current.contains(e.target) ) return null
        history.push(window.location.pathname + "?type=movie&id=" + props.data.id);
        dispatch({
            type: "TOGGLE_MOVIEDETAILS",
            visibility: "visible"
        })
    }

    const handleAddToCollection = () => {
        axios.post("http://localhost:5000/api/collection/movies/add", {
            id: props.data.id,
            title: props.data.title,
            poster_path: props.data.poster_path,
            backdrop_path: props.data.backdrop_path,
            year: props.data.release_date.slice(0,4)
        }, {
            withCredentials: true,
            credentials: "include"
        }).then(res=> {
            //setInCollection(true)
            dispatch({
                type: "MOVIECOLLECTION_ADD",
                movieID: props.data.id
            })
        })
    }

    const handleRemoveFromCollection = () => {

        console.log(props.data.id)

        axios.post("http://localhost:5000/api/collection/movies/remove", {
            id: props.data.id,
        }, {
            withCredentials: true,
            credentials: "include"
        }).then(res=> {
            //setInCollection(false)
            dispatch({
                type: "MOVIECOLLECTION_REMOVE",
                movieID: props.data.id
            })
        })
    }

    const handleShowListsMenu = () => {
        setShowLists(!showLists)
    }

    return (
        <div className="movieItem" onClick={handleClick}>
            {userData &&
                <div className="buttons" ref={buttonsRef}>
                    { inCollection
                        ? <button onClick={handleRemoveFromCollection} className="inCollection"><span className="material-icon">favorite</span></button>
                        : <button onClick={handleAddToCollection}><span className="material-icon">favorite_border</span></button>
                    }

                    <button onClick={handleShowListsMenu}><span className="material-icon">settings</span></button>

                    {
                        showLists && 
                        <Modal close={()=>setShowLists(false)}> 
                            
                        </Modal>
                    }
                </div>
            }
            {posterUrl
                ? <img src={posterUrl} alt={props.data.title} />
                : <span className="material-icon">image</span>
            }
            <p className="title">{props.data.title}</p>
        </div>
    )
    
}

export default Movie