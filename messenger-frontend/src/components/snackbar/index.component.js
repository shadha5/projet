import React from "react";
import Slide from "@mui/material/Slide";
import MuiAlert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

//  GET PREV STATE
const usePrevious = (value) => {
  const ref = React.useRef();
  React.useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

//  LODASH
const _ = require("lodash");

//  PUSHED NOTIFICATIONS
const pushedNotifications = [];

//  MUI ALERT
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

//  SNACKBAR TRANSITION
const SlideTransition = (props) => {
  return <Slide {...props} direction="up" />;
};

//  TIME DIFF TO DISPLAY SNACK
const timeDifference = (date1, date2) => {
  const difference = date1.getTime() - date2.getTime();
  return Math.floor(difference / 1000);
};

//
const SnackbarComponent = ({ snackbars }) => {
  const [open, setOpen] = React.useState(false);

  const prevState = usePrevious(snackbars || []);

  const [currentSnack, setCurrentSnack] = React.useState({
    id: null,
    message: null,
    date: null,
    variant: null,
  });

  React.useEffect(() => {
    if (snackbars) {
      if (!_.isEqual(prevState, snackbars)) {
        const newState = _.sortBy(snackbars, ["date"])[snackbars.length - 1];
        const currentDate = Date.now();
        if (
          newState &&
          timeDifference(new Date(currentDate), new Date(newState.date)) < 5 &&
          !pushedNotifications.includes(newState.id)
        ) {
          setOpen(true);
          setCurrentSnack(newState);
          pushedNotifications.push(newState.id);
        }
      }
    }
  }, [prevState, snackbars, currentSnack]);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const handleExited = () => {
    setCurrentSnack({
      id: null,
      message: null,
      date: null,
      variant: null,
    });
  };

  return (
    <Snackbar
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      key={currentSnack && currentSnack.id}
      onClose={handleClose}
      open={currentSnack && currentSnack.id && open}
      TransitionComponent={SlideTransition}
      TransitionProps={{ onExited: handleExited }}
      autoHideDuration={5000}
    >
      <Alert
        onClose={handleClose}
        severity={currentSnack ? currentSnack.variant : undefined}
        sx={{ width: "100%" }}
      >
        {currentSnack ? currentSnack.message : undefined}
      </Alert>
    </Snackbar>
  );
};

export default SnackbarComponent;
