import React, { Component } from "react";
import * as session from "../../services/session";
import * as api from "../../services/api";
import * as notesApi from "../../data/notes/api";
import "./Main.css";

import { Redirect } from "react-router-dom";

import Form from "react-bootstrap/Form";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import NotesIcon from "@material-ui/icons/Notes";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Paper from "@material-ui/core/Paper";

import update from "react-addons-update";

import Iframe from "react-iframe";
import Link from "@material-ui/core/Link";

import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';




export default class Main extends Component {
    constructor(props) {
        super(props);

        this.initialState = {
            toLogin: false,
            editMode: "post",
            notes: [],
            active_note: {
                note_id: undefined,
                article_link: "",
                title: "",
                tags: "",
                note_sections: [
                    {
                        title: "",
                        content: ""
                    }/*,
                    {
                        title: "",
                        content: ""
                    },
                    {
                        title: "",
                        content: ""
                    },
                    {
                        title: "",
                        content: ""
                    }*/
                ]
            },
            numNoteSectionChildren: 0
        };
        this.state = this.initialState;
    }

    componentDidMount() {
        notesApi
            .get()
            .then(response => {
                this.setState(() => ({
                    notes: response.notes
                }));
            })
            .catch(exception => {
                // Displays only the first error message
                const error = api.exceptionExtractError(exception);

                {/*this state should be included in the Redux storage eventually, so that the entire storage is centralized and may be used in various different files*/}

                const newState = {
                    isLoading: false,
                    ...(error ? { error } : {})
                };
                this.setState(newState);
            });
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            active_note: {
                ...this.state.active_note,
                [name]: value
            }
        });
    }

    handleSectionChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        const id = parseInt(target.id.slice(9));

        this.setState({
            active_note: {
                ...this.state.active_note,
                note_sections: update(this.state.active_note.note_sections, {
                    [id]: { [name]: { $set: value } }
                })
            }
        });
    }

    onPressLogout() {
        session
            .revoke()
            .then(() => {
                this.setState(() => ({
                    toLogin: true
                }));
            })
            .catch(exception => {
                // Displays only the first error message
                const error = api.exceptionExtractError(exception);
                this.setState({
                    isLoading: false,
                    ...(error ? { error } : {})
                });
            });
    }

    onDeleteNote(note_id) {
        notesApi.remove({ note_id }).then(response => {
            notesApi.get().then(response => {
                this.setState(() => ({
                    notes: response.notes
                }));
            });
            alert("The note has been deleted.");
        });
    }

    onEditNote(note) {

        let actual_note_sections = [];

        for (let i = note.note_sections.length; i-- > 0; ) {
          if (note.note_sections[i].title.length !== 0 && note.note_sections[i].content.length !== 0) {
              actual_note_sections.push(note.note_sections[i]);
          }
        }

        note.note_sections = actual_note_sections;

        this.setState({
            active_note: note,
            editMode: "patch"
        });
    }

    onReadNote(note) {
        this.setState({
            active_note: note,
            editMode: "read"
        });
    }

    onGoToPostMode(note) {
        this.setState({
            active_note: this.initialState.active_note,
            editMode: "post"
        });
    }

    onPressPostNote(patch = false) {
        if (this.state.editMode === "patch") {
            patch = true;
        }

        const { active_note } = this.state;
        const note = active_note;

        if (patch === true) {
            var apiCall = notesApi.patch;
        } else {
            var apiCall = notesApi.post;
        }

        apiCall({ note })
            .then(response => {
                window.scrollTo(0, 0);

                if (patch) {
                    alert("You've successfully edited the note!");
                } else {
                    alert("You've successfully posted a new note!");
                }

                notesApi.get().then(response => {
                    this.setState(() => ({
                        notes: response.notes,
                        active_note: { ...this.initialState.active_note },
                        editMode: "post"
                    }));
                });
            })
            .catch(exception => {
                // Displays only the first error message
                const error = api.exceptionExtractError(exception);

                const newState = {
                    isLoading: false,
                    ...(error ? { error } : {})
                };
                this.setState(newState);
            });
    }

    onAddNoteSection() {

        if(this.state.active_note.note_sections.length >= 4) {
            alert("Be concise! There's a limit of 4 note sections to make you be more concise with your content.")
            return;
        }

        let newNoteSection = {
            title: '',
            content: ''
        }
        /*
        let currentNoteSections = this.state.active_note.note_sections;
        let newNoteSections = currentNoteSections.push(newNoteSection)
        */


        const newState = {
            active_note: {
                ...this.state.active_note,
                note_sections: [
                    ...this.state.active_note.note_sections,
                    newNoteSection
                ]
            }
        };
        this.setState(newState);

    }

    render() {
        // If toApp state === true
        if (this.state.toLogin === true) {
            return <Redirect to="/login" />;
        }

        const noteItems = this.state.notes.map(note => (
            <ListItem key={note.note_id}>
                <ListItemAvatar
                    onClick={() => this.onReadNote(note)}
                    style={{ cursor: "pointer" }}
                >
                    <Avatar>
                        <NotesIcon />
                    </Avatar>
                </ListItemAvatar>
                <ListItemText primary={note.title} secondary={note.last_date} />
                <Button
                    color="secondary"
                    onClick={() => this.onDeleteNote(note.note_id)}
                >
                    Delete
                </Button>
                <Button color="primary" onClick={() => this.onEditNote(note)}>
                    Edit
                </Button>
            </ListItem>
        ));

        return (
            <div className="mainContainer">
                <AppBar position="static">
                    <Toolbar>
                        <Typography className="appTitle" variant="h5">summy</Typography>
                        <Button
                            style={{ marginRight: "16px", marginLeft: "auto" }}
                            color="inherit"
                            onClick={() => this.onPressLogout()}
                        >
                            Logout
                        </Button>
                    </Toolbar>
                </AppBar>

                <Container maxWidth="lg">
                    <Grid container spacing={3} style={{ marginTop: "30px" }}>
                        <Grid
                            item
                            xs={12}
                            sm={6}
                            style={
                                this.state.editMode === "patch" ||
                                (this.state.editMode === "post" &&
                                    this.state.active_note.article_link
                                        .length >= 10)
                                    ? {}
                                    : { display: "none" }
                            }
                        >
                            <Paper className="iFramePaper">
                                <Iframe
                                    url={this.state.active_note.article_link}
                                    width="100%"
                                    height="100%"
                                    display="initial"
                                    position="relative"
                                />
                            </Paper>
                        </Grid>

                        <Grid
                            item
                            xs={12}
                            sm={6}
                            style={
                                this.state.editMode === "patch" ||
                                (this.state.editMode === "post" &&
                                    this.state.active_note.article_link
                                        .length >= 10)
                                    ? { display: "none" }
                                    : {}
                            }
                        >
                            {this.props.children}

                            <div>
                                <h3>Current notes</h3>

                                <List>{noteItems}</List>
                            </div>
                        </Grid>

                        <Grid
                            item
                            xs={12}
                            sm={6}
                            style={
                                this.state.editMode === "read"
                                    ? { display: "none" }
                                    : {}
                            }
                        >
                            <h3>
                                {this.state.editMode === "post"
                                    ? "Add New Note"
                                    : "Edit Note"}

                                <Button
                                    className="backButton"
                                    variant="contained"
                                    color="default"
                                    type="button"
                                    style={
                                        this.state.editMode === "patch" ||
                                        (this.state.editMode === "post" &&
                                            this.state.active_note.article_link
                                                .length >= 10)
                                            ? {}
                                            : { display: "none" }
                                    }
                                    onClick={() => this.onGoToPostMode()}
                                >
                                    Go back
                                </Button>
                            </h3>

                            <Form noValidate autoComplete="off">
                                <TextField
                                    fullWidth
                                    id="filled-basic"
                                    label="Article Link"
                                    variant="filled"
                                    type="text"
                                    name="article_link"
                                    value={this.state.active_note.article_link}
                                    onChange={this.handleInputChange.bind(this)}
                                />
                                <TextField
                                    fullWidth
                                    id="filled-basic"
                                    label="Title"
                                    variant="filled"
                                    type="text"
                                    name="title"
                                    value={this.state.active_note.title}
                                    onChange={this.handleInputChange.bind(this)}
                                />
                                {/*
                                <TextField
                                    fullWidth
                                    id="filled-basic"
                                    label="Tags"
                                    variant="filled"
                                    type="text"
                                    name="tags"
                                    value={this.state.active_note.tags}
                                    onChange={this.handleInputChange.bind(this)}
                                />
                                */}

                                <NoteSections
                                    noteSections={
                                        this.state.active_note.note_sections
                                    }
                                    onNoteSectionChange={this.handleSectionChange.bind(
                                        this
                                    )}
                                    noteMode={this.state.editMode}
                                    addNoteSection={this.onAddNoteSection.bind(this)}
                                ></NoteSections>

                                <Button
                                    variant="contained"
                                    style={{'float': 'right'}}
                                    color="primary"
                                    type="button"
                                    onClick={() => this.onPressPostNote()}
                                >
                                    {this.state.editMode === "post"
                                        ? "Add Note"
                                        : "Edit Note"}
                                </Button>
                            </Form>
                        </Grid>

                        <Grid
                            item
                            xs={12}
                            sm={6}
                            style={
                                this.state.editMode === "read"
                                    ? {}
                                    : { display: "none" }
                            }
                        >
                            <h3>{this.state.active_note.title}</h3>
                            <Link
                                className="articleLink"
                                component="button"
                                onClick={() => {
                                    window.open(
                                        this.state.active_note.article_link
                                    );
                                }}
                            >
                                Go to article
                            </Link>
                            {/*
                            <h5>
                                {this.state.active_note.tags}
                            </h5>
                            */}

                            <NoteSections
                                noteSections={
                                    this.state.active_note.note_sections
                                }
                                onNoteSectionChange={this.handleSectionChange.bind(
                                    this
                                )}
                                noteMode={this.state.editMode}
                                addNoteSection={this.onAddNoteSection.bind(this)}
                            ></NoteSections>

                        </Grid>
                    </Grid>
                </Container>
            </div>
        );
    }
}

