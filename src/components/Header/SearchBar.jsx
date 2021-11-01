
import "./SearchBar.scss"

import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import axios from "axios"

import { useDispatch } from "react-redux";

let timeout = {}

const SearchBar = () => {

    const history = useHistory();
    const [results, setResults] = useState(false)
    const [showResults, setShowResults] = useState(false)
    const [searchFocus, setSearchFocus] = useState(false)

    const posterUrl = "https://image.tmdb.org/t/p/w92/"

    const dispatch = useDispatch();

    const searchMovie = (form) =>{
        form.preventDefault()
        let title = form.target.title.value;

        if (title.length >= 3) {
            title = title.replaceAll(" ", "+", )

            history.push("/search/" + title);
        }

        handleFocusSearchBar(false)
    }

    const handleSearch = (e) => {
        clearTimeout(timeout)
        timeout = setTimeout(()=>{
            if (e.target.value.length < 3) {
                setResults(false)
                return
            }
            axios.get(`https://api.themoviedb.org/3/search/multi?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=pl-PL&query=${e.target.value}`)
            .then(res => {
                if (res.data.results.length > 0)
                    setResults(res.data.results.filter((item, i)=> i < 6))
                else
                    setResults(false)
            })
        }, 500)
    }

    const handleClick = (result) => {
        if (result.media_type === "tv") {
            history.push(window.location.pathname + "?type=tvseries&id=" + result.id);
            dispatch({
                type: "TOGGLE_TVSERIESDETAILS",
                visibility: "visible"
            })
        } else {
            history.push(window.location.pathname + "?type=movie&id=" + result.id);
            dispatch({
                type: "TOGGLE_MOVIEDETAILS",
                visibility: "visible"
            }) 
        }
    }

    const handleFocusSearchBar = state => {
        if (!showResults) {
            setTimeout(()=>{
                setShowResults(state)
            }, 250)
        } else {
            setShowResults(state)
        }

        setSearchFocus(state)
    }

    return (
        <div className={"searchBar " + (searchFocus? "active": null)}>
            <form action="/search" method="get" onSubmit={searchMovie} onChange={handleSearch}>
                <input type="text" name="title" onBlur={()=>handleFocusSearchBar(false)} onFocus={()=>handleFocusSearchBar(true)}/>
                <button className="close" type="button" onClick={()=>handleFocusSearchBar(false)}><span className="material-icon">close</span></button>
            </form>

            {results? 
            <div className={"search-results " + (showResults? "show" :null)} style={{"--results-length": results.length}}>
                {results.map((result, i) => 
                    <div className="item" key={i} onClick={()=>handleClick(result)}>
                        <div className="image">
                            { result.backdrop_path
                                ? <img src={posterUrl +  result.backdrop_path} alt={"poster"}/>
                                : <span className="material-icon">image</span>
                            }
                        </div>
                        <div className="title">{result.media_type === "tv"? result.name: result.title}</div>
                    </div>
                )}
            </div>
            : null}
        </div>
    ) 
}

export default SearchBar