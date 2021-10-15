import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

//  ICONS
import NotListedLocationIcon from "@mui/icons-material/NotListedLocation";

//  COMPONENT
const NotFound = () => {
  return (
    <Box
      sx={{
        height: "100%",
        minHeight: "553px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography component="div" variant="h6">
        NOT FOUND
      </Typography>
      <NotListedLocationIcon
        sx={{
          mt: 1,
          fontSize: 50,
        }}
      />
    </Box>
  );
};

export default NotFound;
