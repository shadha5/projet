import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import Tooltip from "@mui/material/Tooltip";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

//  ICONS
import MoreVertIcon from "@mui/icons-material/MoreVert";
import LightModeIcon from "@mui/icons-material/LightMode";
import NightlightIcon from "@mui/icons-material/Nightlight";
import LogoutIcon from "@mui/icons-material/Logout";

//  ACTIONS
import { setBrightness, signOut } from "../../actions/basic.function";

//  COMPONENTS
import Search from "./search/index.component";

const Navigation = ({
  signOut,
  brightness,
  isLoggedIn,
  history,
  location,
  setBrightness,
}) => {
  //  USE THEME
  const theme = useTheme();

  //  USE MEDIA MEDIA
  const mobileScreen = useMediaQuery(theme.breakpoints.down("sm"));

  //  MENU
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar
        enableColorOnDark={true}
        position="static"
        color="primary"
        sx={{
          right: mobileScreen ? 0 : "calc(50% - 212px)",
          left: mobileScreen ? 0 : "calc(50% - 212px)",
          maxWidth: mobileScreen ? "100%" : "424px",
        }}
      >
        <Toolbar>
          <Tooltip title="SHIN">
            <Typography
              onClick={() => {
                history.push("/");
              }}
              sx={{
                cursor: "pointer",
                fontSize: "50px",
              }}
              component="span"
            >
              ש
            </Typography>
          </Tooltip>

          <Box sx={{ flexGrow: 1 }} />

          <Stack direction="row" spacing={2}>
            {brightness === "dark" ? (
              <Tooltip title="Set Light">
                <IconButton
                  onClick={() => {
                    setBrightness("light");
                  }}
                  color="inherit"
                >
                  <LightModeIcon />
                </IconButton>
              </Tooltip>
            ) : (
              <Tooltip title="Set Dark">
                <IconButton
                  onClick={() => {
                    setBrightness("dark");
                  }}
                  color="inherit"
                >
                  <NightlightIcon />
                </IconButton>
              </Tooltip>
            )}

            {isLoggedIn ? <Search /> : undefined}

            {isLoggedIn ? (
              <Tooltip title="Sign Out">
                <IconButton
                  onClick={() => {
                    signOut();
                  }}
                  color="inherit"
                >
                  <LogoutIcon />
                </IconButton>
              </Tooltip>
            ) : (
              <div>
                <Tooltip title="Menu">
                  <IconButton
                    id="menu-button"
                    color="inherit"
                    aria-label="more"
                    aria-controls="menu-button"
                    aria-expanded={open ? "true" : undefined}
                    aria-haspopup="true"
                    onClick={handleClick}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </Tooltip>
                <Menu
                  id="long-menu"
                  MenuListProps={{
                    "aria-labelledby": "long-button",
                  }}
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                >
                  <MenuItem
                    selected={location.pathname === "/"}
                    onClick={() => {
                      history.push("/");
                      handleClose();
                    }}
                  >
                    Login
                  </MenuItem>
                  <MenuItem
                    selected={location.pathname === "/sign-up"}
                    onClick={() => {
                      history.push("/sign-up");
                      handleClose();
                    }}
                  >
                    Register
                  </MenuItem>
                </Menu>
              </div>
            )}
          </Stack>
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
};

const mapStateToProps = ({ AppReducers }) => {
  return {
    brightness: AppReducers.brightness,
    isLoggedIn: AppReducers.isLoggedIn,
  };
};

const mapDispatchToProps = (dispatch) => ({
  setBrightness: (brightness) => dispatch(setBrightness(brightness)),
  signOut: () => dispatch(signOut()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Navigation));
