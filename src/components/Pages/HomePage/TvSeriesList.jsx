import './style.scss'

import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import TvSeries from '../../TvSeries'

import { useDispatch } from "react-redux";


const TvSeriesList = (props) => {

    const [tvSeries, setTvSeries] = useState([]);


    const isTouch = (('ontouchstart' in window) || (navigator.msMaxTouchPoints > 0));
    
    const [leftArrow, setLeftArrow] = useState(false)
    const [rightArrow, setRightArrow] = useState(!isTouch)

    const dispatch = useDispatch();

    const list = useRef()

    let tmdbUrl = ""
    
    switch(props.type) {
        case 'popular':
            tmdbUrl = `https://api.themoviedb.org/3/discover/tv?vote_count.gte=50&sort_by=popularity.desc&api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=en`
            break;
        case 'topRated':
            tmdbUrl = `https://api.themoviedb.org/3/discover/tv?sort_by=vote_average.desc&vote_count.gte=5000&with_release_type=5&api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=pl-PL`
            break;
        case 'netflix':
            tmdbUrl = `https://api.themoviedb.org/3/discover/tv?with_networks=213&api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=pl-PL`
            break;
        case 'hbo':
            tmdbUrl = `https://api.themoviedb.org/3/discover/tv?with_networks=49&api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=pl-PL`
            break;
        default:
            tmdbUrl = `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=pl-PL`
            break;
    }

    useEffect(() => {
        axios.get(tmdbUrl)
            .then(res => {
                if (props.type === 'popular') {
                    for (let i = 0; i <= res.data.results.length; i++) {
                        //console.log(res.data.results[i])
                        if (res.data.results[i].backdrop_path != null) {
                            dispatch({
                                type: "CHANGE_TVSERIES_BACKDROP",
                                backdrop_path: res.data.results[i].backdrop_path
                            })
                            break;
                        }
                    }
                }
                //console.log(res.data.results)
                setTvSeries(res.data.results)
            })
    }, [dispatch, tmdbUrl, props.type])

    const handleScrollLeft = () => {
        setRightArrow(true)

        list.current.scrollLeft -= list.current.offsetWidth - 200
        if (list.current.scrollLeft - list.current.offsetWidth <= 0) {
            setLeftArrow(false)
        }
    }

    const handleScrollRight = () => {
        setLeftArrow(true)
        
        list.current.scrollLeft += list.current.offsetWidth - 200
        if (list.current.scrollLeft + 2 * list.current.offsetWidth >= list.current.scrollWidth) {
            setRightArrow(false)
        }
    }

    return (
        <div className="tvSeries-list">
            <h2 className="sectionTitle">{props.name}</h2>
            {leftArrow?<div className="leftArrow material-icon" onClick={handleScrollLeft}>arrow_back_ios</div>:null}
            
            <div className={`list ${isTouch && "mobile"}`} ref={list}>
                {tvSeries
                    ? tvSeries.map((tvSeries, i) => <TvSeries key={i} data={tvSeries} />)
                    : Array(10).fill(1).map((el, i) =><div key={i} className="movieItem"></div> )
                }
            </div>
            
            {rightArrow?<div className="rightArrow material-icon" onClick={handleScrollRight}>arrow_forward_ios</div>:null}
        </div>
    )

}

export default TvSeriesList