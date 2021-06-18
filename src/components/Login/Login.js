import React, { Component } from "react";

import "./Login.css";
import logo_file from "../../logo.png";

import { Link } from "react-router-dom";

import Form from "react-bootstrap/Form";

import { createMuiTheme, withStyles, makeStyles, ThemeProvider } from '@material-ui/core/styles';

import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

import { Redirect } from "react-router-dom";

import * as session from "../../services/session";
import * as api from "../../services/api";

import CircularProgress from '@material-ui/core/CircularProgress';


function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const AntTab = withStyles(theme => ({
  root: {
    textTransform: 'none',
    fontWeight: theme.typography.fontWeightRegular,
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:hover': {
      color: '#3f51b5',
      opacity: 1,
    },
    '&$selected': {
    },
    '&:focus': {
    },
  },
  selected: {},
}))(props => <Tab disableRipple {...props} />);

const CustomButton = withStyles({
  root: {
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 'bold',
    boxShadow: '0 10px 10px -10px rgba(0,0,0,0.4)',
    textTransform: 'none',
    padding: '12px',
    marginTop: '27px',
    fontFamily: [
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:hover': {
    }
  },
})(Button);


export default class Login extends Component {
    constructor(props) {
        super(props);

        this.initialState = {
            isLoading: false,
            error: null,
            email: "",
            password: "",
            toApp: false,
            toRegister: false,
            snackbarOpen: false,
            snackbarMode: '',
            snackbarMessage: ''
        };
        this.state = this.initialState;
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    goToRegister(event) {
        this.setState(() => ({
            toRegister: true
        }));
    }

    onPressLogin() {
        this.setState({
            isLoading: true,
            error: ""
        });

        session
            .authenticate(this.state.email, this.state.password)
            .then(() => {
                this.setState(() => ({
                    isLoading: false,
                    toApp: true
                }));
            })
            .catch(exception => {
                const error = api.exceptionExtractError(exception);
                this.setState({
                    isLoading: false,
                    ...(error ? { error } : {})
                });
                this.handleSnackbarOpen('error', exception);
            });
    }

    handleSnackbarOpen(snackbar_mode, snackbar_message) {
        this.setState({
            snackbarOpen: true,
            snackbarMode: snackbar_mode,
            snackbarMessage: snackbar_message
        });
    }

    handleSnackbarClose() {
        this.setState({
            snackbarOpen: false
        });
    }


    render() {
        // If toApp state === true
        if (this.state.toApp === true) {
            return <Redirect to="/app" />;
        }

        if (this.state.toRegister === true) {
            return <Redirect to="/register" />;
        }

        return (
            <div className="login">

                <div className="loginBoxContainer">
                    <h1 className="appName">summy</h1>
                    <img className="logoFile" src={logo_file} alt="Logo" />

                    <div className="loginBox">
                        <Paper className="loginBoxContent">

                            <Tabs variant="fullWidth" indicatorColor="primary" textColor="primary" value={1}>
                              <AntTab className="tabs" label="Login" value={1}/>
                              <AntTab className="tabs" label="Register" onClick={event => {this.goToRegister();}} value={2}/>
                            </Tabs>

                            <Form style={{ padding: "28px" }}>
                                <TextField
                                    style={{ marginBottom: "16px" }}
                                    fullWidth
                                    id="email"
                                    label="Email"
                                    type="email"
                                    name="email"
                                    value={this.state.email}
                                    onChange={this.handleChange.bind(this)}
                                />

                                <TextField
                                    style={{ marginBottom: "16px" }}
                                    fullWidth
                                    id="password"
                                    label="Password"
                                    type="password"
                                    name="password"
                                    value={this.state.password}
                                    onChange={this.handleChange.bind(this)}
                                />

                                {/*changed the type property to "submit" instead of "button"*/}

                                <CustomButton
                                    className="loadingButton"
                                    style={{ marginBottom: "16px" }}
                                    fullWidth
                                    variant="contained"
                                    type="button"
                                    color="primary"
                                    onClick={() => this.onPressLogin()}
                                    disabled={this.state.isLoading}
                                >
                                    { this.state.isLoading ? <CircularProgress size={24} color="primary"/> : 'Login' }
                                </CustomButton>

                                {/*<Link to="/register">Register</Link>*/}
                            </Form>
                        </Paper>
                    </div>
                </div>

                <Snackbar open={this.state.snackbarOpen} autoHideDuration={10000} onClose={() => this.handleSnackbarClose()}>
                    <Alert onClose={() => this.handleSnackbarClose()} severity={this.state.snackbarMode}>
                      {this.state.snackbarMessage}
                    </Alert>
                </Snackbar>

            </div>
        );
    }
}
