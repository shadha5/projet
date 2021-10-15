import React from "react";
import ReactDOM from "react-dom";
import rootReducer from "./reducers/routReducers";
import { BrowserRouter as Router } from "react-router-dom";
import { createStore, applyMiddleware, compose } from "redux";
import { loadState, saveState } from "./localStorage";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import App from "./App";
import "./index.css";

// LOAD STATE
const persistedState = loadState();

// CREATE STORE
const configureStore = createStore(
  rootReducer,
  persistedState,
  compose(applyMiddleware(thunk))
);

// STATE CHANGE LISTENER
configureStore.subscribe(() => {
  saveState(configureStore.getState());
});

ReactDOM.render(
  <React.StrictMode>
    <Provider store={configureStore}>
      <Router>
        <App />
      </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
