import React, { Component } from 'react';
import {Button, Dimmer, Divider, Grid, Header, Icon, Image, Loader, Menu, Message, Segment} from "semantic-ui-react";
import UploadView from "../Components/UploadView";
import TextView from "../Components/TextView";
import Player from "../Components/Player";
import Settings from "../Components/Settings";
import PageHeader from "../Components/Header";
import axios from 'axios';

import env from "./../Assets/env"

class AppHome extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataFile: null,
            activeItem: 'upload',
            uploadStatus: 'none',
            theme: this.props.theme,
            isSettingsPage: 0,
            audioSpeed: 1.0,
            speaker: 'en-US-Standard-B',
            gender: 'FEMALE',
            fileName: null,
            pageNo: null,
            inputType: null,
            text: null,
            audio: null,
        };
    }

    handleChange = (param, childData) => {
        this.setState({[param]: childData})
    };

    async generate() {
        // Call our fetch function below once the component mounts
        this.setState({
            uploadStatus: "generate",
        });

        if(this.state.inputType !== "text") {
            await axios.post("http://" + env.url + "/upload", this.state.dataFile, {})
                .then(res => { // then print response status
                    console.log(res.statusText)
                });
        }

        this.callBackendAPI()
            .then(res =>
                this.setState({
                    outputText: res.text,
                    status: res.status,
                    uploadStatus: "done",
                }))
            .catch(err => console.log(err));
    }

    callBackendAPI = async () => {
        const { inputType, text, pageNo, gender, speaker, audioSpeed, fileName } = this.state;

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                inputType: inputType,
                inputString: text,
                pageNo: pageNo,
                audioSpeed: audioSpeed,
                fileName: fileName,
                speaker: speaker,
                gender: gender,
            })
        };

        const response = await fetch('/api/generate', requestOptions);
        const body = await response.json();

        if (response.status !== 200) {
            throw Error(body.message)
        }
        
        const res = await fetch("/output.mp3");

        this.setState({
            audio: res.url
        });

        return body;
    };

    handleItemClick = (e, { value }) => this.setState({ activeItem: value });

    render() {

        const { activeItem, uploadStatus, theme, isSettingsPage, gender, audioSpeed, speaker, audio, status } = this.state;

        return (
            <div>
                <PageHeader theme={theme} handleChange={this.handleChange} />

                <Grid columns='equal'>

                    <Grid.Column width={4}/>

                    <Grid.Column width={8}>

                        {isSettingsPage ?
                            <Settings theme={theme} handleChange={this.handleChange} gender={gender} audioSpeed={audioSpeed} speaker={speaker}/>
                            :
                            <div>
                                <Segment basic>
                                    <div>
                                        <Divider horizontal>
                                            <Header className="c9-text-big" color="black" >Upload Method</Header>
                                        </Divider>

                                        <Menu attached='top' tabular color={theme}>
                                            <Menu.Item
                                                name='Upload Document'
                                                value='upload'
                                                active={activeItem === 'upload'}
                                                onClick={this.handleItemClick}
                                                color={theme}
                                            />
                                            <Menu.Item
                                                name='Enter Text'
                                                value='text'
                                                active={activeItem === 'text'}
                                                onClick={this.handleItemClick}
                                                color={theme}
                                            />
                                        </Menu>

                                        <Segment attached="bottom" color={theme}>
                                            {activeItem === 'upload' ? <UploadView handleChange={this.handleChange} theme={theme}/> :
                                                <TextView handleChange={this.handleChange} theme={theme}/>}
                                        </Segment>
                                    </div>
                                </Segment>

                                <Segment basic color={theme} style={{marginBottom: 125}}>

                                    {uploadStatus !== 'none' ?
                                        <Divider horizontal>
                                            <Header className="c9-text-big" color="black"> Play </Header>
                                        </Divider>
                                        : null}

                                    {uploadStatus === 'generate' ?
                                        <Segment color={theme}>
                                            <Dimmer active inverted>
                                                <Loader inverted>Generating an audio file</Loader>
                                            </Dimmer>

                                            <Image src='https://react.semantic-ui.com/images/wireframe/short-paragraph.png'/>
                                        </Segment>
                                        : null}

                                    {uploadStatus === 'work' ?
                                        <Button
                                            style={{marginLeft: "1%", marginRight: "25%", width: 250}}
                                            icon="file audio"
                                            label='Generate Audio'
                                            color={theme}
                                            onClick={ () => this.generate() }
                                        />
                                        : null
                                    }

                                    {status === "Error" ?
                                        <Message
                                            style={{width: "95%",  margin: "3% 2% 3% 2%"}}
                                            negative
                                        >
                                            <Icon name='stop circle' />
                                            The application could not read the file. Try it again.
                                        </Message>
                                        : null }

                                    {status === "Good" ?
                                        <Message
                                            style={{width: "95%",  margin: "3% 2% 3% 2%"}}
                                            color={theme}
                                        >
                                            <Icon name='help' />
                                            The audio file successfully generated.
                                        </Message>
                                        : null
                                    }

                                    {uploadStatus === 'done' && status === "Good" ? <Player theme={theme} audio={audio}/> : null}
                                </Segment>
                            </div>
                        }

                    </Grid.Column>

                    <Grid.Column width={4}/>
                </Grid>
            </div>
        );
    }
}

export default AppHome;