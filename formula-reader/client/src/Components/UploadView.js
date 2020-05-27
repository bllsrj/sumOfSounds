import React from 'react';

import {
    Segment, Button, Input, Message, Icon, Form
} from 'semantic-ui-react'

export default class UploadView extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            theme: this.props.theme,
            selectedFile: null,
            type: null,
            OKType: 2,
            pageNo: 1,
        };

        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.onClickHandler = this.onClickHandler.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleInputChange = (e, { name, value }) => {
        this.setState({
            [name]: value
        });
    };

    onChangeHandler = event => {

        if(event.target.files.length > 0) {
            let type = event.target.files[0].type;
            if (event.target.files[0].name.substr(event.target.files[0].name.length - 3) === "tex") {
                type = "tex";
            }

            this.setState({
                selectedFile: event.target.files[0],
                loaded: 0,
                type: type,
                OKType: type === "application/pdf" | type === "image/jpeg" | type === "image/png" | type === "tex"
            });
        }
    };

    onClickHandler = () => {
        const file = this.state.selectedFile;
        const data = new FormData();
        data.append('file', file);
        this.props.handleChange("uploadStatus", "work");
        this.props.handleChange("inputType", this.state.type);
        this.props.handleChange("dataFile", data);
        this.props.handleChange("fileName", file.name);
        this.props.handleChange("pageNo", this.state.pageNo);
        this.props.handleChange("status", null);
    };

    render(){

        const {type, OKType, theme, pageNo } = this.state;

        return (

            <Segment basic>

                {OKType === 0 ?
                    <Message
                        style={{width: "95%",  margin: "0 1% 3% 2%"}}
                        negative
                    >
                        <Icon name='stop circle' />
                        "{type}" is not supported. Please upload only pdf, jpeg, png or tex files.
                    </Message>
                    :
                    <Message
                        style={{margin: "0 1% 3% 1%"}}
                        color={theme}
                    >
                        <Icon name='help' />
                        The following file types are supported: pdf, jpeg, png, tex.
                    </Message>
                }

                <Form size='large' style={{margin: "1%"}}>
                    <Form.Group widths="equal">
                        <Form.Input
                            style={{height: 120}}
                            type="file"
                            name="file"
                            size="medium"
                            color={theme}
                            onChange={this.onChangeHandler}
                        />
                    </Form.Group>
                </Form>

                {type === "application/pdf" ?
                    <Input style={{width: "33%", margin: "1%"}}
                           type="number"
                           size="medium"
                           placeholder='Page number'
                           value={pageNo}
                           name="pageNo"
                           onChange={this.handleInputChange}
                           color={theme}
                    />

                    : null
                }

                <Button
                    style={{margin: "1%", width: "50%"}}
                    icon="upload"
                    label='Upload'
                    disabled={OKType !== 1 || pageNo === null || pageNo < 1}
                    color={theme}
                    onClick={ this.onClickHandler }
                />
            </Segment>
        )
    }
}