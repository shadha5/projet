import React from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import * as Yup from "yup";
import { withFormik } from "formik";
import LoadingButton from "@mui/lab/LoadingButton";
import { connect } from "react-redux";

//  ICONS
import { ReactComponent as Image } from "../../assets/img/sing-in.svg";

//  ACTIONS
import { signIn } from "../../actions/basic.function";

//  COMPONENT
const SignIn = ({
  errors,
  values,
  touched,
  handleBlur,
  isSubmitting,
  handleChange,
  handleSubmit,
  brightness,
  history,
}) => {
  return (
    <Box
      sx={{
        p: 2,
      }}
    >
      <Box
        sx={{
          pt: 1,
        }}
      >
        <Typography variant="h4" align="center">
          Sign In!
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            id="username"
            size="small"
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.username}
            error={touched["username"] && Boolean(errors["username"])}
            label="User Name"
            variant="outlined"
            margin="normal"
            fullWidth
          />
          <TextField
            id="password"
            size="small"
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.password}
            error={touched["password"] && Boolean(errors["password"])}
            label="Password"
            variant="outlined"
            margin="normal"
            type="password"
            fullWidth
          />

          <Stack
            sx={{
              pt: "16px",
              pb: "8px",
            }}
            direction="row"
            spacing={2}
          >
            <div
              style={{
                flex: 1,
              }}
            />

            <LoadingButton
              loading={isSubmitting}
              variant="contained"
              type="submit"
            >
              Login
            </LoadingButton>
          </Stack>
        </form>
      </Box>
      <Image
        style={{
          width: "100%",
          maxHeight: "200px",
          marginTop: "20px",
          marginBottom: "16px",
        }}
      />
      <Typography
        align="center"
        variant="caption"
        color="textSecondary"
        component="div"
      >
        SHIN © 2021
      </Typography>
    </Box>
  );
};

const mapDispatchToProps = (dispatch) => ({
  signIn: (data) => dispatch(signIn(data)),
});

export default connect(
  null,
  mapDispatchToProps
)(
  withFormik({
    mapPropsToValues: () => {
      return {
        username: "",
        password: "",
      };
    },
    validationSchema: () => {
      return Yup.object().shape({
        username: Yup.string().required("Person's username is required."),
        password: Yup.string().required("Person's password is required."),
      });
    },
    handleSubmit: (values, { props, setSubmitting }) => {
      setTimeout(async () => {
        const result = await props.signIn({
          username: values.username,
          password: values.password,
        });
        if (!result) {
          setSubmitting(false);
        }
      }, 0);
    },
  })(SignIn)
);
