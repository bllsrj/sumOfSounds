import React, { Component } from 'react';
import {Button, Dimmer, Divider, Grid, Header, Icon, Image, Loader, Menu, Message, Segment} from "semantic-ui-react";
import UploadView from "../Components/UploadView";
import TextView from "../Components/TextView";
import Player from "../Components/Player";
import Settings from "../Components/Settings";
import PageHeader from "../Components/Header";
import axios from 'axios';

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
            speaker: 'en-US-Wavenet-E',
            gender: 'FEMALE',
            fileName: null,
            pageNo: null,
            inputType: null,
            text: null,
            audio: null,
            statusText: ""
        };
    }

    handleChange = (param, childData) => {
        this.setState({[param]: childData})
    };

    async generate() {

        const { inputType, text, pageNo, gender, speaker, audioSpeed, fileName } = this.state;

        this.setState({
            uploadStatus: "generate",
        });

        if(this.state.inputType !== "text") {
            await axios.post("/upload", this.state.dataFile, {})
                .then(res => {
                    console.log("Uploaded");
                    console.log(res);
                });
        }

        try {
            const requestOptions = {
                inputType: inputType,
                inputString: text,
                pageNo: pageNo,
                audioSpeed: audioSpeed,
                fileName: fileName,
                speaker: speaker,
                gender: gender,
            };

            await axios.post("/api/generate", requestOptions, {})
                .then(async res => {

                    console.log(res);

                    await axios.post('/output', {file: "output.mp3"},{responseType:'blob'})
                        .then(out => {

                        const url = window.URL.createObjectURL(new Blob([out.data]));
                        console.log(out);
                        console.log(url);
                        this.setState({
                            audio: url,
                            outputText: res.data.text,
                            status: res.data.msg,
                            statusText: res.data.msgText,
                            uploadStatus: "done",
                        });
                    });
                });
        } catch (error) {
            this.setState({
                outputText: null,
                status: "Error",
                statusText: "Unexpected error while generating!",
                uploadStatus: "done",
            });
        }
    }

    handleItemClick = (e, { value }) => this.setState({ activeItem: value });

    render() {

        const { activeItem, uploadStatus, theme, isSettingsPage, gender, audioSpeed, speaker, audio, status, statusText } = this.state;

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

                                <Segment basic color={theme} style={{marginBottom: 40}}>

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
                                            {statusText}
                                        </Message>
                                        : null }

                                    {status === "Good" ?
                                        <Message
                                            style={{width: "95%",  margin: "3% 2% 3% 2%"}}
                                            color={theme}
                                        >
                                            <Icon name='help' />
                                            {statusText}
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