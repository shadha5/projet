import React, { Suspense, lazy } from "react";
import Backdrop from "@mui/material/Backdrop";
import Typography from "@mui/material/Typography";
import { connect } from "react-redux";
import socketIOClient from "socket.io-client";

//  IMPORT VARS AND FUNCTIONS
import { SOCKET_URL } from "./actions/index.functions";

//  ACTIONS
import {
  verifySession,
  getConversations,
  getContacts,
  pushMessage,
  createContact,
  updateContact,
  createConversation,
  updateConversation,
  setContacts,
  setConversations,
} from "./actions/basic.function";

//  COMPONENTS
const Pages = lazy(() => import("./pages/index.page"));
const Theme = lazy(() => import("./main.theme.js"));

//  RENER
const App = ({
  pushMessage,
  brightness,
  isLoggedIn,
  verifySession,
  getConversations,
  createConversation,
  updateConversation,
  createContact,
  updateContact,
  getContacts,
  setContacts,
  setConversations,
}) => {
  React.useEffect(() => {
    setTimeout(async () => {
      await getConversations();
      await getContacts();
      await verifySession();
      //  SOCKET END POINT
      const socket = socketIOClient(SOCKET_URL, {
        withCredentials: true,
      });
      socket.on("setContacts", (data) => {
        setContacts(data);
      });

      socket.on("setConversations", (data) => {
        setConversations(data);
      });

      socket.on("messageCreated", (data) => {
        pushMessage(data);
      });
      socket.on("conversationCreated", (data) => {
        createConversation(data);
      });
      socket.on("conversationUpdated", (data) => {
        updateConversation(data);
      });
      socket.on("contactCreated", (data) => {
        createContact(data);
      });
      socket.on("contactUpdated", (data) => {
        updateContact(data);
      });
    }, 0);
  });

  return (
    <Suspense
      fallback={
        <Backdrop
          sx={{
            background: brightness === "light" ? "#fff" : "#121212",
          }}
          open
        >
          <Typography
            sx={{
              cursor: "pointer",
              fontSize: "100px",
              color: "#3b5998",
            }}
            component="span"
          >
            ש
          </Typography>
        </Backdrop>
      }
    >
      <Theme brightness={brightness}>
        <Pages />
      </Theme>
    </Suspense>
  );
};

const mapDispatchToProps = (dispatch) => ({
  verifySession: () => dispatch(verifySession()),
  getConversations: () => dispatch(getConversations()),
  getContacts: () => dispatch(getContacts()),
  pushMessage: (message) => dispatch(pushMessage(message)),
  createConversation: (conversation) =>
    dispatch(createConversation(conversation)),
  updateConversation: (conversation) =>
    dispatch(updateConversation(conversation)),
  createContact: (contact) => dispatch(createContact(contact)),
  updateContact: (contact) => dispatch(updateContact(contact)),
  setContacts: (contacts) => dispatch(setContacts(contacts)),
  setConversations: (conversations) =>
    dispatch(setConversations(conversations)),
});

const mapStateToProps = ({ AppReducers }) => {
  return {
    brightness: AppReducers.brightness,
    isLoggedIn: AppReducers.isLoggedIn,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
