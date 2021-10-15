import React from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import * as Yup from "yup";
import { withFormik } from "formik";
import LoadingButton from "@mui/lab/LoadingButton";
import { connect } from "react-redux";

//  ACTIONS
import { signUp } from "../../actions/basic.function";

//  COMPONENT
const SignUp = ({
  errors,
  values,
  touched,
  handleBlur,
  isSubmitting,
  handleChange,
  handleSubmit,
  brightness,
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
          pb: 2,
        }}
      >
        <Typography variant="h4" align="center">
          Sign Up!
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
            id="first_name"
            size="small"
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.first_name}
            error={touched["first_name"] && Boolean(errors["first_name"])}
            label="First Name"
            variant="outlined"
            margin="normal"
            fullWidth
          />
          <TextField
            id="last_name"
            size="small"
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.last_name}
            error={touched["last_name"] && Boolean(errors["last_name"])}
            label="Last Name"
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
              type="submit"
              variant="contained"
            >
              Register
            </LoadingButton>
          </Stack>
        </form>
      </Box>
      <Typography
        align="right"
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
  signUp: (data) => dispatch(signUp(data)),
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
        first_name: "",
        last_name: "",
      };
    },
    validationSchema: () => {
      return Yup.object().shape({
        username: Yup.string().required("Person's username is required."),
        password: Yup.string().required("Person's password is required."),
        first_name: Yup.string().required("Person's first name is required."),
        last_name: Yup.string().required("Person's last name is required."),
      });
    },
    handleSubmit: (values, { props, setSubmitting }) => {
      setTimeout(async () => {
        const result = await props.signUp({
          username: values.username,
          password: values.password,
          first_name: values.first_name,
          last_name: values.last_name,
        });
        if (!result) {
          setSubmitting(false);
        }
      }, 0);
    },
  })(SignUp)
);
