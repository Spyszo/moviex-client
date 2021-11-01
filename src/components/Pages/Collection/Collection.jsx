/* eslint-disable react-hooks/exhaustive-deps */
import "./Collection.scss"
import { useEffect, useState } from "react";
import axios from "axios";
import MoviesCollection from "./MoviesCollection"
import TvSeriesCollection from "./TvSeriesCollection"
import ListsCollection from "./ListsCollection"
import { useDispatch, useSelector } from "react-redux";
import { CSSTransition, TransitionGroup } from 'react-transition-group'

const Collection = () => {

    const [collection, setCollection] = useState({
        movies: [],
        tvSeries: [],
        lists: []
    })
    const [indicator, setIndicator] = useState("movies")

    const dispatch = useDispatch();

    const { movieCollection } = useSelector(state => state);

    useEffect(()=> {
        axios.get("http://localhost:5000/api/collection", {
            withCredentials: true,
            credentials: "include"
        })
            .then(res=>res.data)
            .then(res=>{
                console.log(res)
                if (res.authenticated === false) return
                setCollection({
                    movies: res.movies,
                    tvSeries: res.tvSeries,
                    lists: res.movies,
                })
                for (let i = 0; i <= res.movies.length; i++) {
                    if (res.movies[i].backdrop_path != null) {
                        dispatch({
                            type: "CHANGE_BACKDROP",
                            backdrop_path: res.movies[i].backdrop_path
                        })
                        dispatch({
                            type: "CHANGE_MOVIES_BACKDROP",
                            backdrop_path: res.movies.backdrop_path
                        })
                        break;
                    }
                }
            })
            .catch(err=> {
                console.log("Błąd", err)
            });
    
    }, [movieCollection])

    const handleShowMovies = () => {
        setIndicator("movies")
    }

    const handleShowTvSeries = () => {
        setIndicator("tvseries")
    }

    const handleShowLists = () => {
        setIndicator("lists")
    }

    return (
    <div className="collection">

        <div className="switch">
            <button onClick={handleShowMovies}>Filmy</button>
            <button onClick={handleShowTvSeries}>Seriale</button>
            <button onClick={handleShowLists}>Listy</button>
            <div className={"indicator " + indicator}></div>
        </div>

        <div className="collection-content">
            <TransitionGroup>
                <CSSTransition
                in={true}
                classNames="page"
                key={indicator}
                appear={true}
                timeout={600}
                unmountOnExit
                >
                    <>
                        { indicator === "movies" && <MoviesCollection movies={collection.movies}/> }
                        { indicator === "tvseries" && <TvSeriesCollection tvSeries={collection.tvSeries}/> }
                        { indicator === "lists" && <ListsCollection movies={collection.lists}/> }
                    </>
                </CSSTransition>
            </TransitionGroup>
        </div>

    </div>
    )
}

export default Collection