import "./style.scss"

import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Movie from '../../Movie'

import { useDispatch } from "react-redux";


const Popular = (props) => {

    const [movies, setMovies] = useState(false);


    const isTouch = (('ontouchstart' in window) || (navigator.msMaxTouchPoints > 0));
    
    const [leftArrow, setLeftArrow] = useState(false)
    const [rightArrow, setRightArrow] = useState(!isTouch)

    const dispatch = useDispatch();

    const list = useRef()

    let tmdbUrl = ""
    
    switch(props.type) {
        case 'popular':
            tmdbUrl = `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=pl-PL`
            break;
        case 'topRated':
            tmdbUrl = `https://api.themoviedb.org/3/discover/movie?primary_release_year=2020&sort_by=vote_average.desc&vote_count.gte=2000&with_release_type=5&api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=pl-PL`
            break;
        case 'trending':
            tmdbUrl = `https://api.themoviedb.org/3/trending/movie/day?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=pl-PL`
            break;
        case 'UHDReleases':
            tmdbUrl = `https://api.themoviedb.org/4/list/43981?sort_by=primary_release_date.desc&api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=pl-PL`
            break;
        default:
            tmdbUrl = `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=pl-PL`
            break;
    }

    useEffect(() => {
        axios.get(tmdbUrl)
            .then(res => {
                //console.log(props.type)
                if (props.type === 'popular') {
                    for (let i = 0; i <= res.data.results.length; i++) {
                        if (res.data.results[i].backdrop_path != null) {
                            dispatch({
                                type: "CHANGE_BACKDROP",
                                backdrop_path: res.data.results[i].backdrop_path
                            })
                            dispatch({
                                type: "CHANGE_MOVIES_BACKDROP",
                                backdrop_path: res.data.results[i].backdrop_path
                            })
                            break;
                        }
                    }
                }
                setMovies(res.data.results)
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
        <div className="movie-list">
            <h2 className="sectionTitle">{props.name}</h2>
            { leftArrow? <div className="leftArrow material-icon" onClick={handleScrollLeft}>arrow_back_ios</div>: null }

            <div className={`list ${isTouch && "mobile"}`} ref={list}>
                {movies
                    ? movies.map((movie, i) => <Movie key={i} data={movie} />) 
                    : Array(10).fill(1).map((el, i) =><div key={i} className="movieItem"></div> )
                }
            </div>

            { rightArrow? <div className="rightArrow material-icon" onClick={handleScrollRight}>arrow_forward_ios</div>: null }
        </div>
    )

}

export default Popular