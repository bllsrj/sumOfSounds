import React, { Component } from 'react';
import Slider from '@material-ui/core/Slider';
import {Button, Divider, Form, Header, Segment} from "semantic-ui-react";

const btnStyle = {
    margin: "1% 4% 0 4%",
};

const speakers = [
    { key: 'en-AU-Wavenet-A', text: 'Australia/Female', value: 'en-AU-Wavenet-A' },
    { key: 'en-AU-Wavenet-D', text: 'Australia/Male', value: 'en-AU-Wavenet-D' },
    { key: 'en-IN-Wavenet-D', text: 'India/Female', value: 'en-IN-Wavenet-D' },
    { key: 'en-IN-Wavenet-B', text: 'India/Male', value: 'en-IN-Wavenet-B' },
    { key: 'en-GB-Wavenet-C', text: 'UK/Female', value: 'en-GB-Wavenet-C' },
    { key: 'en-GB-Wavenet-D', text: 'UK/Male', value: 'en-GB-Wavenet-D' },
    { key: 'en-US-Wavenet-E', text: 'USA/Female', value: 'en-US-Wavenet-E' },
    { key: 'en-US-Wavenet-D', text: 'USA/Male', value: 'en-US-Wavenet-D' },

];

const themes = [
    { key: 'black', text: 'Black', value: 'black' },
    { key: 'grey', text: 'Grey', value: 'grey' },
    { key: 'red', text: 'Red', value: 'red' },
    { key: 'orange', text: 'Orange', value: 'orange' },
    { key: 'yellow', text: 'Yellow', value: 'yellow' },
    { key: 'olive', text: 'Olive', value: 'olive' },
    { key: 'green', text: 'Green', value: 'green' },
    { key: 'teal', text: 'Teal', value: 'teal' },
    { key: 'blue', text: 'Blue', value: 'blue' },
    { key: 'violet', text: 'Violet', value: 'violet' },
    { key: 'purple', text: 'Purple', value: 'purple' },
    { key: 'brown', text: 'Brown', value: 'brown' },
];

const speedMax = 2;
const speedMin = -2;
class AppHome extends Component {

    constructor(props) {
        super(props);
        this.state = {
            audioSpeed: this.props.audioSpeed,
            sliderSpeed: Math.log2(this.props.audioSpeed),
            speaker: this.props.speaker,
            gender: this.props.gender,
            theme: this.props.theme,
        };
    }

    handleSelect = (e, { name, value }) => {
        this.setState({
            [name]: value
        });
    };

    handleChangeSpeed = (event, newValue) => {
        this.setState({
            sliderSpeed: newValue,
            audioSpeed: Math.pow(2, newValue).toFixed(2),
        })
    };

    onClickSave = () => {
        const { audioSpeed, speaker, gender, theme} = this.state;

        this.props.handleChange("audioSpeed", audioSpeed);
        this.props.handleChange("speaker", speaker);
        this.props.handleChange("gender", gender);
        this.props.handleChange("theme", theme);
        this.props.handleChange("isSettingsPage", 0);
    };

    onClickCancel = () => {
        this.props.handleChange("isSettingsPage", 0);
    };

    render() {

        const { audioSpeed, speaker, pitch, theme, sliderSpeed} = this.state;

        return (
            <div>
                <Divider horizontal>
                    <Header className="c9-text-big" color="black"> Settings </Header>
                </Divider>
                <Segment
                    color={theme}
                    style={{marginTop: 10, padding: 25}}
                >
                    <Form>
                        <label>
                            <b>Audio speed: {audioSpeed}</b>
                        </label>
                        <Slider
                            style={{color: theme}}
                            value={sliderSpeed}
                            onChange={this.handleChangeSpeed}
                            max={speedMax}
                            min={speedMin}
                            step={0.1}
                            aria-labelledby="continuous-slider"
                        />

                        <Form.Dropdown fluid selection
                                       name="speaker"
                                       label="Speaker"
                                       options={speakers}
                                       value={speaker}
                                       onChange={this.handleSelect}
                        />

                        {/*<Form.Dropdown fluid selection*/}
                        {/*               name="gender"*/}
                        {/*               label="Gender"*/}
                        {/*               options={genders}*/}
                        {/*               value={gender}*/}
                        {/*               onChange={this.handleSelect}*/}
                        {/*/>*/}

                        <Form.Dropdown fluid selection
                                       name="theme"
                                       label="Theme"
                                       options={themes}
                                       value={theme}
                                       onChange={this.handleSelect}
                        />

                        <Button.Group
                            color={theme}
                            style={{width: "46%"}}
                        >
                            <Button
                                style={btnStyle}
                                fluid
                                size='large'
                                onClick={() => this.onClickCancel()}
                                color={theme}
                            >
                                Cancel
                            </Button>

                            <Button
                                style={btnStyle}
                                fluid
                                size='large'
                                onClick={() => this.onClickSave()}
                                color={theme}
                            >
                                Save
                            </Button>
                        </Button.Group>
                    </Form>

                </Segment>
            </div>
        );
    }
}

export default AppHome;