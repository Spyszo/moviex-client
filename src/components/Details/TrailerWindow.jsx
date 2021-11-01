import './TrailerWindow.scss'

import React from 'react'
import YouTube from 'react-youtube';

class TrailerWindow extends React.Component {

    constructor (props) {
        super(props)

        this.state = {
            paused: false,
            player: {}
        }
        this.videoId = props.videoId

        this._onReady = this._onReady.bind(this)
    }

    //?autoplay=1&mute=1&controls=0&disablekb=1&showinfo=0&autohide=1&modestbranding=1&rel=0&loop=1&playlist=

    render() {
        const opts = {
            playerVars: {
                autoplay: 1,
            },
        }

        return (
            <div className="trailerWindow">
                <div className="background" onClick={this.props.close}></div>
                <div className="trailer">
                    <YouTube videoId={this.videoId} opts={opts} onReady={this._onReady} />
                </div>
            </div>
        )
    }


    _onReady(event) {
        // access to player in all event handlers via event.target
        //event.target.pauseVideo();
        event.target.setVolume(50)
        this.setState({...this.state, player: event.target})
    }
}

export default TrailerWindow