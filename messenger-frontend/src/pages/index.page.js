import React from "react";
import Slide from "@mui/material/Slide";
import Paper from "@mui/material/Paper";
import { makeStyles } from "@mui/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Switch, Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { withRouter } from "react-router";

//  COMPONENTS
import Navigation from "../components/navigation/index.component";
import TopNavigation from "../components/topnavigation/index.component";
import Snackbar from "../components/snackbar/index.component";

//  PAGES
import SignUp from "../pages/signUp/index.page";
import SignIn from "../pages/signIn/index.page";
import Conversations from "../pages/conversations/index.page";
import Messages from "../pages/messages/index.page";
import Contacts from "../pages/contacts/index.page";
import Settings from "../pages/settings/index.page";
import NotFound from "../pages/notfound/index.page";

//  STYLES
const useStyles = makeStyles((theme) => ({
  root: {
    padding: 0,
    height: "100vh",
    minHeight: "612px",
    maxWidth: "424px",
    margin: "0 auto",
    background: theme.palette.background.default + " !important",
  },
}));

//  COMPONENT
const Pages = ({ snackbars, brightness, isLoggedIn }) => {
  const classes = useStyles();

  return (
    <React.Fragment>
      <CssBaseline />
      <Slide direction="down" in={true} mountOnEnter>
        <Paper className={classes.root} square={true} elevation={0}>
          <Snackbar snackbars={snackbars} />
          <Navigation />

          {isLoggedIn ? <TopNavigation /> : undefined}
          <Switch>
            <Route
              exact
              path="/sign-up"
              render={() => (isLoggedIn ? <Redirect to="/" /> : <SignUp />)}
            />
            <Route
              exact
              path="/"
              render={() => (isLoggedIn ? <Conversations /> : <SignIn />)}
            />

            <Route
              exact
              path="/messages/:conversationId"
              render={() => (isLoggedIn ? <Messages /> : <Redirect to="/" />)}
            />

            <Route
              exact
              path="/contacts"
              render={() => (isLoggedIn ? <Contacts /> : <Redirect to="/" />)}
            />

            <Route
              exact
              path="/settings"
              render={() => (isLoggedIn ? <Settings /> : <Redirect to="/" />)}
            />

            <Route to="/messages">
              <Redirect to="/" />
            </Route>

            <Route exact path="/not-found">
              <NotFound />
            </Route>

            <Route>
              <Redirect to="/not-found" />
            </Route>
          </Switch>
        </Paper>
      </Slide>
    </React.Fragment>
  );
};

const mapStateToProps = ({ AppReducers }) => {
  return {
    snackbars: AppReducers.snackbars,
    brightness: AppReducers.brightness,
    isLoggedIn: AppReducers.isLoggedIn,
  };
};

export default connect(mapStateToProps, null)(withRouter(Pages));
