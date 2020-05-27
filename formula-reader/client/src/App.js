import React from 'react';
import './_all.css';
import MainPage from './Pages/MainPage'
import AppHome from './Pages/AppHome'

import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";

export default class App extends React.Component {

    state = {
        theme: 'blue',
    };


    render() {

        const theme = this.state.theme;

        return (
            <Router>
                <Switch>
                    <Route exact path="/">
                        <MainPage />
                    </Route>
                    <Route path="/app">
                        <AppHome theme={theme}/>
                    </Route>
                </Switch>
            </Router>
        );

    }
}