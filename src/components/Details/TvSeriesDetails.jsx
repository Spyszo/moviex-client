import './style.scss'
import './TvSeriesDetails.scss'


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EmbedTrailer from './EmbedTrailer'

import { useHistory } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";





const TvSeriesDetails = () => {

    const history = useHistory();

    const { tvSeriesDetailsVisibility } = useSelector(state => state);

    const [selectedTvSeries, setSelectedTvSeries] = useState(false);

    const [selectedSeason, setSelectedSeason] = useState({
        episodes: []
    })

    const [extendedInfo, setExtendedInfo] = useState(false)

    const dispatch = useDispatch();

    const params = new URLSearchParams(window.location.search)
    const type = params.get("type")
    const id = params.get("id")

    const [seasonIndicator, setSeasonIndicator] = useState(1)

    const posterUrl = "https://image.tmdb.org/t/p/w500/"
    const backdropUrl = "https://image.tmdb.org/t/p/w780/"

    useEffect(() => {
        const getTvSeriesDetails = async () => {
            if (type === "tvseries" && tvSeriesDetailsVisibility === "visible") {
                setSelectedTvSeries(false)

                await axios.get(`https://api.themoviedb.org/3/tv/${id}?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=pl-PL&append_to_response=videos`)
                .then(async res => { 
                    if (res.data.videos.results.length === 0) {
                        const englishTrailers = await axios.get(`https://api.themoviedb.org/3/tv/${id}/videos?api_key=${process.env.REACT_APP_TMDB_API_KEY}`)
                        res.data.videos = englishTrailers.data
                    }
                    if (res.data.seasons[0].season_number === 1) {
                        setSeasonIndicator(0)
                    }
                    setSelectedTvSeries(res.data)
                })

            }
        }

        getTvSeriesDetails()

    }, [id, type, dispatch, tvSeriesDetailsVisibility])


    const handleClose = () => {
        dispatch({
            type: "TOGGLE_TVSERIESDETAILS",
            visibility: "hidden"
        })
        setTimeout(()=>{
            setSelectedTvSeries(null)
            setSeasonIndicator(1)
        }, 250)
        history.push(window.location.pathname);
    }

    const handleExtendInfo = () => {
        if (extendedInfo) { 
            setExtendedInfo(false) 
        }
        else { 
            setExtendedInfo(true)
            handleShowEpisodes(1)
        }
    }

    const handleShowEpisodes = async (season_number) => {
        await axios.get(`https://api.themoviedb.org/3/tv/${id}/season/${season_number}?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=pl-PL`)
        .then(async res => { 
            setSelectedSeason(res.data)
            if (seasonIndicator === 0) {
                setSeasonIndicator(season_number - 1)
            } else {
                setSeasonIndicator(season_number)
            }
        })
    }

    const getSeasonName = (number) => {
        switch (number) {
            case 1:
                return 'sezon';
            case 2:
                return 'sezony';
            case 3:
                return 'sezony';
            case 4:
                return 'sezony';
            default:
                return 'sezonów'

        }
    }

    const getTvSeriesYears = () => {
        console.log(selectedTvSeries.seasons)
        const seasonsArray = selectedTvSeries.seasons.filter(season => season.air_date !== null)
        console.log(seasonsArray)

        const firstSeason = seasonsArray[0].air_date.slice(0,-6);
        const lastSeason = seasonsArray[seasonsArray.length - 1].air_date.slice(0,-6)

        if (firstSeason === lastSeason) {
            return firstSeason
        } else {
            return firstSeason + " - " + lastSeason
        }
        
    }

    const handlePlayEpisode = (episode_number) => {
        selectedTvSeries.selectedSeason = selectedSeason.season_number
        selectedTvSeries.selectedEpisode = episode_number

        dispatch({
            type: "TOGGLE_PLAYER",
            visibility: "visible",
            data: {
                title: selectedTvSeries.name + " - Sezon " + selectedSeason.season_number + " Odcinek " + episode_number,
                mediaType: "tvseries",
                mediaData: selectedTvSeries
            }
        })
    }

    return (
        <>
        <div className={"tvSeriesDetails " + tvSeriesDetailsVisibility + (extendedInfo? " extended" :"")}>
            <div className="background" onClick={ handleClose }></div>
                <div className="content">
                    <div className="content-main"> 
                        <button className="closeButton" onClick={ handleClose }><span className="material-icon">close</span></button>
                        <div className="overview">
                            <div className="images">
                                {selectedTvSeries
                                    ? <img className="poster" src={posterUrl + selectedTvSeries.poster_path} alt={selectedTvSeries.poster_path}/>
                                    : <div className="lazyLoading"></div>
                                }   
                            </div>                
                            <div className="rightSide">
                                <h2 className="title">
                                    {selectedTvSeries
                                        ? selectedTvSeries.name
                                        : <div className="lazyLoading"></div>
                                    }
                                </h2>

                                <div className="info">
                                    {selectedTvSeries
                                        ? <>
                                            <div className="year">
                                                <span className="material-icon">event</span>
                                                {
                                                    getTvSeriesYears()
                                                }
                                            </div>
                                            <div className="runtime">
                                                <span className="material-icon">schedule</span>
                                                {selectedTvSeries.seasons.length + " " + getSeasonName(selectedTvSeries.seasons.length)}
                                            </div>
                                            <div className="vote_average" style={{"--rating": selectedTvSeries.vote_average}}>
                                                <span className="material-icon">star star star star star</span>
                                            </div>
                                        </>
                                        : <div className="lazyLoading"></div>
                                    }
                                </div>

                                <div className="description">
                                    {selectedTvSeries
                                        ? selectedTvSeries.overview
                                        : <div className="lazyLoading"></div>
                                    }
                                </div>

                                <div className="buttons">
                                    {selectedTvSeries
                                        ?<button id="playButton" onClick={handleExtendInfo}>Odcinki<span className="material-icon">{extendedInfo? "expand_less": "expand_more"}</span></button>
                                        :null
                                    }
                                </div>
                            </div>              
                        </div>
                        {selectedTvSeries && selectedTvSeries.videos.results.length > 0 && selectedTvSeries.videos.results[0].type === "Trailer"
                            ? <EmbedTrailer videoId={selectedTvSeries.videos.results[0].key}/> 
                            :null
                        }
                        {selectedTvSeries && selectedTvSeries.backdrop_path
                            ?<div className={"backdrop " + (
                                selectedTvSeries && selectedTvSeries.videos.results.length > 0 && selectedTvSeries.videos.results[0].type === "Trailer"
                                ? null : "active"
                            )}><img src={backdropUrl + selectedTvSeries.backdrop_path} alt={selectedTvSeries.name}/></div> 
                            :null
                        }
                    </div>

                    <div className="content-extended">
                        <div className="seasons">
                            {
                                selectedTvSeries && selectedTvSeries.seasons.map(season => 
                                    <div className="season" key={season.season_number} onClick={()=>handleShowEpisodes(season.season_number)}>
                                        {season.poster_path
                                        ? <img src={posterUrl + season.poster_path} alt={season.name} />
                                        : <span className="material-icon">image</span>
                                        }
                                        <p className="name">{season.name}</p>
                                    </div>
                                )
                            }
                            <div className="indicator" style={{"--step": seasonIndicator}}></div>
                        </div>
                        <div className="episodes">
                            {
                                selectedSeason && selectedSeason.episodes.map(episode => 
                                    <div className={"episode"} key={episode.episode_number}>
                                        <span className="rate">
                                            <span className="material-icon">star</span>
                                            {episode.vote_average.toFixed(1)}
                                        </span>
                                        <div className="image">
                                            {episode.still_path
                                            ? <img src={posterUrl + episode.still_path} alt={episode.name} />
                                            : <span className="material-icon">image</span>
                                            }
                                        </div>
                                        <div className="center">
                                            <div className="title">
                                                {episode.episode_number + ". " + episode.name}
                                            </div>
                                            <div className="overview">
                                                {episode.overview}
                                            </div>
                                        </div>

                                        <div className="buttons">
                                            <button className="watched">
                                                <span className="material-icon">done</span>
                                            </button>
                                            <button className="play" onClick={()=>handlePlayEpisode(episode.episode_number)}>
                                                <span className="material-icon">play_arrow</span>
                                            </button>
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    )

}

export default TvSeriesDetails