function NoteSections(props) {
    return (
        <div>

            <div style={props.noteMode === "read" ? { display: "none" } : {}}>

                <h4 className="noteSectionsTitle">Note Sections
                    <Fab onClick={props.addNoteSection} color="primary" aria-label="add" style={{marginLeft: '36px', width: '36px', height: '36px'}}>
                        <AddIcon/>
                    </Fab>
                </h4>

                {props.noteSections.map((noteSection, index) => 
                    <NoteSection 
                        id={index} 
                        key={index}
                        onNoteSectionChange={props.onNoteSectionChange} 
                        title={noteSection.title}
                        content={noteSection.content} />
                )}

            </div>


            <div style={props.noteMode === "read" ? {} : { display: "none" }}>


                {props.noteSections.map((noteSection, index) => 
                    <PaperNoteSection 
                        key={index}
                        title={noteSection.title}
                        content={noteSection.content} />
                )}

            </div>
        </div>
    );
}


function NoteSection(props) {
    return (
        <div className="noteSection">
            <TextField
                fullWidth
                id={'section_t' + props.id}
                label="Section Title"
                variant="filled"
                type="text"
                name="title"
                value={props.title}
                onChange={props.onNoteSectionChange}
            />

            <TextField
              name="content"
              id={'section_c' + props.id}
              fullWidth
              label="Section Content"
              multiline
              rows="5"
              value={props.content}
              onChange={props.onNoteSectionChange}
              variant="filled"
            />
        </div>       
    );
}



function PaperNoteSection(props) {
    return (
        <Paper
            className="paperNote"
            style={
                props.title.length === 0 ||
                props.content.length === 0
                    ? { display: "none" }
                    : {}
            }
        >
            <h3>{props.title}</h3>
            <p>{props.content}</p>
        </Paper>        
    );
}
