import "./TvSeries.scss"

import React, { useRef, useState } from 'react';

import { useHistory } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import axios from "axios"


const TvSeries = (props) => {
    const history = useHistory();

    const dispatch = useDispatch();

    const buttonsRef = useRef(null);
    const [inCollection, setInCollection] = useState(false)

    const { tvSeriesCollection, userData } = useSelector(state => state);

    if (!inCollection && tvSeriesCollection.includes(props.data.id)) {
        setInCollection(true)
    } else {
        if (inCollection && !tvSeriesCollection.includes(props.data.id)) {
            setInCollection(false)
        }
    }

    let posterUrl = "https://image.tmdb.org/t/p/w342/" + props.data.poster_path

    if (!props.data.poster_path)  posterUrl = "";


    const handleClick = (e) => {
        if (userData && buttonsRef.current.contains(e.target)) return null
        history.push(window.location.pathname + "?type=tvseries&id=" + props.data.id);
        dispatch({
            type: "TOGGLE_TVSERIESDETAILS",
            visibility: "visible"
        })
    }

    const handleAddToCollection = () => {
        axios.post("http://localhost:5000/api/collection/tvseries/add", {
            id: props.data.id,
            name: props.data.name,
            poster_path: props.data.poster_path,
            backdrop_path: props.data.backdrop_path,
        }, {
            withCredentials: true,
            credentials: "include"
        }).then(res=> {
            //setInCollection(true)
            dispatch({
                type: "TVSERIESCOLLECTION_ADD",
                tvSeriesID: props.data.id
            })
        })
    }

    const handleRemoveFromCollection = () => {

        console.log(props.data.id)

        axios.post("http://localhost:5000/api/collection/tvseries/remove", {
            id: props.data.id,
        }, {
            withCredentials: true,
            credentials: "include"
        }).then(res=> {
            //setInCollection(false)
            dispatch({
                type: "TVSERIESCOLLECTION_REMOVE",
                tvSeriesID: props.data.id
            })
        })
    }

    return (
    <div className="tvSeriesItem" onClick={handleClick}>
        {userData &&
            <div className="buttons" ref={buttonsRef}>
                { inCollection
                    ? <button onClick={handleRemoveFromCollection} className="inCollection"><span className="material-icon">favorite</span></button>
                    : <button onClick={handleAddToCollection}><span className="material-icon">favorite_border</span></button>
                }
            </div>
        }
        {posterUrl
            ? <img src={posterUrl} alt={props.data.name}/>
            : <span className="material-icon">image</span>
        }
        <p className="title">{props.data.name}</p>
    </div>
    )
    
}

export default TvSeries