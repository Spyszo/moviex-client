import './VideoPlayer.scss'

import { Replay } from 'vimond-replay';
import HlsjsVideoStreamer from 'vimond-replay/video-streamer/hlsjs';
import 'vimond-replay/index.css';

import { useState, useEffect } from "react"

import { useSelector, useDispatch } from "react-redux";

import axios from 'axios'

const movieHistory = {}
const tvSeriesHistory = {}

const VideoPlayer = (props) => {
    
    const { playerVisibility, playerData } = useSelector(state => state);
    
    const [searchingMedia, setSearchingMedia] = useState(false)
    const [playerStarted, setPlayerStarted] = useState(false)
    const [sources, setSources] = useState(false)
    const [showSources, setShowSources] = useState(false)
    const [errorMessage, setErrorMessage] = useState(false)
    const [selectedSource, setSelectedSource] = useState(false)
    const [show, setShow] = useState(false)


    useEffect(()=>{
        setTimeout(()=>{
            if (playerVisibility === "visible") {
                setShow(true)
            } else {
                setShow(false)
            }
        }, 50)
    }, [playerVisibility])

    const fetchMovieSources = async () => {
        try {
            const movie = playerData.mediaData

            if (movieHistory[movie.id]) {
                if (movieHistory[movie.id].sources.length === 0) {
                    return 404
                } else {
                    return movieHistory[movie.id].sources
                }
            }

            const year = movie.release_date.slice(0,4)
            return await axios.get(`http://localhost:8081/movie/search?title=${movie.title}&tmdb_id=${movie.id}&imdb_id=${movie.imdb_id}&original_title=${movie.original_title}&year=${year}`)
                .then(res=>{
                    if (!res.data || res.data.length === 0) {
                        return 404
                    } else {
                        movieHistory[movie.id] = {
                            sources: res.data
                        }
                        console.log(res.data)
                        return res.data
                    }          
                }).catch(err => {
                    return 500
                })
        } catch (err){
            return 500
        }
    }

    const fetchTvSeriesSources = async () => {
        try {
            const tvSeries = playerData.mediaData

            if (tvSeriesHistory[tvSeries.id] && tvSeriesHistory[tvSeries.id][tvSeries.selectedSeason] && tvSeriesHistory[tvSeries.id][tvSeries.selectedSeason][tvSeries.selectedEpisode]) {
                if (tvSeriesHistory[tvSeries.id][tvSeries.selectedSeason][tvSeries.selectedEpisode].sources.length === 0) {
                    return 404
                } else {
                    return tvSeriesHistory[tvSeries.id][tvSeries.selectedSeason][tvSeries.selectedEpisode].sources
                }
            }

            const year = tvSeries.first_air_date.slice(0,4)
            return await axios.get(`http://192.168.0.220:8081/tvseries/search?title=${tvSeries.name}&tmdb_id=${tvSeries.id}&original_title=${tvSeries.original_name}&year=${year}&season=${tvSeries.selectedSeason}&episode=${tvSeries.selectedEpisode}`)
                .then(res=>{
                    if (!res.data || res.data.length === 0) {
                        return 404
                    } else {
                        if (!tvSeriesHistory[tvSeries.id]) {
                            tvSeriesHistory[tvSeries.id] = {}
                        }
                        if (!tvSeriesHistory[tvSeries.id][tvSeries.selectedSeason]) {
                            tvSeriesHistory[tvSeries.id][tvSeries.selectedSeason] = {}
                        }
                        if (!tvSeriesHistory[tvSeries.id][tvSeries.selectedSeason][tvSeries.selectedEpisode]) {
                            tvSeriesHistory[tvSeries.id][tvSeries.selectedSeason][tvSeries.selectedEpisode] = {
                                sources: res.data
                            }
                        }
                        return res.data
                    }          
                }).catch(err => {
                    return 500
                })
        } catch (err){
            return 500
        }
    }



    const dispatch = useDispatch();

    const handleClose = async () => {
        setShow(false)

        setTimeout(()=>{
            setSearchingMedia(false)
            setSources(false)
            setPlayerStarted(false)
            setSelectedSource(false)
            setErrorMessage(false)
            setShowSources(false)
            dispatch({
                type: "TOGGLE_PLAYER",
                visibility: "hidden",
                data: {}
            })
        }, 250)
    }

    const handleClickPlay = async () => {
        setPlayerStarted(true)
        setSearchingMedia(true)

        const sources = playerData.mediaType === "movie"? await fetchMovieSources() : await fetchTvSeriesSources()

        if (sources === 500) {
            setErrorMessage("Błąd serwera")
        } else if (sources === 404) {
            setErrorMessage("Brak źródeł")
        } else {
            if (sources) {
                setSources(sources)
                setShowSources(true)
            }
        }

        setSearchingMedia(false)
    }

    const handleSetSource = (source) => {
        setShowSources(false)
        setSelectedSource(source)
    }

    const handleCloseSources = () => {
        setSearchingMedia(false)
        setSources(false)
        setPlayerStarted(false)
        setSelectedSource(false)
        setErrorMessage(false)
        setShowSources(false)
    }

    return (
        playerVisibility === "visible"?
            <div className={"player-container " + (show? "show": null)}>
                <div className="backdrop"></div>

                <div className="top-bar">
                    <span>Odtwarzacz</span>
                    <button className="close" onClick={ handleClose }><span className="material-icon">close</span></button>
                </div>
                <div className="player"> 

                    { !playerStarted? <button id="play" onClick={ handleClickPlay }><span className="material-icon">play_arrow</span></button> :null }

                    { searchingMedia
                        ? <div className="loader">
                            <div className="spinner"></div>
                            <span className="message">Szukam źródeł</span>
                          </div>
                        
                        : null
                    }

                    {
                        playerStarted && !searchingMedia && !sources
                        ? <div className="error-message">
                            { errorMessage }
                            <button onClick={ handleClickPlay }>Spróbuj ponownie</button>
                          </div>
                        : null
                    }

                    { sources && showSources
                        ? <div className="sources">
                            <div className="backdrop" onClick={handleCloseSources}></div>
                            <ul>
                                <h2>Wybierz źródło</h2>

                                <button className="close" onClick={handleCloseSources}><span className="material-icon">close</span></button>

                                <li className="header">
                                    <span>Serwis</span>
                                    <span>Jakość</span>
                                    <span>Język</span>
                                </li>
                                {sources.map((source, i)=>(
                                    <li key={i} onClick={()=>handleSetSource(source)}>
                                        <div className="image">
                                            <img src={"/images/" + source.service + ".png"} alt="" />
                                        </div>
                                        
                                        <div>{ source.quality }</div>
                                        <div className="language">{ source.language }</div>
                                    </li>
                                ))}
                            </ul>
                          </div>
                        :null
                    }

                    {
                        selectedSource
                            ? <Replay
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
                            : null
                    }
                </div>
                <div className="bottom-bar">
                    <span className="title">{playerData.title}</span>
                </div>

                <div className="next-videos"></div>
            </div>
        :null
    )
}

export default VideoPlayer