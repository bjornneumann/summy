import React, { Component } from "react";

import "./Register.css";
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

import * as usersApi from "../../data/users/api";
//import * as session from "../../services/session"; /* not actually used in this file */
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

export default class Register extends Component {
    constructor(props) {
        super(props);

        this.initialState = {
            isLoading: false,
            error: null,
            email: "",
            password: "",
            toApp: false,
            toLogin: false,
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

    goToLogin(event) {
        this.setState(() => ({
            toLogin: true
        }));
    }

    onPressRegister() {
        this.setState({
            isLoading: true,
            error: ""
        });

        const { email, password } = this.state;
        const user = {
            email,
            password,
            registration_source: "web",
            emails_allowed: true,
            locale: "en" // change later
        };

        usersApi
            .create({ user })
            .then(() => {
                this.setState({
                    isLoading: false,
                    email: '',
                    password: ''
                });
                this.handleSnackbarOpen('success', 'Please check your emails to confirm your registration!');
            })
            .catch(exception => {
                // Displays only the first error message
                const error = api.exceptionExtractError(exception);

                const newState = {
                    isLoading: false,
                    ...(error ? { error } : {})
                };
                this.setState(newState);
                this.handleSnackbarOpen('error', 'There was an error while registering!');
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

        if (this.state.toLogin === true) {
            return <Redirect to="/login" />;
        }

        return (
            <div className="register">

                <div className="registerBoxContainer">
                    <h1 className="appName">summy</h1>
                    <img className="logoFile" src={logo_file} alt="Logo" />

                    <div className="registerBox">
                        <Paper className="registerBoxContent">

                            <Tabs variant="fullWidth" indicatorColor="primary" textColor="primary" value={2}>
                              <AntTab className="tabs" label="Login" onClick={event => {this.goToLogin();}} value={1}/>
                              <AntTab className="tabs" label="Register" value={2}/>
                            </Tabs>

                            <Form style={{ padding: "28px", color: "#607D8B" }}>
                                <TextField
                                    style={{ marginBottom: "16px" }}
                                    fullWidth
                                    id="filled-basic"
                                    label="Email"
                                    type="email"
                                    name="email"
                                    value={this.state.email}
                                    onChange={this.handleChange.bind(this)}
                                />

                                <p style={{ marginBottom: "16px" }}>
                                    We'll never share your email with anyone else.
                                </p>

                                <TextField
                                    style={{ marginBottom: "16px" }}
                                    fullWidth
                                    id="filled-basic"
                                    label="Password"
                                    type="password"
                                    name="password"
                                    value={this.state.password}
                                    onChange={this.handleChange.bind(this)}
                                />

                                <CustomButton
                                    className="loadingButton"
                                    style={{ marginBottom: "16px" }}
                                    fullWidth
                                    variant="contained"
                                    type="button"
                                    color="primary"
                                    onClick={() => this.onPressRegister()}
                                    disabled={this.state.isLoading}
                                >
                                    { this.state.isLoading ? <CircularProgress size={24} color="primary"/> : 'Register' }
                                </CustomButton>

                                {/*<Link to="/login">Go to Login</Link>*/}
                            </Form>
                        </Paper>
                    </div>
                </div>

                <Snackbar open={this.state.snackbarOpen} autoHideDuration={20000} onClose={() => this.handleSnackbarClose()}>
                    <Alert onClose={() => this.handleSnackbarClose()} severity={this.state.snackbarMode}>
                      {this.state.snackbarMessage}
                    </Alert>
                </Snackbar>

            </div>
        );
    }
}
