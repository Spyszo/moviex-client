import "./EmbedTrailer.scss"

import React from 'react'
import YouTube from 'react-youtube';
import TrailerWindow from './TrailerWindow';

class EmbedTrailer extends React.Component {

    constructor (props) {
        super(props)

        this.state = {
            paused: false,
            volume: 0,
            player: {},
            showTrailerWindow: false
        }
        this.videoId = props.videoId

        this._onReady = this._onReady.bind(this)
        this.handleChangeVolume = this.handleChangeVolume.bind(this)
        this.handleShowTrailerWindow = this.handleShowTrailerWindow.bind(this)
        this.handleHideTrailerWindow = this.handleHideTrailerWindow.bind(this)
    }

    //?autoplay=1&mute=1&controls=0&disablekb=1&showinfo=0&autohide=1&modestbranding=1&rel=0&loop=1&playlist=

    handleShowTrailerWindow (e) {
        if (e.target.id === 'volumeControl' || e.target.id === 'volumeControl-input' || e.target.id === 'volumeControl-icon') return
        this.state.player.pauseVideo()
        this.setState({...this.state, showTrailerWindow: true})
    }

    handleHideTrailerWindow () {
        this.state.player.playVideo()
        this.setState({...this.state, showTrailerWindow: false})
    }

    render() {
        const opts = {
            playerVars: {
                // https://developers.google.com/youtube/player_parameters
                autoplay: 1,
                mute: 1,
                controls: 0,
                rel:0,
                loop: 1,
                playlist: this.props.videoId,
                autohide: 1,
            },
        }

        return (
            window.innerWidth >= 820?<>
            <div onClick={this.handleShowTrailerWindow} className="embedTrailer">
                <YouTube videoId={this.videoId} opts={opts} onReady={this._onReady} />
                <div id="volumeControl" className="volumeControl">
                    <span id="volumeControl-icon" className="material-icon" onClick={this.handleChangeVolume}>{this.state.volume > 1? "volume_up": "volume_off"}</span>
                    <input id="volumeControl-input" type="range" min="0" value={this.state.volume} max="100" onChange={this.handleChangeVolume}/>
                </div>
            </div>

            {
                this.state.showTrailerWindow ? <TrailerWindow videoId={this.props.videoId} close={this.handleHideTrailerWindow}/> :null
            }
            
            </>
            :null
        )
    }

    handleChangeVolume (event) {
        if (event.target.value === undefined) {
            if (this.state.player.isMuted()) {
                this.state.player.unMute()
                this.setState({volume: 25})
            } else {
                this.state.player.mute()
                this.setState({volume: 0})
            }
        } else {
            const volume = (event.target.value)
            this.setState({volume})
            this.state.player.setVolume(volume)
            if (volume < 2) {
                this.state.player.mute()
            } else {
                this.state.player.unMute()
            }
        }
    }

    _onReady(event) {
        // access to player in all event handlers via event.target
        //event.target.pauseVideo();
        event.target.setVolume(50)
        this.setState({...this.state, player: event.target})
    }
}

export default EmbedTrailer