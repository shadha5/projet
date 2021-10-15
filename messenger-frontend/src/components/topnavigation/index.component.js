import * as React from "react";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import { withRouter } from "react-router";
import { useTheme } from "@mui/material/styles";
import Divider from "@mui/material/Divider";
import AppBar from "@mui/material/AppBar";
import useMediaQuery from "@mui/material/useMediaQuery";

//  ICONS
import MessageIcon from "@mui/icons-material/Message";
import ContactsIcon from "@mui/icons-material/Contacts";
import SettingsIcon from "@mui/icons-material/Settings";

const TopNavigation = ({ history, location }) => {
  //  USE THEME
  const theme = useTheme();

  //  USE MEDIA
  const mobileScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <AppBar
      position="static"
      sx={{
        position: "relative",
        zIndex: 1500,
        right: mobileScreen ? 0 : "calc(50% - 212px)",
        left: mobileScreen ? 0 : "calc(50% - 212px)",
        maxWidth: mobileScreen ? "100%" : "424px",
        backgroundColor: theme.palette.mode === "light" ? "#fff" : "#121212",
      }}
      color="default"
    >
      <Box sx={{ width: "100%" }}>
        <Tabs
          sx={{ display: "flex" }}
          value={
            location.pathname === "/"
              ? 0
              : location.pathname === "/contacts"
              ? 1
              : location.pathname === "/settings"
              ? 2
              : 0
          }
          centered
        >
          <Tab
            sx={{ flex: 1 }}
            icon={<MessageIcon />}
            label="Messages"
            onClick={() => {
              history.push("/");
            }}
          />
          <Tab
            sx={{ flex: 1 }}
            icon={<ContactsIcon />}
            label="Contacts"
            onClick={() => {
              history.push("/contacts");
            }}
          />
          <Tab
            sx={{ flex: 1 }}
            icon={<SettingsIcon />}
            label="Settings"
            onClick={() => {
              history.push("/settings");
            }}
          />
        </Tabs>
        <Divider />
      </Box>
    </AppBar>
  );
};

export default withRouter(TopNavigation);
