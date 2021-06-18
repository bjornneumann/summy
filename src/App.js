import React, { Component } from "react";
//import logo from "./logo.svg";
import "./App.css";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect
} from "react-router-dom";

import { Provider } from "react-redux";
import store from "./store";
import * as session from "./services/session";

import Main from "./components/Main/Main.js";
import Register from "./components/Register/Register.js";
import Login from "./components/Login/Login.js";

// API Url -> http://54.93.246.254/web/api/

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            signedIn: false,
            checkedSignIn: false
        };
    }

    componentDidMount() {
        // Waits for the redux store to be populated with the previously saved state,
        // then it will try to auto-login the user.
        const unsubscribe = store.subscribe(() => {
            //console.log(store.getState()); // REMOVE
            if (store.getState().services.persist.isHydrated) {
                unsubscribe();
                this.autoLogin();
            }
        });
    }

    autoLogin() {
        session
            .refreshToken()
            .then(() => {
                this.setState({ signedIn: true, checkedSignIn: true });
            })
            .catch(() => {
                this.setState({ signedIn: false, checkedSignIn: true });
            });
    }

    renderContent() {
        const { checkedSignIn, signedIn } = this.state;

        // If we haven't checked AsyncStorage yet, don't render anything
        if (!checkedSignIn) {
            return null;
        }

        return (
            <Router>
                {signedIn ? <Redirect to="/app" /> : <Redirect to="/login" />}

                <div>
                    <Switch>
                        <Route path="/login">
                            <Login />
                        </Route>
                        <Route path="/register">
                            <Register />
                        </Route>
                        <Route path="/app">
                            <Main />
                        </Route>
                    </Switch>
                </div>
            </Router>
        );
    }

    render() {
        return <Provider store={store}>{this.renderContent()}</Provider>;
    }
}

export default App;
