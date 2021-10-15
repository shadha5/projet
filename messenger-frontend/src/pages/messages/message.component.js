import React from "react";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import cx from "clsx";
import Slide from "@mui/material/Slide";
import Badge from "@mui/material/Badge";
import { styled } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";

//  STYLES
const useStyles = makeStyles(({ palette, spacing }) => {
  const radius = spacing(2.5);
  const size = spacing(4);
  const rightBgColor = palette.primary.main;
  return {
    avatar: {
      width: size,
      height: size,
    },
    leftRow: {
      textAlign: "left",
    },
    rightRow: {
      textAlign: "right",
    },
    msg: {
      cursor: "pointer",
      padding: spacing(1, 2),
      borderRadius: 4,
      marginBottom: 4,
      display: "inline-block",
      wordBreak: "break-word",
      fontSize: "14px",
    },
    left: {
      borderTopRightRadius: radius,
      borderBottomRightRadius: radius,
      backgroundColor:
        palette.mode === "light" ? palette.grey[100] : palette.grey[900],
    },
    right: {
      borderTopLeftRadius: radius,
      borderBottomLeftRadius: radius,
      backgroundColor: rightBgColor,
      color: palette.common.white,
    },
    leftFirst: {
      borderTopLeftRadius: radius,
    },
    leftLast: {
      borderBottomLeftRadius: radius,
    },
    rightFirst: {
      borderTopRightRadius: radius,
    },
    rightLast: {
      borderBottomRightRadius: radius,
    },
  };
});

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

const Message = ({ containerRef, avatar, messages, side, isActive }) => {
  const classes = useStyles();

  const scrollToBottom = () => {
    containerRef.current.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(scrollToBottom, [messages, containerRef]);

  const attachClass = (index) => {
    if (index === 0) {
      return classes[`${side}First`];
    }
    if (index === messages.length - 1) {
      return classes[`${side}Last`];
    }
    return "";
  };

  //  RENDER
  return (
    <Box
      sx={{
        mt: "16px",
        mb: "16px",
      }}
    >
      <Grid
        container
        spacing={2}
        sx={{ justifyContent: side === "right" ? "flex-end" : "flex-start" }}
      >
        {side === "left" && (
          <Grid item>
            {isActive ? (
              <StyledBadge
                overlap="circular"
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                variant="dot"
              >
                <Avatar className={classes.avatar} />
              </StyledBadge>
            ) : (
              <Avatar className={classes.avatar} />
            )}
          </Grid>
        )}

        <Grid item xs={8}>
          {messages.map((msg, i) => {
            return (
              // eslint-disable-next-line react/no-array-index-key
              <div key={msg.id || i} className={classes[`${side}Row`]}>
                <Slide
                  direction="up"
                  in={true}
                  container={containerRef.current}
                >
                  <Typography
                    align="left"
                    className={cx(classes.msg, classes[side], attachClass(i))}
                  >
                    {msg}
                  </Typography>
                </Slide>
              </div>
            );
          })}
        </Grid>
      </Grid>
    </Box>
  );
};

export default Message;
