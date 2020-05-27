import React from 'react';

import {
    Segment, Button, Message, Icon, Form
} from 'semantic-ui-react'

export default class TextView extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            text: "",
            theme: this.props.theme,
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.onClickHandler = this.onClickHandler.bind(this);
    }

    handleInputChange = (e, { name, value }) => {
        this.setState({
            [name]: value
        });
    };

    onClickHandler = () => {
        this.props.handleChange("uploadStatus", "work");
        this.props.handleChange("inputType", "text");
        this.props.handleChange("text", this.state.text);
        this.props.handleChange("status", null);
    };

    render(){

        const { text, theme } = this.state;

        return (

            <Segment basic>

                <Message
                    style={{margin: "0 1% 3% 1%"}}
                    color={theme}
                >
                    <Icon name='help' />
                    Copy and paste the LaTeX string to the text bar.
                </Message>

                <Form size='large' style={{margin: "1%"}}>
                    <Form.Group widths="equal">
                        <Form.TextArea
                            fluid
                            style={{color: "#1F83AB"}}
                            name = "text"
                            label = "LaTeX string"
                            value={text}
                            color={theme}
                            onChange={this.handleInputChange}
                        />
                    </Form.Group>
                </Form>

                <Button
                    style={{margin: "1%", width: "50%"}}
                    icon="arrow alternate circle up"
                    label='Submit'
                    color={theme}
                    onClick={ this.onClickHandler }
                />
            </Segment>
        )
    }
}