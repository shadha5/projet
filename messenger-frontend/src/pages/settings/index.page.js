import React from "react";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import { withRouter } from "react-router";
import * as Yup from "yup";
import { withFormik } from "formik";
import LoadingButton from "@mui/lab/LoadingButton";
import { connect } from "react-redux";
import Avatar from "@mui/material/Avatar";
import Slide from "@mui/material/Slide";
import Typography from "@mui/material/Typography";

//  ACTIONS
import { updateAccount } from "../../actions/basic.function";

//  GET PREV STATE
const usePrevious = (value) => {
  const ref = React.useRef();
  React.useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

//    LODASH
const _ = require("lodash");

//  CHECK IF VALUES HAS BEEN CHANGED
const handleSubmitIsDisabled = (loadState, values, errors) => {
  return (
    _.isEqual(
      {
        first_name: values.first_name,
        last_name: values.last_name,
        image: values.image,
        password: values.password,
        old_password: values.password,
      },
      {
        first_name: loadState.first_name,
        last_name: loadState.last_name,
        image: loadState.image,
        password: loadState.password,
        old_password: loadState.password,
      }
    ) || Object.keys(errors).length !== 0
  );
};

//  COMPONENT
const Settings = ({
  setValues,
  errors,
  values,
  touched,
  handleBlur,
  isSubmitting,
  handleChange,
  handleSubmit,
  brightness,
  history,
  first_name,
  last_name,
  image,
}) => {
  const prevState = usePrevious({
    first_name,
    last_name,
    image,
  });

  React.useEffect(() => {
    if (
      !_.isEqual(prevState, {
        first_name,
        last_name,
        image,
      })
    ) {
      setValues({
        first_name: first_name || "",
        last_name: last_name || "",
        image: image || "",
        password: "",
        old_password: "",
      });
    }
  });

  //  SUBMIT BUTTON DISABLITY
  const submitIsDisabled = handleSubmitIsDisabled(
    {
      first_name: first_name || "",
      last_name: last_name || "",
      image: image || "",
      password: "",
      old_password: "",
    },
    values,
    errors
  );

  //  CONTAINER TRANSLATION REF
  const containerRef = React.useRef(null);

  return (
    <Box
      sx={{
        height: "calc(100vh - 148px)",
        overflowY: "scroll",
        p: 2,
      }}
    >
      <Box
        sx={{
          pt: 1,
        }}
      >
        <Typography variant="h5" gutterBottom>
          Account
        </Typography>
        <form onSubmit={handleSubmit}>
          <Stack direction="row" spacing={2}>
            <div>
              <TextField
                id="first_name"
                size="small"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.first_name}
                error={touched["first_name"] && Boolean(errors["first_name"])}
                helperText={
                  touched["first_name"] && Boolean(errors["first_name"])
                    ? errors["first_name"]
                    : undefined
                }
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
                helperText={
                  touched["last_name"] && Boolean(errors["last_name"])
                    ? errors["last_name"]
                    : undefined
                }
                label="Last Name"
                variant="outlined"
                margin="normal"
                fullWidth
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Avatar
                sx={{ width: 136, height: 136 }}
                alt={first_name}
                src={values.image}
              />
            </div>
          </Stack>

          <TextField
            ref={containerRef}
            id="password"
            size="small"
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.password}
            error={touched["password"] && Boolean(errors["password"])}
            helperText={
              touched["password"] && Boolean(errors["password"])
                ? errors["password"]
                : undefined
            }
            label="Password"
            variant="outlined"
            margin="normal"
            type="password"
            fullWidth
          />

          {values.password !== "" ? (
            <Slide
              direction="down"
              in={values.password !== ""}
              container={containerRef.current}
            >
              <TextField
                id="old_password"
                size="small"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.old_password}
                error={
                  touched["old_password"] && Boolean(errors["old_password"])
                }
                helperText={
                  touched["old_password"] && Boolean(errors["old_password"])
                    ? errors["old_password"]
                    : undefined
                }
                label="Old Password"
                variant="outlined"
                margin="normal"
                type="password"
                fullWidth
              />
            </Slide>
          ) : undefined}

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
              disabled={submitIsDisabled}
              type="submit"
              variant="contained"
            >
              Update
            </LoadingButton>
          </Stack>
        </form>
      </Box>
    </Box>
  );
};

const mapStateToProps = ({ AppReducers }) => {
  return {
    image: AppReducers.person.image,
    first_name: AppReducers.person.first_name,
    last_name: AppReducers.person.last_name,
  };
};

const mapDispatchToProps = (dispatch) => ({
  updateAccount: (data) => dispatch(updateAccount(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  withFormik({
    mapPropsToValues: ({ image, first_name, last_name }) => {
      return {
        image: image || "",
        first_name: first_name || "",
        last_name: last_name || "",
        old_password: "",
        password: "",
      };
    },
    validationSchema: () => {
      return Yup.object().shape({
        image: Yup.string(),
        password: Yup.string(),
        old_password: Yup.string(),
        first_name: Yup.string().required("Person's first name is required."),
        last_name: Yup.string().required("Person's last name is required."),
      });
    },
    handleSubmit: (values, { props, setSubmitting, resetForm }) => {
      setTimeout(async () => {
        const result = await props.updateAccount({
          first_name: values.first_name,
          last_name: values.last_name,
          image: values.image,
          password: values.password,
          old_password: values.old_password,
        });
        console.log(result);
        if (result) {
          resetForm();
        }
        setSubmitting(false);
      }, 0);
    },
  })(withRouter(Settings))
);
