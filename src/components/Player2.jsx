import './Player.scss'

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Replay } from 'vimond-replay';
import HlsjsVideoStreamer from 'vimond-replay/video-streamer/hlsjs';
import 'vimond-replay/index.css';


import { useDispatch, useSelector } from "react-redux";


const movieSearchHistory = {}
const tvSeriesSearchHistory = {
    id: {
        season: {
            episode: {
                sources: {

                }
            }
        }
    }
}

const Player = (props) => {
    const [sources, setSources] = useState([])
    const [selectedSource, setSelectedSource] = useState(false)
    const [showSources, setShowSources] = useState(true)
    const [animation, setAnimation] = useState(false)
    const [show, setShow] = useState(false)
 
    const { playerVisibility, playerData } = useSelector(state => state);
    const dispatch = useDispatch();


    useEffect(()=>{
        if (playerVisibility === "visible") {
            setShow(true)
            setTimeout(()=>{
                setAnimation(true)
            }, 30)
        } else {
            setAnimation(false)
            setTimeout(()=>{
                setShow(false)
                setSelectedSource(false)
                setShowSources(true)
                setSources([])
            }, 150)
        }
    }, [playerVisibility])

    useEffect(()=>{
        if (show) {
            if (playerData.mediaType === "movie") {
                const movie = playerData.mediaData

                if (movieSearchHistory[movie.id]) {
                    setSources(movieSearchHistory[movie.id].sources)
                    return
                }

                const year = movie.release_date.slice(0,4)

                axios.get(`http://localhost:8081/movie/search?title=${movie.title}&tmdb_id=${movie.id}&imdb_id=${movie.imdb_id}&original_title=${movie.original_title}&year=${year}`)
                    .then(res=>{
                        if (!res.data || res.data.length === 0) {
                            setSources(null)
                            movieSearchHistory[movie.id] = {...movie, sources: null}
                        } else {
                            setSources(res.data)
                            movieSearchHistory[movie.id] = {...movie, sources: res.data}
                        }          
                    })

            } 
            
            
            else if (playerData.mediaType === "tvseries") {
                const tvSeries = playerData.mediaData

                if (tvSeriesSearchHistory[tvSeries.id]) {
                    if (tvSeriesSearchHistory[tvSeries.id].selectedSeason === tvSeries.selectedSeason) {
                        if (tvSeriesSearchHistory[tvSeries.id].selectedEpisode === tvSeries.selectedEpisode) {
                            setSources(tvSeriesSearchHistory[tvSeries.id].sources)
                            return
                        }
                    }
                }

                const year = tvSeries.first_air_date.slice(0,4)
                axios.get(`http://localhost:8081/tvseries/search?title=${tvSeries.name}&tmdb_id=${tvSeries.id}&original_title=${tvSeries.original_name}&year=${year}&season=${tvSeries.selectedSeason}&episode=${tvSeries.selectedEpisode}`)
                    .then(res=>{
                        console.log(res.data)
                        if (!res.data || res.data.length === 0) {
                            setSources(null)
                            tvSeriesSearchHistory[tvSeries.id] = {...tvSeries, sources: null}
                        } else {
                            setSources(res.data)
                            tvSeriesSearchHistory[tvSeries.id] = {...tvSeries, sources: res.data}
                        }          
                    })

            }
        }
    }, [playerData, show])

    const handleChangeSource = (source) => {
        setShowSources(false)
        setSelectedSource(source)
    }

    const handleShowSources = () => {
        if (showSources) setShowSources(false)
        else setShowSources(true)
    }

    const handleClose = () => {
        dispatch({
            type: "TOGGLE_PLAYER",
            visibility: "hidden",
            data: {}
        })
    }

    return (
        show?
        <div className="player-overlay">
            <div className={"background " + (animation ? "active" : null)} onClick={handleClose}></div>
            <div className={"player-container " + (animation ? "active" : null)}>
                <div className="player-header">
                    <p className="media-title">
                        {playerData.title}
                    </p>
                    <button className="close" onClick={handleClose}>
                        <span className="material-icon">close</span>
                    </button>
                </div>
                <div className="player">
                    {selectedSource ? <>
                        {selectedSource.type === 'iframe'
                            ?   <iframe title="player" src={selectedSource.link} frameborder="0" scrolling="no" allowfullscreen="allowfullscreen"></iframe> 
                            :   <Replay
                                source={selectedSource.resolvedUrl}
                                controls={true}
                                width="100%"
                                height="auto"
                                options={{
                                    controls: {
                                      includeControls: [
                                        'playPauseButton',
                                        'timeline',
                                        'timeDisplay',
                                        'volume',
                                        'fullscreenButton',
                                        'airPlayButton'
                                      ],
                                    },
                                  }}
                                >
                                    {selectedSource.type === 'm3u8'? 
                                        <HlsjsVideoStreamer/>
                                    :null}

                                </Replay>
                        }
                    </>: null
                    }
                </div>
                <div className={"sources " + (showSources? "show" : null)}>
                    <ul className="sources-list">
                        {sources === null
                            ? <h4>Brak źródeł!</h4>
                            : sources.length > 0
                                ? <>
                                    <h2>Wybierz źródło</h2>
                                    {
                                        sources.map((source, i) => 
                                            <li key={i} onClick={() => handleChangeSource(source)}>
                                                <div className="service"><img src={"/images/" + source.service.toLowerCase() + ".png"} service={source.service.toLowerCase()} alt={source.service}/></div>
                                                <span className="language">{source.language}</span>
                                                <span className="quality">{source.quality}</span>
                                            </li>
                                        )
                                    }
                                </>
                                : <h4>Szukam źródeł...</h4>
                        }
                    </ul>
                </div>
                <div className="player-footer">
                    {selectedSource
                        ? <>
                            <div className="service"><img src={"/images/" + selectedSource.service.toLowerCase() + ".png"} alt={selectedSource.service}/></div>

                            <button onClick={handleShowSources}>Zmień źródło</button>
                            <div>
                                <span className="language">{selectedSource.language}</span>
                                <span className="quality">{selectedSource.quality}</span>
                            </div>
                          </>
                        :null
                    }
                </div>
            </div>
        </div>
        :null
    )
}

export default Player