import AudioPlayer from 'react-h5-audio-player';
import '../player.scss';
import React from 'react';
import colors from "./../Assets/colors"
import env from "./../Assets/env"

import {
    Segment, Button, Divider, Header
} from 'semantic-ui-react'

export default class Player extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            theme: this.props.theme,
            audio: this.props.audio,
        };

        document.documentElement.style.setProperty('--rhap_theme-color', colors[this.props.theme]);
        document.documentElement.style.setProperty('--rhap_bar-color', colors[this.props.theme]);
        document.documentElement.style.setProperty('--rhap_time-color', colors[this.props.theme]);

        console.log(colors[this.state.color]);

        this.onClickHandler = this.onClickHandler.bind(this);
    }


    onClickHandler = () => {
        window.open("http://" + env["url"] + "/download", "_blank");
    };

    render(){

        const {theme, audio} = this.state;

        return (
            <div>
                <AudioPlayer
                    style={{height: 110, padding: 18}}
                    autoPlay
                    src={audio}
                    color={theme}
                />

                <Button
                    style={{"margin-top":"15px"}}
                    color={theme}
                    content='Download'
                    icon='download'
                    onClick={this.onClickHandler}
                    label={{ basic: true, color: 'white', pointing: 'left', content: 'output.mp3' }}
                />
            </div>
        )
    }
}