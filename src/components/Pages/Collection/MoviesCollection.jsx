/* eslint-disable react-hooks/exhaustive-deps */
import "./MoviesCollection.scss"
import { useState, useEffect } from "react";
import Movie from "../../Movie"
import Cookies from 'universal-cookie';


const Collection = (props) => {

    const [sortType, setSortType] = useState("ADD_DESC")
    const [groupMovies, setGroupMovies] = useState(false);


    const cookies = new Cookies();


    const handleGroupByYear = (e) => {
        if (e.target.checked) {
            cookies.set("collection_movies_group", true)
            setGroupMovies(true)
        } else {
            setGroupMovies(false)
            cookies.set("collection_movies_group", false)
        }
    }

    useEffect(()=>{
        const ifGroupMovies = cookies.get("collection_movies_group")
        if (ifGroupMovies === "true") {
            setGroupMovies(true)
        }

        const ifSortType = cookies.get("collection_movies_sortType")
        if (ifSortType) {
            setSortType(ifSortType)
        }
    }, [])

    const movies = props.movies

    const mapMovies = (movies) => {
        switch(sortType) {
            case "YEAR_DESC":
                if (groupMovies) {
                    let yearsArray = movies.map(movie => movie.year)
                    yearsArray = Array.from(new Set(yearsArray))
                    yearsArray = yearsArray.sort().reverse()
                    
                    return yearsArray.map((year, i)=>{
                        return [
                            <div key={i} className="separator">{year}</div>,
                            
                            movies.filter(movie => movie.year === year).map(
                                movie => <Movie key={movie.id} data={movie} />
                            )
                        ]
                    })
                } else {
                    const sortedMovies = movies.sort((a,b) => b.year - a.year);
                    return sortedMovies.map((movie, i) => <Movie key={i} data={movie}/>)
                }
            case "YEAR_ASC":
                if (groupMovies) {
                    let yearsArray = movies.map(movie => movie.year)
                    yearsArray = Array.from(new Set(yearsArray))
                    yearsArray = yearsArray.sort()
                    
                    return yearsArray.map((year, i)=>{
                        return [
                            <div key={i} className="separator">{year}</div>,
                            
                            movies.filter(movie => movie.year === year).map(
                                movie => <Movie key={movie.id} data={movie} />
                            )
                        ]
                    })
                } else {
                    const sortedMovies = movies.sort((a,b) => a.year - b.year);
                    return sortedMovies.map((movie, i) => <Movie key={i} data={movie}/>)
                }
            case "ADD_DESC":
                if (groupMovies) {

                    let datesArray = (movies.map(movie => 
                        new Date(movie.added_at).getMonth() + "-" + new Date(movie.added_at).getFullYear()
                    ))

                    datesArray = Array.from(new Set(datesArray))
                    datesArray = datesArray.sort().reverse()

                    const months = ["Styczeń", "Luty", "Marzec", "Kwiecień", "Czerwiec", "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"]
                    
                    return datesArray.map((date, i)=>{
                        const month = months[date.slice(0,1)]
                        const year = date.slice(2)
                        return [
                            <div key={i} className="separator">{month} {year}</div>,
                            
                            movies.filter(movie => {
                                const movieDate = new Date(movie.added_at).getMonth() + "-" + new Date(movie.added_at).getFullYear()
                                return movieDate === date
                            }).map(
                                movie => <Movie key={movie.id} data={movie} />
                            )
                        ]
                    })
                } else {
                    const sortedMovies = movies.sort((a,b) => b.added_at - a.added_at);
                    return sortedMovies.map((movie, i) => <Movie key={i} data={movie}/>)
                }
            case "ADD_ASC":
                if (groupMovies) {
                    let datesArray = (movies.map(movie => 
                        new Date(movie.added_at).getMonth() + "-" + new Date(movie.added_at).getFullYear()
                    ))

                    datesArray = Array.from(new Set(datesArray))
                    datesArray = datesArray.sort()

                    const months = ["Styczeń", "Luty", "Marzec", "Kwiecień", "Czerwiec", "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"]
                    
                    return datesArray.map((date, i)=>{
                        const month = months[date.slice(0,1)]
                        const year = date.slice(2)
                        return [
                            <div key={i} className="separator">{month} {year}</div>,
                            
                            movies.filter(movie => {
                                const movieDate = new Date(movie.added_at).getMonth() + "-" + new Date(movie.added_at).getFullYear()
                                return movieDate === date
                            }).map(
                                movie => <Movie key={movie.id} data={movie} />
                            )
                        ]
                    })
                } else {
                    const sortedMovies = movies.sort((a,b) => a.added_at - b.added_at);
                    return sortedMovies.map((movie, i) => <Movie key={i} data={movie}/>)
                }
            case "TITLE_DESC":
                let firstLetters = (movies.map(movie => movie.title.slice(0,1).toUpperCase()))
                firstLetters = Array.from(new Set(firstLetters))
                firstLetters = firstLetters.sort()

                return firstLetters.map((letter, i)=>{
                    if (groupMovies) {
                        return [
                            <div key={i} className="separator">{letter}</div>,
                            
                            movies.filter(movie => movie.title.slice(0,1).toUpperCase() === letter).map(
                                movie => <Movie key={movie.id} data={movie} />
                            )
                        ]
                    }
                    return movies.filter(movie => movie.title.slice(0,1).toUpperCase() === letter).map(
                            movie => <Movie key={movie.id} data={movie} />
                        )
                    
                });
            case "TITLE_ASC":
                let firstLetters_asc = (movies.map(movie => movie.title.slice(0,1).toUpperCase()))
                firstLetters_asc = Array.from(new Set(firstLetters_asc))
                firstLetters_asc = firstLetters_asc.sort().reverse()

                return firstLetters_asc.map((letter, i)=>{
                    if (groupMovies) {
                        return [
                            <div key={i} className="separator">{letter}</div>,
                            
                            movies.filter(movie => movie.title.slice(0,1).toUpperCase() === letter).map(
                                movie => <Movie key={movie.id} data={movie} />
                            )
                        ]
                    }
                    return movies.filter(movie => movie.title.slice(0,1).toUpperCase() === letter).map(
                            movie => <Movie key={movie.id} data={movie} />
                        )
                    
                })
            default:
                return movies.map((movie, i) => <Movie key={i} data={movie}/>)
        }
    }

    const handleChangeSorting = e => {
        cookies.set("collection_movies_sortType", e.target.value)
        setSortType(e.target.value)
    }

    return (
        <div className="moviesCollection">
            <div className="filters">
                <select value={sortType} onChange={handleChangeSorting}>
                    <option value="YEAR_DESC">Rok premiery: malejąco</option>
                    <option value="YEAR_ASC">Rok premiery: rosnąco</option>
                    <option value="ADD_DESC">Data dodania: malejąco</option>
                    <option value="ADD_ASC">Data dodania: rosnąco</option>
                    <option value="TITLE_DESC">Tytuł: A do Z</option>
                    <option value="TITLE_ASC">Tytuł: Z do A</option>
                </select>
                <div className="group_checkbox">
                    <label htmlFor="group_movies">Grupuj</label>
                    <input checked={groupMovies} id="group_movies" type="checkbox" onChange={handleGroupByYear}/>
                    <span className="material-icon">done</span>
                </div>
            </div>
            { mapMovies(movies) }
        </div>
    )
}

export default Collection