import "./style.scss"

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EmbedTrailer from './EmbedTrailer'

import { useDispatch } from "react-redux";

import { useHistory } from "react-router-dom";

import { useSelector } from "react-redux";



const Search = () => {

    const history = useHistory();

    const { movieDetailsVisibility } = useSelector(state => state);

    const [movie, setMovie] = useState(false);

    const dispatch = useDispatch();

    const params = new URLSearchParams(window.location.search)
    const type = params.get("type")
    const id = params.get("id")


    const posterUrl = "https://image.tmdb.org/t/p/w500/"
    const backdropUrl = "https://image.tmdb.org/t/p/w780/"

    useEffect(() => {
        const getMovieDetails = async () => {
            if (type === "movie" && movieDetailsVisibility === "visible") {
                setMovie(false)

                await axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=pl-PL&append_to_response=videos`)
                .then(async res => { 
                    if (res.data.videos.results.length === 0) {
                        const englishTrailers = await axios.get(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=341e1383cc1f8f4613ec7c2c06b80273`)
                        res.data.videos = englishTrailers.data
                    }
                    setMovie(res.data)
                })

            }
        }

        getMovieDetails()

    }, [id, type, dispatch, movieDetailsVisibility])


    const handleClose = () => {
        dispatch({
            type: "TOGGLE_MOVIEDETAILS",
            visibility: "hidden"
        })
        setTimeout(()=>{
            setMovie(null)
        }, 250)
        history.push(window.location.pathname);
    }

    const handlePlayMovie = () => {
        dispatch({
            type: "TOGGLE_PLAYER",
            visibility: "visible",
            data: {
                title: movie.title,
                mediaType: "movie",
                mediaData: movie
            }
        })
    }


    return (
        <>
        <div className={"movieDetails " + movieDetailsVisibility}>
            <div className="background" onClick={ handleClose }></div>
                <div className="content">
                    <div className="content-main">
                        <button className="closeButton" onClick={ handleClose }><span className="material-icon">close</span></button>
                        <div className="overview">
                            <div className="images">
                                {movie
                                    ? <img className="poster" src={posterUrl + movie.poster_path} alt={movie.poster_path}/>
                                    : <div className="lazyLoading"></div>
                                }   
                            </div>                
                            <div className="rightSide">
                                <h2 className="title">
                                    {movie
                                        ? movie.title
                                        : <div className="lazyLoading"></div>
                                    }
                                </h2>

                                <div className="info">
                                    {movie
                                        ? <>
                                            <div className="year">
                                                <span className="material-icon">event</span>
                                                {movie.release_date? movie.release_date.slice(0,4): null}
                                            </div>
                                            <div className="runtime">
                                                <span className="material-icon">schedule</span>
                                                {Math.floor(movie.runtime / 60)}h {movie.runtime % 60 !== 0? movie.runtime % 60 + "m" : null}
                                            </div>
                                            <div className="vote_average" style={{"--rating": movie.vote_average}}>
                                                <span className="material-icon">star star star star star</span>
                                            </div>
                                        </>
                                        : <div className="lazyLoading"></div>
                                    }
                                </div>

                                <div className="description">
                                    {movie
                                        ? movie.overview
                                        : <div className="lazyLoading"></div>
                                    }
                                </div>

                                <div className="buttons">
                                    {movie
                                        ?<button id="playButton" onClick={handlePlayMovie}><span className="material-icon">play_circle</span>Odtwórz</button>
                                        :null
                                    }
                                </div>
                            </div>              
                        </div>
                        {/* {
                        movie && movie.videos.results.length > 0 && movie.videos.results[0].type === "Trailer" 
                        ? <EmbedTrailer videoId={movie.videos.results[0].key}/> 
                        : movie && movie.backdrop_path
                            ? <div className="backdrop"><img src={backdropUrl + movie.backdrop_path} alt={movie.title}/></div>
                            : null
                        }  */}

                        {movie && movie.videos.results.length > 0 && movie.videos.results[0].type === "Trailer"
                            ? <EmbedTrailer videoId={movie.videos.results[0].key}/> 
                            :null
                        }
                        {movie && movie.backdrop_path
                            ? <div className={"backdrop " + (
                                movie && movie.videos.results.length > 0 && movie.videos.results[0].type === "Trailer"
                                ? null : "active"
                            )}>
                                <img src={backdropUrl + movie.backdrop_path} alt={movie.title}/>
                            </div> 
                            : null
                        }
                    </div>
                </div>
            </div>
        </>
    )

}

export default Search