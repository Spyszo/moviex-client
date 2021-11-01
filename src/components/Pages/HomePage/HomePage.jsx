import "./HomePage.scss"

import React, {useState} from 'react';

import MovieList from './MovieList'
import TvSeriesList from './TvSeriesList'

import { useDispatch } from "react-redux";

const HomePage = () => {


    const [indicator, setIndicator] = useState("left")


    const dispatch = useDispatch();

    const handleShowMovies = () => {
        setIndicator("left")

        dispatch({
            type: "SET_MOVIES_BACKDROP"
        })
    }

    const handleShowTvSeries = () => {
        setIndicator("right")

        dispatch({
            type: "SET_TVSERIES_BACKDROP"
        })
    }

    return (
        <div className="homePage">
            <div className="switch">
                <button onClick={handleShowMovies}>Filmy</button>
                <button onClick={handleShowTvSeries}>Seriale</button>
                <div className={"indicator " + indicator}></div>
            </div>

            <div className={"movies " + indicator}>
                <MovieList type="popular" name="Popularne"/>
                <MovieList type="topRated" name="Najwyżej oceniane"/>
                <MovieList type="trending" name="Zyskujące popularność"/>
                <MovieList type="UHDReleases" name="Najnowosze wydania 4K"/>
            </div>

            <div className={"tvseries " + indicator}>
                <TvSeriesList type="popular" name="Popularne"/>
                <TvSeriesList type="topRated" name="Najwyżej oceniane"/>
                <TvSeriesList type="netflix" name="Netflix"/>
                <TvSeriesList type="hbo" name="HBO"/>
            </div>

        </div>
    )

}

export default HomePage