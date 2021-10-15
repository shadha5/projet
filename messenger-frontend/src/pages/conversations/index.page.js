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
import { ReactComponent as Image } from "../../assets/img/left.svg";

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
const Conversations = ({
  contacts,
  brightness,
  conversations,
  personId,
  history,
}) => {
  let formattedConversations = [];

  //  CONTAINER TRANSLATION REF
  const containerRef = React.useRef(null);

  conversations.forEach((conversation, i) => {
    //  GET PERSONS FROM CONTACT
    //  CONTAC THAT MATCHES SENDER RECIEVER
    const contactsData = _.filter(contacts, (contactData) => {
      return _.isEqual(
        [_.map(contactData.persons, "_id")],
        [_.map(conversation.persons, "_id")]
      );
    })[0];

    //  GET SENDER DATA FROM FILTRED CONTACTS DATA
    let contact = undefined;
    if (contactsData) {
      contact = _.filter(contactsData.persons, (person) => {
        return person._id !== personId;
      })[0];
    }

    const lastMessage = _.sortBy(conversation.messages, ["created"])[
      conversation.messages.length - 1
    ];

    if (contact) {
      if (lastMessage) {
        formattedConversations.push({
          id: contact._id,
          isActive: contact.status === "active",
          fullName: contact.first_name + " " + contact.last_name,
          image: contact.image,
          lastMessage: lastMessage
            ? lastMessage.sender === personId
              ? "You: " + lastMessage.message
              : lastMessage.message
            : undefined,
          date: lastMessage ? lastMessage.created : null,
        });
      }
    }
  });
  const sortedLists = _(formattedConversations)
    .groupBy((message) => {
      const formattedDateString = new Date(
        message.date * 1000
      ).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      const formattedTodayString = new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      const formattedYesterdayString = new Date(
        new Date(Date.now() - 86400000)
      ).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      if (formattedTodayString === formattedDateString) {
        return "Today";
      } else if (formattedYesterdayString === formattedDateString) {
        return "Yesterday";
      } else {
        return formattedDateString;
      }
    })
    .map((conversations, date) => ({ date, conversations }))
    .value();

  return (
    <Paper
      square={true}
      elevation={0}
      sx={{
        height: "calc(100vh - 148px)",
        overflowY: "scroll",
      }}
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
            No Messages!
          </Typography>
          <Typography variant="subtitle2" color="textSecondary" gutterBottom>
            Start Searching For Friends And Message Them.
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
        <List ref={containerRef} sx={{ p: 0 }}>
          {sortedLists.map((sortedList) => (
            <React.Fragment key={sortedList.date}>
              <ListSubheader>{sortedList.date}</ListSubheader>

              {sortedList.conversations.map((conversation, index) => {
                return (
                  <Slide
                    key={index}
                    direction="up"
                    in={true}
                    container={containerRef.current}
                  >
                    <ListItem
                      sx={{ bgcolor: "background.paper" }}
                      onClick={() => {
                        history.push("/messages/" + conversation.id);
                      }}
                      button
                    >
                      <ListItemAvatar>
                        {conversation.isActive ? (
                          <StyledBadge
                            overlap="circular"
                            anchorOrigin={{
                              vertical: "bottom",
                              horizontal: "right",
                            }}
                            variant="dot"
                          >
                            <Avatar
                              alt={conversation.fullName}
                              src={conversation.image}
                            />
                          </StyledBadge>
                        ) : (
                          <Avatar
                            alt={conversation.fullName}
                            src={conversation.image}
                          />
                        )}
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography
                            variant="subtitle2"
                            color="textPrimary"
                            noWrap
                          >
                            {conversation.fullName}
                          </Typography>
                        }
                        secondary={
                          <Typography component="div" sx={{ display: "flex" }}>
                            <Typography
                              sx={{ flex: 1 }}
                              variant="subtitle2"
                              color="textSecondary"
                              noWrap
                            >
                              {conversation.lastMessage}
                            </Typography>
                            <Typography
                              variant="subtitle2"
                              color="textSecondary"
                              noWrap
                            >
                              {
                                new Date(conversation.date * 1000)
                                  .toLocaleDateString("en-US", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })
                                  .split(",")[1]
                              }
                            </Typography>
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
    conversations: AppReducers.conversations,
    personId: AppReducers.person._id,
    brightness: AppReducers.brightness,
  };
};

export default connect(mapStateToProps, null)(withRouter(Conversations));
