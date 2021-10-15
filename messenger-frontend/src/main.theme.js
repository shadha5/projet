import React from "react";
import {
  createTheme,
  ThemeProvider,
  responsiveFontSizes,
} from "@mui/material/styles";

const Provider = ({ children, brightness }) => {
  let theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: brightness,
          typography: {
            fontFamily: "'Rambla', sans-serif",
          },
          primary: {
            main: "#3b5998",
          },
          secondary: {
            main: "#F9BC1A",
          },
        },
      }),
    [brightness]
  );
  theme = responsiveFontSizes(theme);
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export default Provider;
