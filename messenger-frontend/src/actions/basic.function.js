//  IMPORT VARS AND FUNCTIONS
import { BACKEND_URL } from "./index.functions";

//  GLOBAL FUNCTIONS
export const applyRequiredActions = (errors, dispatch) => {
  errors.forEach((error) => {
    switch (error.requiredAction) {
      case "login":
        //    ACTION
        dispatch({
          type: "SET_ISLOGGEDIN",
          payload: false,
        });
        dispatch({
          type: "CASE_RESET",
        });
        break;

      default:
        break;
    }
  });
};

export const signUp = (data) => async (dispatch) => {
  const response = await fetch(BACKEND_URL + "/sign-up", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });
  const result = await response.json();

  //  ACTIONS
  if (result.success) {
    dispatch({
      type: "SET_ISLOGGEDIN",
      payload: true,
    });
    dispatch({
      type: "SET_SNACKBAR",
      payload: {
        isError: false,
        message: result.message,
      },
    });
  } else {
    //    SEND ERRORS
    dispatch({
      type: "SET_SNACKBAR",
      payload: {
        isError: true,
        errors: result.errors,
      },
    });
    await applyRequiredActions(result.errors, dispatch);
  }

  //  RETURN RESULT
  return result.success;
};

export const signIn = (data) => async (dispatch) => {
  const response = await fetch(BACKEND_URL + "/sign-in", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });
  const result = await response.json();

  //  ACTIONS
  if (result.success) {
    dispatch({
      type: "SET_ISLOGGEDIN",
      payload: true,
    });
    dispatch({
      type: "SET_SNACKBAR",
      payload: {
        isError: false,
        message: result.message,
      },
    });
  } else {
    //    SEND ERRORS
    dispatch({
      type: "SET_SNACKBAR",
      payload: {
        isError: true,
        errors: result.errors,
      },
    });
    await applyRequiredActions(result.errors, dispatch);
  }

  //  RETURN RESULT
  return result.success;
};

export const signOut = () => async (dispatch) => {
  const response = await fetch(BACKEND_URL + "/sign-out", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    credentials: "include",
  });
  const result = await response.json();

  if (result.success) {
    dispatch({
      type: "CASE_RESET",
    });
    dispatch({
      type: "SET_SNACKBAR",
      payload: {
        isError: false,
        message: result.message,
      },
    });
  } else {
    //    SEND ERRORS
    dispatch({
      type: "SET_SNACKBAR",
      payload: {
        isError: true,
        errors: result.errors,
      },
    });
    await applyRequiredActions(result.errors, dispatch);
  }

  //  RETURN RESULT
  return result.success;
};

export const verifySession = () => async (dispatch) => {
  const response = await fetch(BACKEND_URL + "/session", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    credentials: "include",
  });
  const result = await response.json();

  if (result.success) {
    dispatch({
      type: "SET_PERSON",
      payload: result.data,
    });
  } else {
    await applyRequiredActions(result.errors, dispatch);
  }

  //  RETURN RESULT
  return result.success;
};

export const updateAccount = (data) => async (dispatch) => {
  const response = await fetch(BACKEND_URL + "/account", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(data),
    credentials: "include",
  });
  const result = await response.json();

  if (result.success) {
    dispatch({
      type: "SET_PERSON",
      payload: result.data,
    });
    dispatch({
      type: "SET_SNACKBAR",
      payload: {
        isError: false,
        message: result.message,
      },
    });
  } else {
    await applyRequiredActions(result.errors, dispatch);
    //    SEND ERRORS
    dispatch({
      type: "SET_SNACKBAR",
      payload: {
        isError: true,
        errors: result.errors,
      },
    });
  }

  //  RETURN RESULT
  return result.success;
};

export const getConversations = () => async (dispatch) => {
  const response = await fetch(BACKEND_URL + "/conversations", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    credentials: "include",
  });
  const result = await response.json();

  if (result.success) {
    return dispatch({
      type: "SET_CONVERSATIONS",
      payload: result.data,
    });
  } else {
    await applyRequiredActions(result.errors, dispatch);
  }

  //  RETURN RESULT
  return result.success;
};

export const getContacts = () => async (dispatch) => {
  const response = await fetch(BACKEND_URL + "/contacts", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    credentials: "include",
  });
  const result = await response.json();

  if (result.success) {
    return dispatch({
      type: "SET_CONTACTS",
      payload: result.data,
    });
  } else {
    await applyRequiredActions(result.errors, dispatch);
  }

  //  RETURN RESULT
  return result.success;
};

export const getPersonById = (personId) => async (dispatch) => {
  const response = await fetch(BACKEND_URL + "/persons/" + personId, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    credentials: "include",
  });
  const result = await response.json();

  if (!result.success) {
    await applyRequiredActions(result.errors, dispatch);
  }

  //  RETURN DATA
  return result;
};

export const sendMessage = (data) => async (dispatch) => {
  const response = await fetch(BACKEND_URL + "/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(data),
    credentials: "include",
  });
  const result = await response.json();

  if (result.success) {
    dispatch({
      type: "PUSH_MESSAGE",
      payload: result.data,
    });
  } else {
    await applyRequiredActions(result.errors, dispatch);
  }

  //  RETURN DATA
  return result;
};

export const searchPersons = (data) => async (dispatch) => {
  const response = await fetch(BACKEND_URL + "/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(data),
    credentials: "include",
  });

  //  RETURN DATA
  return await response.json();
};

export const pushMessage = (data) => async (dispatch) => {
  return dispatch({
    type: "PUSH_MESSAGE",
    payload: data,
  });
};

export const createConversation = (data) => async (dispatch) => {
  return dispatch({
    type: "CONVERSATION_CREATED",
    payload: data,
  });
};

export const updateConversation = (data) => async (dispatch) => {
  return dispatch({
    type: "CONVERSATION_UPDATED",
    payload: data,
  });
};

export const createContact = (data) => async (dispatch) => {
  return dispatch({
    type: "CONTACT_CREATED",
    payload: data,
  });
};

export const updateContact = (data) => async (dispatch) => {
  return dispatch({
    type: "CONTACT_UPDATED",
    payload: data,
  });
};

export const setContacts = (data) => async (dispatch) => {
  return dispatch({
    type: "SET_CONTACTS",
    payload: data,
  });
};

export const setConversations = (data) => async (dispatch) => {
  return dispatch({
    type: "SET_CONVERSATIONS",
    payload: data,
  });
};

//  SETBRIGHTNESS
export const setBrightness = (brightness) => async (dispatch) => {
  return dispatch({
    type: "SET_BRIGHTNESS",
    payload: brightness,
  });
};
