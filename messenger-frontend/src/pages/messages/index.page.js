import React from "react";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Badge from "@mui/material/Badge";
import { styled } from "@mui/material/styles";

//  ACTIONS
import { getPersonById } from "../../actions/basic.function";

//  COMPONENTS
import MessageInput from "./messageInput.component";
import Message from "./message.component";

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

//    LODASH
const _ = require("lodash");

//  GET PREV STATE
const usePrevious = (value) => {
  const ref = React.useRef();
  React.useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

//  RENDER
const Messages = ({
  brightness,
  personId,
  contacts,
  getPersonById,
  conversations,
  match,
  history,
}) => {
  //  CONTAINER TRANSLATION REF
  const containerRef = React.useRef(null);

  //  GET RELATION
  const relation = _.filter(contacts, (contact) => {
    return contact.source === match.params.conversationId;
  })[0];

  //  CHECK IF PERSON EXISTS
  const [personData, setPersonData] = React.useState({
    _id: null,
    image: null,
    username: null,
    first_name: null,
    last_name: null,
    isActive: null,
  });
  const prevState = usePrevious(match.params.conversationId);

  React.useEffect(() => {
    setTimeout(async () => {
      const person = await getPersonById(match.params.conversationId);
      if (person.success) {
        if (!_.isEqual(prevState, match.params.conversationId)) {
          setPersonData({
            _id: person.data._id,
            image: person.data.image,
            username: person.data.username,
            first_name: person.data.first_name,
            last_name: person.data.last_name,
            isActive: person.data.status === "active",
          });
        }
      } else {
        history.push("/");
      }
    }, 0);
  });

  //  GET CURRENT CONVERSATION
  const conversation = _.filter(conversations, (conversation) => {
    return _.isEqual(
      _.sortBy(_.map(conversation.persons, "_id")),
      _.sortBy([match.params.conversationId, personId])
    );
  })[0];

  //  SORT MESSAGES
  let messagesResult = [];
  if (conversation) {
    messagesResult = _.sortBy(conversation.messages, (object) => {
      return object.created;
    }).reduce((acc, value) => {
      // compare the current value with the last item in the collected array
      if (acc.length && acc[acc.length - 1][0].sender === value.sender) {
        // append the current value to it if it is matching
        acc[acc.length - 1].push(value);
      } else {
        // append the new value at the end of the collected array
        acc.push([value]);
      }

      return acc;
    }, []);
  }

  return (
    <Box
      sx={{
        p: 2,
        height: "calc(100vh - 148px - 72px)",
        overflowY: "scroll",
      }}
    >
      <Box>
        {personData && !personData._id ? (
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
        ) : personData && personData.isActive ? (
          <div
            style={{
              width: "75px",
              height: "75px",
              margin: "0 auto",
              marginTop: "16px",
              marginBottom: "8px",
            }}
          >
            <StyledBadge
              overlap="circular"
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              variant="dot"
            >
              <Avatar
                sx={{
                  width: "75px",
                  height: "75px",
                }}
                alt={personData.first_name}
                src={personData.image}
              />
            </StyledBadge>
          </div>
        ) : (
          <Avatar
            sx={{
              width: "75px",
              height: "75px",
              margin: "0 auto",
              marginTop: "16px",
              marginBottom: "8px",
            }}
            alt={personData.first_name}
            src={personData.image}
          />
        )}

        {personData && !personData._id ? undefined : (
          <Typography variant="h6" align="center">
            {personData.first_name + " " + personData.last_name}
          </Typography>
        )}
      </Box>

      {personData && personData._id && messagesResult.length > 0
        ? messagesResult.map((messageData, i) => {
            return (
              <div key={i}>
                <Message
                  containerRef={containerRef}
                  side={
                    messageData[0]
                      ? messageData[0].sender === personData._id
                        ? "left"
                        : "right"
                      : ""
                  }
                  isActive={personData && personData.isActive}
                  messages={_.map(messageData, "message")}
                />
                {i === 0 && relation ? (
                  <Typography
                    color="textSecondary"
                    variant="subtitle2"
                    align="center"
                  >
                    Replying will add person to your contacts
                  </Typography>
                ) : undefined}
              </div>
            );
          })
        : undefined}

      <div ref={containerRef} />

      <MessageInput
        disabled={personData && !personData._id}
        receiver={match.params.conversationId}
      />
    </Box>
  );
};

const mapDispatchToProps = (dispatch) => ({
  getPersonById: (personId) => dispatch(getPersonById(personId)),
});

const mapStateToProps = ({ AppReducers }) => {
  return {
    conversations: AppReducers.conversations,
    contacts: AppReducers.contacts,
    personId: AppReducers.person._id,
    brightness: AppReducers.brightness,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Messages));
