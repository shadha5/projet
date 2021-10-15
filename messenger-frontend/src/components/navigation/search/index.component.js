import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { styled, alpha } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import Typography from "@mui/material/Typography";
import { connect } from "react-redux";
import * as Yup from "yup";
import { withFormik } from "formik";
import CircularProgress from "@mui/material/CircularProgress";
import { withRouter } from "react-router";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Slide from "@mui/material/Slide";
import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";

//  ACTIONS
import { searchPersons } from "../../../actions/basic.function";

//  ICONS
import SearchIcon from "@mui/icons-material/Search";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor:
    theme.palette.mode === "light"
      ? alpha(theme.palette.common.black, 0.15)
      : alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor:
      theme.palette.mode === "light"
        ? alpha(theme.palette.common.black, 0.25)
        : alpha(theme.palette.common.white, 0.25),
  },
  marginRight: 0,
  marginLeft: 0,
  width: "100%",
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

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

const SearchComponent = ({
  values,
  setValues,
  setSubmitting,
  isSubmitting,
  searchPersons,
  history,
  resetForm,
}) => {
  const [open, setOpen] = React.useState(false);
  const [persons, setPersons] = React.useState([]);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  //  CONTAINER TRANSLATION REF
  const containerRef = React.useRef(null);

  return (
    <span>
      <Tooltip title="Search">
        <IconButton onClick={handleClickOpen} color="inherit">
          <SearchIcon />
        </IconButton>
      </Tooltip>
      <Dialog
        sx={{ zIndex: 1510 }}
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>
          <Search>
            <SearchIconWrapper>
              {isSubmitting ? <CircularProgress size={24} /> : <SearchIcon />}
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              id="words"
              size="small"
              onChange={async (e) => {
                setSubmitting(true);
                await setValues({ words: e.target.value });
                const result = await searchPersons({ words: e.target.value });
                if (result.success) {
                  await setPersons(result.data);
                  setSubmitting(false);
                }
              }}
              value={values.words}
            />
          </Search>
        </DialogTitle>
        <DialogContent>
          {persons.length === 0 ? (
            <Typography
              sx={{ marginTop: "20px" }}
              variant="body1"
              align="center"
            >
              No Data Found!
            </Typography>
          ) : (
            <List ref={containerRef} button>
              {persons.map((person, i) => (
                <React.Fragment key={i}>
                  <Slide
                    direction="up"
                    in={true}
                    container={containerRef.current}
                  >
                    <ListItem
                      sx={{ bgcolor: "background.paper" }}
                      onClick={() => {
                        history.push("/messages/" + person._id);
                        resetForm();
                        handleClose();
                      }}
                      button
                    >
                      <ListItemAvatar>
                        {person.status === "active" ? (
                          <StyledBadge
                            overlap="circular"
                            anchorOrigin={{
                              vertical: "bottom",
                              horizontal: "right",
                            }}
                            variant="dot"
                          >
                            <Avatar
                              alt={person.first_name}
                              src={person.image}
                            />
                          </StyledBadge>
                        ) : (
                          <Avatar alt={person.first_name} src={person.image} />
                        )}
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography
                            variant="subtitle2"
                            color="textPrimary"
                            noWrap
                          >
                            {person.first_name + " " + person.last_name}
                          </Typography>
                        }
                      />
                    </ListItem>
                  </Slide>
                </React.Fragment>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </span>
  );
};

const mapDispatchToProps = (dispatch) => ({
  searchPersons: (words) => dispatch(searchPersons(words)),
});

export default connect(
  null,
  mapDispatchToProps
)(
  withFormik({
    mapPropsToValues: () => {
      return {
        words: "",
      };
    },
    validationSchema: () => {
      return Yup.object().shape({
        words: Yup.string(),
      });
    },
  })(withRouter(SearchComponent))
);
