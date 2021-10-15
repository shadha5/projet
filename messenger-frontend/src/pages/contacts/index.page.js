import React from "react";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import Avatar from "@mui/material/Avatar";
import { styled } from "@mui/material/styles";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Slide from "@mui/material/Slide";

//  ICONS
import { ReactComponent as Image } from "../../assets/img/right.svg";

//    LODASH
const _ = require("lodash");

//  STYLED BADGE
const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

//  COMPONENT
const Contacts = ({ brightness, contacts, personId, history }) => {
  const formattedContacts = [];

  //  CONTAINER TRANSLATION REF
  const containerRef = React.useRef(null);

  contacts.forEach((contact, i) => {
    const contactData = _.filter(
      contact.persons,
      (object) => object._id !== personId
    )[0];
    if (contactData) {
      if (contact.type === "friends") {
        formattedContacts.push({
          id: contactData._id,
          isActive: contactData.status === "active",
          fullName: contactData.first_name + " " + contactData.last_name,
          image: contactData.image,
        });
      }
    }
  });

  const sortedLists = _.sortBy(
    _(formattedContacts)
      .groupBy((contact) => contact.fullName[0].toUpperCase())
      .map((contacts, letter) => ({ letter, contacts }))
      .value(),
    (object) => object.letter
  );

  console.log(sortedLists);

  return (
    <Paper
      square={true}
      elevation={0}
      sx={{ height: "calc(100vh - 148px)", overflowY: "scroll" }}
    >
      {!personId ? (
        <Backdrop
          sx={{
            zIndex: 1500,
            background: brightness === "light" ? "#fff" : "#121212",
            color: "#3b5998",
          }}
          open={true}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : sortedLists.length === 0 ? (
        <Box
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <Typography variant="subtitle1" color="textPrimary" gutterBottom>
            No Contacts!
          </Typography>
          <Typography variant="subtitle2" color="textSecondary" gutterBottom>
            Start Searching For Friends And Contact Them.
          </Typography>
          <Image
            style={{
              width: "100%",
              maxHeight: "200px",
              marginTop: "20px",
              marginBottom: "16px",
            }}
          />
        </Box>
      ) : (
        <List ref={containerRef} button>
          {sortedLists.map((sortedList) => (
            <React.Fragment key={sortedList.letter}>
              <ListSubheader>{sortedList.letter}</ListSubheader>

              {sortedList.contacts.map((contact, index) => {
                return (
                  <Slide
                    direction="up"
                    in={true}
                    container={containerRef.current}
                  >
                    <ListItem
                      key={index}
                      sx={{ bgcolor: "background.paper" }}
                      onClick={() => {
                        history.push("/messages/" + contact.id);
                      }}
                      button
                    >
                      <ListItemAvatar>
                        {contact.isActive ? (
                          <StyledBadge
                            overlap="circular"
                            anchorOrigin={{
                              vertical: "bottom",
                              horizontal: "right",
                            }}
                            variant="dot"
                          >
                            <Avatar
                              alt={contact.fullName}
                              src={contact.image}
                            />
                          </StyledBadge>
                        ) : (
                          <Avatar alt={contact.fullName} src={contact.image} />
                        )}
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography
                            variant="subtitle2"
                            color="textPrimary"
                            noWrap
                          >
                            {contact.fullName}
                          </Typography>
                        }
                      />
                    </ListItem>
                  </Slide>
                );
              })}
            </React.Fragment>
          ))}
        </List>
      )}
    </Paper>
  );
};

const mapStateToProps = ({ AppReducers }) => {
  return {
    contacts: AppReducers.contacts,
    personId: AppReducers.person._id,
    brightness: AppReducers.brightness,
  };
};

export default connect(mapStateToProps, null)(withRouter(Contacts));
