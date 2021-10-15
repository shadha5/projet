import uuid from "react-uuid";

//  LOAD STATE
import { loadState } from "./functions/index.functions";

//    LODASH
const _ = require("lodash");

//  FUNCTIONS
const pushMessage = (conversations, message) => {
  const newConversations = [];
  conversations.forEach((conversation, i) => {
    if (conversation._id !== message.conversation) {
      newConversations.push(conversation);
    } else {
      const newConversation = conversation;
      newConversation.messages.push(message);
      newConversation.messages = _.unionBy(newConversation.messages, "_id");
      newConversations.push(newConversation);
    }
  });
  return _.sortBy(_.unionBy(newConversations, "_id"), ["updated"]).reverse();
};

const createConversation = (conversations, newConversation) => {
  const newConversations = conversations;
  newConversations.push(newConversation);
  return _.sortBy(_.unionBy(newConversations, "_id"), ["updated"]).reverse();
};

const updateConversation = (conversations, newConversation) => {
  const newConversations = [];
  conversations.forEach((conversation, i) => {
    if (conversation._id !== newConversation._id) {
      newConversations.push(conversation);
    } else {
      newConversations.push(newConversation);
    }
  });
  return _.sortBy(_.unionBy(newConversations, "_id"), ["updated"]).reverse();
};

const createContact = (contacts, newContact) => {
  const newContacts = contacts;
  newContacts.push(newContact);
  return _.unionBy(newContacts, "_id");
};

const updateContact = (contacts, newContact) => {
  const newContacts = [];
  contacts.forEach((contact, i) => {
    if (contact._id !== newContact._id) {
      newContacts.push(contact);
    } else {
      newContacts.push(newContact);
    }
  });
  return _.unionBy(newContacts, "_id");
};

const AppReducers = (state = loadState(), action) => {
  switch (action.type) {
    case "CONTACT_UPDATED":
      return {
        ...state,
        contacts: updateContact(state.contacts, action.payload),
      };
    case "CONTACT_CREATED":
      return {
        ...state,
        contacts: createContact(state.contacts, action.payload),
      };
    case "CONVERSATION_CREATED":
      return {
        ...state,
        conversations: createConversation(state.conversations, action.payload),
      };
    case "CONVERSATION_UPDATED":
      return {
        ...state,
        conversations: updateConversation(state.conversations, action.payload),
      };
    case "PUSH_MESSAGE":
      return {
        ...state,
        conversations: pushMessage(state.conversations, action.payload),
      };
    case "SET_CONVERSATIONS":
      return {
        ...state,
        conversations: _.sortBy(_.unionBy(action.payload, "_id"), [
          "updated",
        ]).reverse(),
      };
    case "SET_CONTACTS":
      return {
        ...state,
        contacts: _.unionBy(action.payload, "_id"),
      };
    case "SET_PERSON":
      return {
        ...state,
        person: {
          _id: action.payload._id,
          image: action.payload.image,
          first_name: action.payload.first_name,
          last_name: action.payload.last_name,
        },
      };
    case "SET_SNACKBAR":
      const snackbars = [];
      if (action.payload.isError) {
        action.payload.errors.forEach((error) => {
          snackbars.push({
            id: uuid(),
            variant: "error",
            message: error.errorMessage,
            date: Date.now(),
          });
        });
      } else {
        snackbars.push({
          id: uuid(),
          variant: "success",
          message: action.payload.message,
          date: Date.now(),
        });
      }
      return { ...state, snackbars };
    case "CASE_RESET":
      return { ...loadState(), brightness: state.brightness };
    case "SET_BRIGHTNESS":
      return { ...state, brightness: action.payload };
    case "SET_ISLOGGEDIN":
      return { ...state, isLoggedIn: action.payload };
    default:
      return state;
  }
};

export default AppReducers;
