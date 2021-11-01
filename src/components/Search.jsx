import "./Search.scss"

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Movie from './Movie'
import TvSeries from './TvSeries'

import { useParams } from "react-router-dom";

import { useDispatch } from "react-redux";


const Search = () => {

    const { title } = useParams();

    const [movies, setMovies] = useState([]);

    const dispatch = useDispatch()

    useEffect(() => {
        axios.get(`https://api.themoviedb.org/3/search/multi?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=pl-PL&query=${title}`)
            .then(res => {
                for (let i = 0; i <= res.data.results.length; i++) {
                    if (res.data && res.data.results.length > 0 && res.data.results[i].backdrop_path != null) {
                        dispatch({
                            type: "CHANGE_BACKDROP",
                            backdrop_path: res.data.results[i].backdrop_path
                        })
                        break;
                    }
                }
                setMovies(res.data.results)
            })
    }, [title, dispatch])


    return (
        <div className="searchResults">
            <h2>Wynik wyszukiwania: "{title}":</h2>
            {movies.map((movie, i) => {
                if (movie.media_type === "movie")
                    return <Movie key={i} data={movie} />
                if (movie.media_type === "tv")
                    return <TvSeries key={i} data={movie} />
                return null
            })}

            {movies.length === 0? <h3>Brak wyników</h3> :null}
        </div>
    )

}

export default Search