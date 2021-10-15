import React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { connect } from "react-redux";
import * as Yup from "yup";
import { withFormik } from "formik";

//  ACTIONS
import { sendMessage } from "../../actions/basic.function";

//  ICONS
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import SendIcon from "@mui/icons-material/Send";

//  COMPONENT
const MessageInput = ({
  disabled,
  avatar,
  messages,
  side,
  errors,
  values,
  touched,
  handleBlur,
  isSubmitting,
  handleChange,
  handleSubmit,
}) => {
  //  USE THEME
  const theme = useTheme();

  //  USE MEDIA
  const mobileScreen = useMediaQuery(theme.breakpoints.down("sm"));

  //  RENDER
  return (
    <Box
      sx={{
        pb: 2,
        pt: 2,
        position: "fixed",
        bottom: 0,
        width: "100%",
        right: mobileScreen ? 0 : "calc(50% - 212px)",
        left: mobileScreen ? 0 : "calc(50% - 212px)",
        maxWidth: mobileScreen ? "100%" : "424px",
        backgroundColor: theme.palette.mode === "light" ? "#fff" : "#121212",
      }}
    >
      <form onSubmit={handleSubmit}>
        <Stack
          sx={{
            pl: 1,
            pr: 1,
          }}
          direction="row"
          spacing={1}
        >
          <IconButton
            disabled={disabled || isSubmitting}
            color="primary"
            size="small"
          >
            <InsertPhotoIcon />
          </IconButton>
          <IconButton
            disabled={disabled || isSubmitting}
            color="primary"
            size="small"
          >
            <PhotoCameraIcon />
          </IconButton>
          <TextField
            id="message"
            placeholder="Write your message..."
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.message}
            variant="outlined"
            margin="dense"
            size="small"
            fullWidth
            disabled={disabled || isSubmitting}
          />

          <IconButton
            type="submit"
            disabled={disabled || isSubmitting}
            color="primary"
            size="small"
          >
            <SendIcon />
          </IconButton>
        </Stack>
      </form>
    </Box>
  );
};

const mapDispatchToProps = (dispatch) => ({
  sendMessage: (data) => dispatch(sendMessage(data)),
});

export default connect(
  null,
  mapDispatchToProps
)(
  withFormik({
    mapPropsToValues: ({ receiver }) => {
      return {
        message: "",
      };
    },
    validationSchema: () => {
      return Yup.object().shape({
        message: Yup.string().required(),
      });
    },
    handleSubmit: (values, { props, setSubmitting, resetForm }) => {
      setTimeout(async () => {
        const result = await props.sendMessage({
          message: values.message,
          receiver: props.receiver,
        });
        if (!result.success) {
          setSubmitting(false);
        } else {
          resetForm();
        }
      }, 0);
    },
  })(MessageInput)
);
