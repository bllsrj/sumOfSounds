import React, { Component } from 'react';
import {Button, Menu, Header} from 'semantic-ui-react';

export default class PageHeader extends Component {

    constructor(props) {
        super(props);

        this.state = {
            theme: this.props.theme,
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.theme !== this.state.theme) {
            this.setState({ theme: nextProps.theme });
        }
    }

    render() {

        const theme = this.state.theme;

        return (
            <Menu color={theme} widths={2} size="massive" classname="min-width-480" borderless>

                <Menu.Item/>

                <Menu.Item>
                    <Header
                        className="header-text"
                        color={theme}
                    >
                        Sum of Sounds
                    </Header>
                </Menu.Item>

                <Menu.Item >
                    <Button
                        style={{marginRight: '25%'}}
                        icon='setting'
                        color={theme}
                        size="tiny"
                        onClick={ () => this.props.handleChange("isSettingsPage", 1)}
                    />
                </Menu.Item>
            </Menu>
        )
    }
}